import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('zehubbo-darkmode');
    if (stored === 'true') {
      document.documentElement.classList.add('dark');
      setEnabled(true);
    }
  }, []);

  const toggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    localStorage.setItem('zehubbo-darkmode', newState.toString());

    if (newState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggle}
      className="absolute top-4 left-4 text-2xl hover:scale-110 transition-transform min-w-[40px] min-h-[40px] rounded-full text-gray-800 dark:text-white"
      title="Toggle Dark Mode"
    >
      {enabled ? '🌙' : '☀️'}
    </button>
  );
}
