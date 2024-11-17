import { formatDistanceToNow } from 'date-fns';
import ProgressBar from '@/components/ProgressBar';

const UserCollectionCardBody = ({
  description,
  created_at,
  not_memorized_cnt,
  word_cnt
}) => {
  const formattedCreatedAt = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <div className="px-4 pb-4 flex-grow">
      {/* Project Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3" style={{ minHeight: '4.5em' }}>
        {description}
      </p>

      {/* Memorized Text and Count */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{word_cnt === 0 ? "Empty" : "Memorized"}</span>
        <span className="text-sm text-gray-500">{word_cnt - not_memorized_cnt}/{word_cnt}</span>
      </div>

      {/* Status Bar */}
      <ProgressBar percentage={ ((word_cnt - not_memorized_cnt) / word_cnt) * 100} />

      {/* Footer Section */}
      <div className="px-4 py-2 border-t border-gray-200 flex justify-end items-center space-x-2">
        <span className="text-sm text-gray-500 truncate flex-grow overflow-hidden">
          Created {formattedCreatedAt}
        </span>
      </div>
    </div>
  );
};

export default UserCollectionCardBody;