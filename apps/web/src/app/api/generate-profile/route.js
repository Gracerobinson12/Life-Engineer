import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      sessionId,
      strengths,
      mbti,
      enneagram,
      hollandCode,
      values,
      currentHobbies,
      futureHobbies,
      skills,
    } = body;

    // First, save the profile data to database
    const profileQuery = `
      INSERT INTO profiles 
      (session_id, strengths, mbti, enneagram, holland_code, assessment_values, hobbies_current, hobbies_future, skills)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const profileResult = await sql(profileQuery, [
      sessionId,
      strengths,
      mbti,
      enneagram ? parseInt(enneagram) : null,
      hollandCode,
      JSON.stringify(values),
      JSON.stringify(currentHobbies),
      futureHobbies,
      skills,
    ]);

    const profileId = profileResult[0].id;

    // Generate archetype using AI
    const archetypePrompt = createArchetypePrompt({
      strengths,
      mbti,
      enneagram,
      hollandCode,
      values,
      currentHobbies,
      futureHobbies,
      skills,
    });

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
              "You are a professional career counselor and personality expert specializing in creating personalized archetype profiles. You combine insights from multiple assessment frameworks to create unique, actionable profiles.",
          },
          {
            role: "user",
            content: archetypePrompt,
          },
        ],
        json_schema: {
          name: "archetype_profile",
          schema: {
            type: "object",
            properties: {
              archetype_name: {
                type: "string",
                description:
                  "A unique, inspiring archetype name (e.g., 'The Strategic Innovator', 'The Empathetic Builder')",
              },
              description: {
                type: "string",
                description:
                  "A compelling 2-3 sentence description of this archetype",
              },
              work_style: {
                type: "string",
                description:
                  "How this person prefers to work and approach tasks",
              },
              ideal_environments: {
                type: "string",
                description:
                  "The types of work environments where this person thrives",
              },
              motivators: {
                type: "string",
                description: "What drives and energizes this person",
              },
              stressors: {
                type: "string",
                description:
                  "What situations or conditions cause stress for this person",
              },
              strengths_interpretation: {
                type: "string",
                description:
                  "How their specific strengths work together and manifest in real-world scenarios",
              },
              tags: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "3-5 key words that capture this archetype",
              },
            },
            required: [
              "archetype_name",
              "description",
              "work_style",
              "ideal_environments",
              "motivators",
              "stressors",
              "strengths_interpretation",
              "tags",
            ],
            additionalProperties: false,
          },
        },
      }),
    });

    if (!aiResponse.ok) {
      throw new Error("Failed to generate archetype");
    }

    const aiResult = await aiResponse.json();
    const archetypeData = JSON.parse(aiResult.choices[0].message.content);

    // Save archetype to database
    const archetypeQuery = `
      INSERT INTO archetypes 
      (session_id, archetype_name, description, work_style, ideal_environments, strengths_interpretation, stressors, motivators, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const archetypeResult = await sql(archetypeQuery, [
      sessionId,
      archetypeData.archetype_name,
      archetypeData.description,
      archetypeData.work_style,
      archetypeData.ideal_environments,
      archetypeData.strengths_interpretation,
      archetypeData.stressors,
      archetypeData.motivators,
      JSON.stringify(archetypeData.tags),
    ]);

    // Initialize user progress tracking
    const progressQuery = `
      INSERT INTO user_progress (session_id, total_xp, streak_days, tasks_completed)
      VALUES ($1, 0, 0, 0)
      ON CONFLICT (session_id) DO NOTHING
    `;

    await sql(progressQuery, [sessionId]);

    return Response.json({
      success: true,
      archetype: archetypeResult[0],
      profileId,
    });
  } catch (error) {
    console.error("Error generating profile:", error);
    return Response.json(
      { error: "Failed to generate profile" },
      { status: 500 },
    );
  }
}

function createArchetypePrompt({
  strengths,
  mbti,
  enneagram,
  hollandCode,
  values,
  currentHobbies,
  futureHobbies,
  skills,
}) {
  return `
Create a personalized archetype profile based on the following assessment data:

**CliftonStrengths:** ${strengths || "Not provided"}

**MBTI Type:** ${mbti || "Not provided"}

**Enneagram Type:** ${enneagram || "Not provided"}

**Holland Code (RIASEC):** ${hollandCode || "Not provided"}

**Core Values:** ${values?.length ? values.join(", ") : "Not provided"}

**Current Hobbies:** ${currentHobbies?.length ? currentHobbies.join(", ") : "Not provided"}

**Future Interest Areas:** ${futureHobbies || "Not provided"}

**Skills & Expertise:** ${skills || "Not provided"}

Please create a comprehensive archetype profile that:
1. Synthesizes insights from all provided assessments
2. Creates a unique, memorable archetype name that feels personal and inspiring
3. Provides actionable insights about work style and ideal environments
4. Identifies key motivators and potential stress triggers
5. Explains how their strengths work together in practical scenarios
6. Uses encouraging, professional language that helps the person understand themselves better

Focus on creating a cohesive narrative that shows how all these elements work together to form their unique professional and personal profile.
  `;
}
