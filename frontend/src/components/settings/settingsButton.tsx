type SettingsButtonProps = {
  onClick: () => void;
};

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
      title="Settings"
    >
      ⚙️
    </button>
  );
}
