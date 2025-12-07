import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return Response.json({ error: "Session ID required" }, { status: 400 });
    }

    // Get archetype data
    const archetypeQuery = `
      SELECT * FROM archetypes 
      WHERE session_id = $1
    `;
    const archetypes = await sql(archetypeQuery, [sessionId]);
    const archetype = archetypes.length > 0 ? archetypes[0] : null;

    // Get progress data
    const progressQuery = `
      SELECT * FROM user_progress 
      WHERE session_id = $1
    `;
    let progress = await sql(progressQuery, [sessionId]);

    if (progress.length === 0) {
      // Create initial progress record if it doesn't exist
      const createProgressQuery = `
        INSERT INTO user_progress (session_id, total_xp, streak_days, tasks_completed)
        VALUES ($1, 0, 0, 0)
        RETURNING *
      `;
      progress = await sql(createProgressQuery, [sessionId]);
    }

    // Get recent try list items (last 5)
    const recentTasksQuery = `
      SELECT * FROM try_list_items 
      WHERE session_id = $1 
      ORDER BY 
        CASE WHEN completed_at IS NOT NULL THEN completed_at ELSE created_at END DESC
      LIMIT 5
    `;
    const recentTasks = await sql(recentTasksQuery, [sessionId]);

    // Get summary stats
    const statsQuery = `
      SELECT 
        COUNT(*) as try_list_count,
        COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_count,
        COUNT(CASE WHEN is_completed = false THEN 1 END) as pending_count
      FROM try_list_items 
      WHERE session_id = $1
    `;
    const statsResult = await sql(statsQuery, [sessionId]);
    const stats =
      statsResult.length > 0
        ? {
            tryListCount: parseInt(statsResult[0].try_list_count),
            completedCount: parseInt(statsResult[0].completed_count),
            pendingCount: parseInt(statsResult[0].pending_count),
          }
        : {
            tryListCount: 0,
            completedCount: 0,
            pendingCount: 0,
          };

    return Response.json({
      success: true,
      archetype,
      progress: progress[0],
      recentTasks,
      stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
