import toast from 'react-hot-toast';
import { useSavedEntriesContext } from "../../hooks/savedEntriesContext";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
};

export default function SettingsModal({ isOpen, onClose, onDownload }: SettingsModalProps) {
  const { replaceAniListEntries, replaceAllEntries } = useSavedEntriesContext();

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
        headers: { "Content-Type": "application/json" },
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
          replaceAllEntries(parsed);
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-[320px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Settings
        </h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={onDownload}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Download Save File
          </button>

          <label className="w-full flex flex-col items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg shadow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            <span className="text-sm font-medium">Import Save File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={handleAniListImport}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Import from AniList
          </button>
        </div>
      </div>
    </div>
  );
}
