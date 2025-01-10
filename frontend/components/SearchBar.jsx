'use client'
import Horizontal_Layout from "./Horizontal_Layout";
import SearchIcon from "./icons/SearchIcon";
import { useState } from "react";

const SearchBar = ({ handleSearch = () => {}, isHandleSearchOnChange = false }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form from reloading the page
        handleSearch(searchValue); // Trigger the search action
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value); // Update state
        if (isHandleSearchOnChange) {
            handleSearch(value); // Trigger search directly on input change
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-full shadow-lg p-1 ">
                <Horizontal_Layout spacing="space-x-1 sm:space-x-3">


                <input
                    className=" font-bold uppercase rounded-full py-2 w-full pl-4 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline lg:text-sm text-xs"
                    type="text"
                    placeholder="Search"
                    onChange={handleChange} // Separate handler for input change
                    value={searchValue} // Sync input with state
                    
                />

                <button
                    className="bg-gray-600 text-white p-2 hover:bg-blue-400 cursor-pointer mx-0.5  rounded-full"
                    type="submit" // Ensure the button is explicitly a submit button
                >
                    <SearchIcon size={20} />
                </button>
                </Horizontal_Layout>
            </div>
        </form>
    );
};

export default SearchBar;