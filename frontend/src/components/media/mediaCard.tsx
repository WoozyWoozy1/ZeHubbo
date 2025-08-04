import type { MediaItem } from '../../types';

type MediaCardProps = {
  item: MediaItem;
  onClick?: () => void;
};

export default function MediaCard({ item, onClick }: MediaCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 rounded-md"
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-10 h-14 object-cover rounded"
        />
      )}
      <div className="flex flex-col justify-center">
        <h2 className="font-medium text-sm text-gray-800 dark:text-white">{item.title}</h2>
      </div>
    </div>
  );
}
