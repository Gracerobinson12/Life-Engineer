import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    // Get user's profile and archetype data
    const profileQuery = `
      SELECT p.*, a.archetype_name, a.description, a.work_style, a.ideal_environments, a.tags
      FROM profiles p
      LEFT JOIN archetypes a ON p.session_id = a.session_id
      WHERE p.session_id = $1
    `;

    const profiles = await sql(profileQuery, [sessionId]);

    if (profiles.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const profile = profiles[0];

    // Generate career recommendations using AI
    const careerPrompt = createCareerPrompt(profile);

    const aiResponse = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are an expert career counselor with deep knowledge of various industries, roles, and career paths. You provide practical, actionable career recommendations based on personality assessments and individual strengths.",
          },
          {
            role: "user",
            content: careerPrompt,
          },
        ],
        json_schema: {
          name: "career_recommendations",
          schema: {
            type: "object",
            properties: {
              careers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "The job title or career name",
                    },
                    category: {
                      type: "string",
                      description: "The industry or field category",
                    },
                    match_reason: {
                      type: "string",
                      description:
                        "Why this career matches their profile (2-3 sentences)",
                    },
                    example_tasks: {
                      type: "string",
                      description: "Typical day-to-day activities in this role",
                    },
                    energy_level: {
                      type: "string",
                      description:
                        "Required energy level: High, Medium, or Low",
                    },
                    income_range: {
                      type: "string",
                      description:
                        "Typical salary range (e.g., '$50k-80k', '$80k-120k')",
                    },
                    growth_potential: {
                      type: "string",
                      description: "Career advancement opportunities",
                    },
                  },
                  required: [
                    "title",
                    "category",
                    "match_reason",
                    "example_tasks",
                    "energy_level",
                    "income_range",
                    "growth_potential",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["careers"],
            additionalProperties: false,
          },
        },
      }),
    });

    if (!aiResponse.ok) {
      throw new Error("Failed to generate career recommendations");
    }

    const aiResult = await aiResponse.json();
    const careerData = JSON.parse(aiResult.choices[0].message.content);

    // Save career matches to database
    const savedCareers = [];

    for (const career of careerData.careers) {
      const careerQuery = `
        INSERT INTO career_matches 
        (session_id, career_title, category, reason, example_tasks, energy_level, income_range, xp_reward)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const result = await sql(careerQuery, [
        sessionId,
        career.title,
        career.category,
        career.match_reason,
        career.example_tasks,
        career.energy_level,
        career.income_range,
        15, // XP reward for exploring a career
      ]);

      savedCareers.push(result[0]);
    }

    return Response.json({
      success: true,
      careers: savedCareers,
    });
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    return Response.json(
      { error: "Failed to generate career recommendations" },
      { status: 500 },
    );
  }
}

function createCareerPrompt(profile) {
  const values = profile.assessment_values
    ? JSON.parse(profile.assessment_values)
    : [];
  const hobbies = profile.hobbies_current
    ? JSON.parse(profile.hobbies_current)
    : [];
  const tags = profile.tags ? JSON.parse(profile.tags) : [];

  return `
Based on the following comprehensive personality profile, generate 15 diverse career recommendations:

**Archetype:** ${profile.archetype_name || "Not specified"}
**Archetype Description:** ${profile.description || "Not provided"}

**Assessment Data:**
- CliftonStrengths: ${profile.strengths || "Not provided"}
- MBTI: ${profile.mbti || "Not provided"}  
- Enneagram: ${profile.enneagram || "Not provided"}
- Holland Code: ${profile.holland_code || "Not provided"}

**Personal Profile:**
- Core Values: ${values.join(", ") || "Not provided"}
- Current Hobbies: ${hobbies.join(", ") || "Not provided"}
- Future Interests: ${profile.hobbies_future || "Not provided"}
- Skills: ${profile.skills || "Not provided"}
- Work Style: ${profile.work_style || "Not provided"}
- Ideal Environments: ${profile.ideal_environments || "Not provided"}
- Key Tags: ${tags.join(", ") || "Not provided"}

Please provide career recommendations that:

1. **Span different industries** - Include tech, healthcare, business, creative, education, non-profit, etc.
2. **Vary in requirements** - Mix of entry-level, mid-career, and senior opportunities
3. **Match personality traits** - Align with their MBTI, Enneagram, and strengths
4. **Reflect their values** - Consider what matters most to them
5. **Build on interests** - Connect to their hobbies and future aspirations
6. **Utilize their skills** - Leverage their existing expertise
7. **Fit work style** - Match how they prefer to work and collaborate

For each career:
- Choose realistic job titles that exist in today's market
- Provide specific, actionable reasons why this role fits their profile
- Include practical day-to-day task examples
- Give accurate salary ranges based on current market data
- Assess energy requirements honestly (some people thrive in high-energy roles, others prefer steady-paced work)
- Describe realistic growth potential and advancement paths

Focus on careers that would genuinely energize this person and play to their natural strengths while offering meaningful work aligned with their values.
  `;
}
