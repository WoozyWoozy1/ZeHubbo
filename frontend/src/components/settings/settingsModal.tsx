import toast from 'react-hot-toast';
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
      toast.error("No AniList token found.");
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
        toast.error("Failed to sync AniList entries.");
        return;
      }

      replaceAniListEntries(data);
      toast.success(`Synced ${data.length} AniList entries.`);
    } catch (err) {
      console.error("Error syncing from AniList:", err);
      toast.error("Something went wrong while syncing.");
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          replaceAniListEntries(parsed);
          toast.success(`Imported ${parsed.length} entries.`);
        } else {
          toast.error("Invalid file format.");
        }
      } catch {
        toast.error("Failed to parse file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Settings</h2>

        <button
          onClick={onDownload}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2 transition"
        >
          Download Save File
        </button>

        <input
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="w-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-white file:mr-3 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:bg-white dark:file:bg-gray-800 file:cursor-pointer mb-2"
        />

        <button
          onClick={handleAniListImport}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Import from AniList
        </button>
      </div>
    </div>
  );
}
