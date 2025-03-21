import { NextResponse } from "next/server";
import axios from "axios";

const MONDAY_API_URL = "https://api.monday.com/v2";
const API_KEY = process.env.MONDAY_API_TOKEN;

export async function POST(req: Request) {
  try {
    const { itemId, boardId, oldColumnId, newColumnId } = await req.json();

    // Step 1: Fetch file data from the old column
    const fileQuery = `
      query {
        items (ids: ${itemId}) {
          column_values(ids: "${oldColumnId}") {
            id
            value
          }
        }
      }
    `;

    const fileResponse = await axios.post(
      MONDAY_API_URL,
      { query: fileQuery },
      { headers: { Authorization: API_KEY, "Content-Type": "application/json" } }
    );

    const fileData = fileResponse.data.data.items[0].column_values[0].value;
    if (!fileData) return NextResponse.json({ error: "No file found!" }, { status: 400 });

    // Step 2: Move the file to the new column
    const moveMutation = `
      mutation {
        change_column_value (
          item_id: ${itemId},
          board_id: ${boardId},
          column_id: "${newColumnId}",
          value: ${JSON.stringify(fileData)}
        ) {
          id
        }
      }
    `;

    await axios.post(
      MONDAY_API_URL,
      { query: moveMutation },
      { headers: { Authorization: API_KEY, "Content-Type": "application/json" } }
    );

    return NextResponse.json({ success: true, message: "File moved successfully!" });
  } catch (error) {
    console.error("Error moving file:", error);
    return NextResponse.json({ error: "Failed to move file" }, { status: 500 });
  }
}
