type SettingsButtonProps = {
  onClick: () => void;
};

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 text-2xl transition-transform hover:scale-110 min-w-[40px] min-h-[40px] rounded-full"
      title="Settings"
    >
      ⚙️
    </button>
  );
}
