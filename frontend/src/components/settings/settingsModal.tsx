import { useSavedEntriesContext } from "../../hooks/savedEntriesContext";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
};

export default function SettingsModal({ isOpen, onClose, onDownload }: SettingsModalProps) {
  const { replaceAniListEntries } = useSavedEntriesContext();

  if (!isOpen) return null;

  const handleAniListImport = async () => {
    const token = localStorage.getItem("anilist_token");
    if (!token) {
      alert("No AniList token found.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/anilist/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected response:", data);
        alert("Failed to sync AniList entries.");
        return;
      }

      console.log("Fetched AniList entries:", data);
      console.log("First entry:", data[0]);

      replaceAniListEntries(data); // 💥 BULK REPLACE FIX

      alert(`Synced ${data.length} AniList entries.`);
    } catch (err) {
      console.error("Error syncing from AniList:", err);
      alert("Something went wrong while syncing.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <button
          onClick={onDownload}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
        >
          Download Save File
        </button>
        <button
          onClick={handleAniListImport}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Import from AniList
        </button>
      </div>
    </div>
  );
}
