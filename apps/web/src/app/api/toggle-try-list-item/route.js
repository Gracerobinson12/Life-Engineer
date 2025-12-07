import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, itemId, isCompleted } = body;

    if (!sessionId || !itemId) {
      return Response.json(
        { error: "Session ID and item ID required" },
        { status: 400 },
      );
    }

    // Get the item to check XP value
    const getItemQuery = `
      SELECT * FROM try_list_items 
      WHERE id = $1 AND session_id = $2
    `;

    const items = await sql(getItemQuery, [itemId, sessionId]);

    if (items.length === 0) {
      return Response.json({ error: "Item not found" }, { status: 404 });
    }

    const item = items[0];

    // Update the item completion status
    const updateItemQuery = `
      UPDATE try_list_items 
      SET is_completed = $1, 
          completed_at = ${isCompleted ? "CURRENT_TIMESTAMP" : "NULL"}
      WHERE id = $2 AND session_id = $3
      RETURNING *
    `;

    const updatedItems = await sql(updateItemQuery, [
      isCompleted,
      itemId,
      sessionId,
    ]);

    let xpGained = 0;
    let updatedProgress = null;

    if (isCompleted) {
      // Award XP for completing the task
      xpGained = item.xp_value;

      const updateProgressQuery = `
        UPDATE user_progress 
        SET total_xp = total_xp + $1,
            tasks_completed = tasks_completed + 1,
            last_activity_date = CURRENT_DATE,
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = $2
        RETURNING *
      `;

      const progressResult = await sql(updateProgressQuery, [
        xpGained,
        sessionId,
      ]);
      updatedProgress = progressResult[0];

      // Check for streak
      const checkStreakQuery = `
        SELECT last_activity_date, streak_days 
        FROM user_progress 
        WHERE session_id = $1
      `;

      const streakData = await sql(checkStreakQuery, [sessionId]);
      if (streakData.length > 0) {
        const lastActivity = new Date(streakData[0].last_activity_date);
        const today = new Date();
        const dayDiff = Math.floor(
          (today - lastActivity) / (1000 * 60 * 60 * 24),
        );

        let newStreak = streakData[0].streak_days;
        if (dayDiff === 1) {
          // Consecutive day - increase streak
          newStreak += 1;
        } else if (dayDiff === 0) {
          // Same day - maintain streak
          newStreak = streakData[0].streak_days;
        } else {
          // Streak broken - reset to 1
          newStreak = 1;
        }

        await sql(
          `UPDATE user_progress SET streak_days = $1 WHERE session_id = $2`,
          [newStreak, sessionId],
        );
      }
    } else {
      // Remove XP for uncompleting the task
      xpGained = -item.xp_value;

      const updateProgressQuery = `
        UPDATE user_progress 
        SET total_xp = GREATEST(0, total_xp + $1),
            tasks_completed = GREATEST(0, tasks_completed - 1),
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = $2
        RETURNING *
      `;

      const progressResult = await sql(updateProgressQuery, [
        xpGained,
        sessionId,
      ]);
      updatedProgress = progressResult[0];
    }

    return Response.json({
      success: true,
      item: updatedItems[0],
      progress: updatedProgress,
      xpGained: Math.abs(xpGained),
    });
  } catch (error) {
    console.error("Error toggling try list item:", error);
    return Response.json({ error: "Failed to update item" }, { status: 500 });
  }
}
