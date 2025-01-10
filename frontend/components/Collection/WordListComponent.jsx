import { useCollection } from '@/context/CollectionContext';
import React from 'react';
import KebabMenuIcon from '../icons/KebabMenuIcon';

const WordListComponent = () => {
  const { words } = useCollection();

  return (
    // <div className=" shadow-md sm:rounded-lg group ">
    //   <table
    //     className="table-fixed text-sm text-left rtl:text-right text-gray-500 transition-all duration-300 group-hover:w-full"
    //   >
    //     {/* Table Header */}
    //     <thead className="text-xs text-gray-700 uppercase bg-gray-50">
    //       <tr>
    //         <th scope="col" className="px-6 py-3 w-ful">Word</th>
    //         <th
    //           scope="col"
    //           className="px-6 py-3 w-full hidden group-hover:table-cell transition-all duration-300"
    //         >
    //           Description
    //         </th>
    //         <th
    //           scope="col"
    //           className="px-6 py-3  w-full hidden group-hover:table-cell transition-all duration-300"
    //         >
    //           Status
    //         </th>
    //         <th
    //           scope="col"
    //           className="px-6 py-3  w-full text-right hidden group-hover:table-cell transition-all duration-300"
    //         >
    //           <span className="sr-only">Actions</span>
    //         </th>
    //       </tr>
    //     </thead>

    //     {/* Table Body */}
    //     <tbody>
    //       {words?.map((word) => (
    //         <tr
    //           key={word.id}
    //           className="bg-white border-b hover:bg-gray-50 transition-colors"
    //         >
    //           {/* Word Column (Always Visible) */}
    //           <th
    //             scope="row"
    //             className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
    //           >
    //             {word.name}
    //           </th>

    //           {/* Description Column (Hidden Until Hover) */}
    //           <td className="px-6 py-4 hidden group-hover:table-cell transition-all duration-300">
    //             {word.description}
    //           </td>

    //           {/* Status Column (Hidden Until Hover) */}
    //           <td className="px-6 py-4 hidden group-hover:table-cell transition-all duration-300">
    //             {word.is_memorized ? 'Memorized' : 'Not Memorized'}
    //           </td>

    //           {/* Actions Column (Hidden Until Hover) */}
    //           <td className="px-6 py-4 text-right hidden group-hover:table-cell transition-all duration-300">
    //             <button className="hover:bg-gray-200 p-2 rounded-md">
    //               <KebabMenuIcon />
    //             </button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
    <div>hihi</div>
  );
};

export default WordListComponent;