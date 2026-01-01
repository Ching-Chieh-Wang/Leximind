import Card from "@/components/Card";
import Horizontal_Layout from "@/components/Horizontal_Layout";
import Vertical_Layout from "@/components/Vertical_Layout";
import CreateIcon from "@/components/icons/CreateIcon";
import EditIcon from "@/components/icons/EditIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import QuestionIcon from "@/components/icons/QuestionIcon";

import { useCollection } from '@/context/collection/CollectionContext';
import { PrivateCollectionStatus } from "@/context/collection/types/status/PrivateCollectionStatus";
import removeWordRequest from "@/api/word/RemoveWord";



const WordNav = () => {
  const { words, viewingWordIdx, status, startUpdateWordSession, startCreateWordSession, 
    viewUnmemorized, id, removeWord
   } = useCollection();
  const handleDelete = () => {
    const wordId = words[viewingWordIdx].id;
    removeWordRequest(id,wordId);
    removeWord(viewingWordIdx);
  };
  const handleViewUnmemorized = async () => {
    viewUnmemorized();
  };


  return (
    <nav className="flex justify-center">
      <Card type="card">
        <Horizontal_Layout justify="between" extraStyle="text-gray-500">

          {status != 'updatingWord' && status!='updateWordLoading' &&
            <button
              className={`hover:text-blue-400 ${status == PrivateCollectionStatus.CREATING_WORD || status==PrivateCollectionStatus.CREATE_WORD_LOADING ? 'text-blue-400' : 'text-gray-500'}`}
              onClick={startCreateWordSession}
            >
              <Vertical_Layout spacing='space-y-0' extraStyle="items-center">
                <CreateIcon size={26} />
                <h1 className='text-xs hidden md:block'>Create</h1>
              </Vertical_Layout>
            </button>
          }

          {words.length !== 0 && status != PrivateCollectionStatus.CREATING_WORD && status!=PrivateCollectionStatus.CREATE_WORD_LOADING &&
            <button
              className={`hover:text-blue-400 ${status == PrivateCollectionStatus.UPDATING_WORD  ? 'text-blue-400' : 'text-gray-500'}`}
              onClick={() => startUpdateWordSession(viewingWordIdx)}
            >
              <Vertical_Layout spacing='space-y-0' extraStyle="items-center">
                <EditIcon size={26} />
                <h1 className='text-xs hidden md:block'>Edit</h1>
              </Vertical_Layout>
            </button>

          }

          {/* <button
            className={`hover:text-blue-400 ${status === 'list' ? 'text-blue-400' : 'text-gray-500'}`}
            onClick={() => {}}
          >
            <Vertical_Layout spacing='space-y-0' extraStyle="items-center">
              <ListIcon size={26} />
              <h1 className='text-xs'>List</h1>
            </Vertical_Layout>
          </button> */}

          <button
            className={`hover:text-blue-400 'text-gray-500'`}
            onClick={handleViewUnmemorized}
          >
            <Vertical_Layout spacing='space-y-0' extraStyle="items-center">
              <QuestionIcon size={26} />
              <h1 className='text-xs  hidden md:block'>Unmemorized</h1>
            </Vertical_Layout>
          </button>

          {words.length != 0 && PrivateCollectionStatus.CREATING_WORD && status!=PrivateCollectionStatus.CREATE_WORD_LOADING &&
            <button className="text-red-400 hover:text-red-500" onClick={handleDelete}>
              <Vertical_Layout spacing='space-y-0' extraStyle="items-center">
                <DeleteIcon size={26} />
                <h1 className='text-xs  hidden md:block'>Delete</h1>
              </Vertical_Layout>
            </button>
          }
        </Horizontal_Layout>
      </Card>
    </nav>
  )
}

export default WordNav