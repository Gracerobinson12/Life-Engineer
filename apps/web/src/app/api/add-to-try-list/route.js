import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, sourceId, type, title, description, duration } = body;

    if (!sessionId) {
      return Response.json({ error: "Session ID required" }, { status: 400 });
    }

    let tryListItem;

    if (type === "career") {
      // Get career details and generate try list items
      const careerQuery = `SELECT * FROM career_matches WHERE id = $1 AND session_id = $2`;
      const careers = await sql(careerQuery, [sourceId, sessionId]);

      if (careers.length === 0) {
        return Response.json({ error: "Career not found" }, { status: 404 });
      }

      const career = careers[0];

      // Generate try list items for this career using AI
      const tryListPrompt = `
Create 3-5 micro-experiments for someone interested in exploring the career "${career.career_title}". 
Each should be actionable tasks they can complete to learn more about this field:

Career: ${career.career_title}
Category: ${career.category}
Why it matches: ${career.reason}
Example tasks: ${career.example_tasks}

Generate try list items that vary in time commitment:
- Quick tasks (15-30 minutes): Research, reading, online exploration
- Medium tasks (1-2 hours): Networking, skill practice, projects
- Longer tasks (Weekend projects): More involved exploration

Make each item specific and actionable.
      `;

      const aiResponse = await fetch(
        "/integrations/chat-gpt/conversationgpt4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are a career exploration expert who creates actionable micro-experiments to help people explore different career paths.",
              },
              {
                role: "user",
                content: tryListPrompt,
              },
            ],
            json_schema: {
              name: "try_list_items",
              schema: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                          description:
                            "A clear, actionable title for the micro-experiment",
                        },
                        description: {
                          type: "string",
                          description:
                            "Detailed description of what to do and what they'll learn",
                        },
                        duration: {
                          type: "string",
                          description:
                            "Time commitment: '15-30 minutes', '1-2 hours', or 'Weekend project'",
                        },
                        xp_value: {
                          type: "number",
                          description:
                            "XP points to award (5 for quick, 10 for medium, 20 for weekend)",
                        },
                      },
                      required: [
                        "title",
                        "description",
                        "duration",
                        "xp_value",
                      ],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["items"],
                additionalProperties: false,
              },
            },
          }),
        },
      );

      if (!aiResponse.ok) {
        throw new Error("Failed to generate try list items");
      }

      const aiResult = await aiResponse.json();
      const tryListData = JSON.parse(aiResult.choices[0].message.content);

      // Save all generated try list items
      const savedItems = [];
      for (const item of tryListData.items) {
        const insertQuery = `
          INSERT INTO try_list_items 
          (session_id, title, description, item_type, duration, xp_value, source_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;

        const result = await sql(insertQuery, [
          sessionId,
          item.title,
          item.description,
          "career",
          item.duration,
          item.xp_value,
          sourceId,
        ]);

        savedItems.push(result[0]);
      }

      tryListItem = savedItems;
    } else if (type === "hobby") {
      // Similar logic for hobbies (will implement when hobby page is created)
      const insertQuery = `
        INSERT INTO try_list_items 
        (session_id, title, description, item_type, duration, xp_value, source_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const result = await sql(insertQuery, [
        sessionId,
        title || "Explore hobby activity",
        description || "Learn more about this hobby",
        "hobby",
        duration || "1-2 hours",
        10,
        sourceId,
      ]);

      tryListItem = result[0];
    } else {
      // Manual try list item
      const insertQuery = `
        INSERT INTO try_list_items 
        (session_id, title, description, item_type, duration, xp_value)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const result = await sql(insertQuery, [
        sessionId,
        title,
        description,
        type || "custom",
        duration || "1-2 hours",
        10,
      ]);

      tryListItem = result[0];
    }

    return Response.json({
      success: true,
      tryListItem,
    });
  } catch (error) {
    console.error("Error adding to try list:", error);
    return Response.json(
      { error: "Failed to add to try list" },
      { status: 500 },
    );
  }
}
