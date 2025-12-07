import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return Response.json({ error: "Session ID required" }, { status: 400 });
    }

    // Get try list items for this session
    const itemsQuery = `
      SELECT * FROM try_list_items 
      WHERE session_id = $1 
      ORDER BY created_at DESC
    `;

    const items = await sql(itemsQuery, [sessionId]);

    return Response.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("Error fetching try list:", error);
    return Response.json(
      { error: "Failed to fetch try list" },
      { status: 500 },
    );
  }
}
