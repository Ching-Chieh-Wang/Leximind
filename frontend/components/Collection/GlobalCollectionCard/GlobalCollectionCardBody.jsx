import ProgressBar from '@/components/ProgressBar';
import Image from 'next/image';

const GlobalCollectionCardBody = ({
  description,
  username,
  profileImg,
  memorizedCnt,
  wordsCnt
}) => {
  return (
    <div className="px-4 pb-4 flex-grow">
      {/* Project Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3" style={{ minHeight: '4.5em' }}>
        {description}
      </p>

      {/* Memorized Text and Count */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Memorized</span>
        <span className="text-sm text-gray-500">{memorizedCnt}/{wordsCnt}</span>
      </div>

      {/* Status Bar */}
      <ProgressBar percentage={(memorizedCnt / wordsCnt) * 100} />

      {/* Footer Section */}
      <div className="px-4 py-2 border-t border-gray-200 flex justify-end items-center space-x-2">
        <span className="text-sm text-gray-500 truncate flex-grow overflow-hidden">Created by {username}</span>
        <div className="flex-shrink-0">
          <Image
            src={profileImg}
            width={32}
            height={32}
            className="rounded-full"
            alt="Profile image"
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalCollectionCardBody;