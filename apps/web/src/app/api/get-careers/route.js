import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return Response.json({ error: "Session ID required" }, { status: 400 });
    }

    // Get existing career matches for this session
    const careersQuery = `
      SELECT * FROM career_matches 
      WHERE session_id = $1 
      ORDER BY created_at DESC
    `;

    const careers = await sql(careersQuery, [sessionId]);

    return Response.json({
      success: true,
      careers,
    });
  } catch (error) {
    console.error("Error fetching careers:", error);
    return Response.json({ error: "Failed to fetch careers" }, { status: 500 });
  }
}
