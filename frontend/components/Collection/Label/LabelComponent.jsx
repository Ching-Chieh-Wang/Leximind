import { useCollection } from '@/context/CollectionContext';
import LabelEditComponent from './LabelEditComponent';
import LabelRow from './LabelRow';
import CreateIcon from '../../icons/CreateIcon';
import Horizontal_Layout from '../../Horizontal_Layout';
import ErrorMsg from '../../msg/ErrorMsg';
import LabelIcon from '../../icons/LabelIcon';

const LabelComponent = () => {
  const { status, editingLabelIdx, labels, startCreateLabelSession, error } = useCollection(); // Ensure correct usage of the hook

  if (status === "loading") {
    return <h1>Loading Collection</h1>
  }
  else if (status == "error") {
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
          {labels.map((label, index) => (
            <tr key={label.id} className="bg-white border-b hover:bg-gray-50 ">
              {status === "updatingLabel" && editingLabelIdx === index ? (
                <LabelEditComponent key={label.id} />
              ) : (
                <LabelRow key={label.id} index={index} />
              )}
            </tr>
          ))}
          <tr>
            {status === 'creatingLabel' || status === 'createLabelLoading' ? (
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
        </tbody>
      </table>
    </div>
  );
};

export default LabelComponent;