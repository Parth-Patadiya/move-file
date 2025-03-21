"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState("");
  const [itemId, setItemId] = useState("");
  const [oldColumnId, setOldColumnId] = useState("");
  const [newColumnId, setNewColumnId] = useState("");
  const [message, setMessage] = useState("");

  // Fetch board list on load
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("/api/get-boards");
        const data = await response.json();
        setBoards(data);
        if (data.length > 0) setBoardId(data[0].id); // Set default board
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  const moveFile = async () => {
    try {
      const response = await fetch("/api/move-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, boardId, oldColumnId, newColumnId }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessage("✅ File moved successfully!");
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <main className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Monday.com File Mover</h2>

      {/* Board Selector */}
      <select
        value={boardId}
        onChange={(e) => setBoardId(e.target.value)}
        className="border p-2 mb-2"
      >
        <option value="">Select a Board</option>
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Item ID"
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="border p-2 mb-2"
      />

      <input
        type="text"
        placeholder="Old Column ID"
        value={oldColumnId}
        onChange={(e) => setOldColumnId(e.target.value)}
        className="border p-2 mb-2"
      />

      <input
        type="text"
        placeholder="New Column ID"
        value={newColumnId}
        onChange={(e) => setNewColumnId(e.target.value)}
        className="border p-2 mb-2"
      />

      <button onClick={moveFile} className="bg-blue-500 text-white px-4 py-2 rounded">
        Move File
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </main>
  );
}
