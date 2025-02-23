"use client";

const fields = ["Tech", "Medical", "Engineering", "Politics", "Sports", "Arts", "Science", "Economics", "History", "Music", "Psychology"];

export default function GameSelector({ onSelect }: { onSelect: (field: string) => void }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-purple-400 mb-4">🧠 Choose Your Field</h1>
      <p className="text-lg text-gray-300 mb-4">Select a field to play an exciting, knowledge-based game!</p>

      <select
        onChange={(e) => onSelect(e.target.value)}
        className="p-3 bg-gray-800 text-white rounded-lg border border-gray-700 shadow-lg"
      >
        <option value="">Select a Field</option>
        {fields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
    </div>
  );
}
