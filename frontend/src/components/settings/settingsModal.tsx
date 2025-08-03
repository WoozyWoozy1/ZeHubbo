type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
};

export default function SettingsModal({ isOpen, onClose, onDownload }: SettingsModalProps) {
  if (!isOpen) return null;

  const handleAniListImport = () => {
    const clientId = 29041;
    const redirectUri = encodeURIComponent("http://localhost:5173/auth/callback");
    const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
    window.location.href = authUrl;
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
