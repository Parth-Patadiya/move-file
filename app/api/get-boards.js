import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const API_URL = "https://api.monday.com/v2";
    const API_KEY = process.env.MONDAY_API_TOKEN;

    const query = `
      query {
        boards {
          id
          name
        }
      }
    `;

    const response = await axios.post(
      API_URL,
      { query },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data.data.boards);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
}
