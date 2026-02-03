import LabelEditComponent from './LabelEditComponent';
import LabelRow from './LabelRow';
import CreateIcon from '../../icons/CreateIcon';
import Horizontal_Layout from '../../Horizontal_Layout';
import ErrorMsg from '../../msg/ErrorMsg';
import LabelIcon from '../../icons/LabelIcon';
import { useCollection } from '@/context/collection/CollectionContext';
import { CollectionStatus } from '@/context/collection/types/status/CollectionStatus';
import { PrivateCollectionStatus } from '@/context/collection/types/status/PrivateCollectionStatus';
import Vertical_Layout from '@/components/Vertical_Layout';

const LabelComponent = () => {
  const { status, editingLabelId, labels, error, startCreateLabelSession, is_public } = useCollection();

  if (status === CollectionStatus.LOADING) {
    return (
      <div className="shadow-md rounded-lg">
        <table className="table-fixed text-sm text-left rtl:text-right text-gray-500 w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 xl:px6 py-2 w-10" />
              <th scope="col" className="px-2 xl:px6 py-2 w-full">
                <Horizontal_Layout spacing='space-x-3'>
                  <LabelIcon />
                  <h1>Label</h1>
                </Horizontal_Layout>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="bg-white border-b">
                <td className="px-2 xl:px6 py-3">
                  <div className="h-4 w-4 rounded bg-gradient-to-br from-gray-100 to-gray-300 animate-pulse" />
                </td>
                <td className="px-2 xl:px6 py-3">
                  <div className="h-6 w-full max-w-[280px] rounded bg-gradient-to-br from-gray-100 to-gray-300 animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )}
  else if (status == CollectionStatus.ERROR) {
    return <ErrorMsg>{error}</ErrorMsg>
  }

  return (
    <div className="shadow-md rounded-lg group">
      <table className="table-fixed text-sm text-left rtl:text-right text-gray-500 ">
        {/* Table Header */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-2 xl:px6 py-2" />
            <th scope="col" className="px-2 xl:px6 py-2 w-full">
              <Horizontal_Layout spacing='space-x-3'>
                <LabelIcon />
                <h1>Label</h1>
              </Horizontal_Layout>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {Object.entries(labels).map(([label_id, label]) => (

            <tr key={Number(label_id)} className="bg-white border-b hover:bg-gray-50 ">
              {(status === PrivateCollectionStatus.UPDATING_LABEL || status === PrivateCollectionStatus.UPDATE_LABEL_SUBMIT) && editingLabelId === Number(label_id) ? (
                <LabelEditComponent key={Number(label_id)} />
              ) : (
                <LabelRow key={Number(label_id)} labelId={Number(label_id)} />
              )}
            </tr>
          ))}
          {!is_public &&
            <tr>
              {(status === PrivateCollectionStatus.CREATING_LABEL || status === PrivateCollectionStatus.CREATE_LABEL_SUBMIT) ? (
                <LabelEditComponent />
              ) : (
                <td colSpan="3" className="text-center bg-white ">
                  <button onClick={startCreateLabelSession} className="w-full h-full">
                    <Horizontal_Layout extraStyle={"bg-white items-center border-2 border-dashed hover:border-solid border-blue-300 rounded-lg text-blue-500 duration-500 py-1"}>
                      <CreateIcon size={22} />
                      <h1>Add New Label</h1>
                    </Horizontal_Layout>
                  </button>
                </td>
              )}
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default LabelComponent;
