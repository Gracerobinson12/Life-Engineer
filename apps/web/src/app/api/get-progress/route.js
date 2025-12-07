import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return Response.json({ error: "Session ID required" }, { status: 400 });
    }

    // Get or create user progress
    const progressQuery = `
      SELECT * FROM user_progress 
      WHERE session_id = $1
    `;

    let progress = await sql(progressQuery, [sessionId]);

    if (progress.length === 0) {
      // Create initial progress record
      const createQuery = `
        INSERT INTO user_progress (session_id, total_xp, streak_days, tasks_completed)
        VALUES ($1, 0, 0, 0)
        RETURNING *
      `;

      progress = await sql(createQuery, [sessionId]);
    }

    return Response.json({
      success: true,
      progress: progress[0],
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return Response.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}
