import express from "express";
import { db } from "../db.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create archetype prompt
function createArchetypePrompt(data) {
  return `
Create a powerful, personalized archetype profile using this data:

CliftonStrengths: ${data.strengths}
MBTI: ${data.mbti}
Enneagram: ${data.enneagram}
Holland Code: ${data.hollandCode}
Values: ${data.values?.join(", ")}
Current Hobbies: ${data.currentHobbies?.join(", ")}
Future Interests: ${data.futureHobbies}
Skills: ${data.skills}

Please return a JSON object with:
- archetype_name
- description
- work_style
- ideal_environments
- motivators
- stressors
- strengths_interpretation
- tags (array)
`;
}

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // Save profile
    await db.query(
      `INSERT INTO profiles 
      (session_id, strengths, mbti, enneagram, holland_code, assessment_values, hobbies_current, hobbies_future, skills)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (session_id) DO UPDATE SET
        strengths=$2, mbti=$3, enneagram=$4, holland_code=$5,
        assessment_values=$6, hobbies_current=$7, hobbies_future=$8, skills=$9`,
      [
        data.sessionId,
        data.strengths,
        data.mbti,
        data.enneagram,
        data.hollandCode,
        JSON.stringify(data.values),
        JSON.stringify(data.currentHobbies),
        data.futureHobbies,
        data.skills,
      ]
    );

    // AI call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional archetype generator." },
        { role: "user", content: createArchetypePrompt(data) }
      ]
    });

    const archetype = JSON.parse(response.choices[0].message.content);

    // Save archetype
    await db.query(
      `INSERT INTO archetypes 
      (session_id, archetype_name, description, work_style, ideal_environments, strengths_interpretation, stressors, motivators, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (session_id) DO UPDATE SET
        archetype_name=$2, description=$3, work_style=$4,
        ideal_environments=$5, strengths_interpretation=$6,
        stressors=$7, motivators=$8, tags=$9`,
      [
        data.sessionId,
        archetype.archetype_name,
        archetype.description,
        archetype.work_style,
        archetype.ideal_environments,
        archetype.strengths_interpretation,
        archetype.stressors,
        archetype.motivators,
        JSON.stringify(archetype.tags),
      ]
    );

    res.json({ success: true, archetype });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to generate archetype" });
  }
});

export default router;
