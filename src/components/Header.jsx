import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = () => {
    const [searchText, setSearchText] = useState(""); // State for search input
    const navigate = useNavigate();

    const handleSearch = () => {
        const query = encodeURIComponent(searchText.trim());
        navigate(`/search-movie?query=${query}`); // Navigate with an empty or provided query
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white flex items-center justify-between p-6 z-10">
            {/* NFLIX Icon */}
            <div className="min-w-0 flex-1">
                <div
                    className="text-4xl font-bold text-red-700 mr-6 cursor-pointer"
                    onClick={() => navigate("/")} // Navigate to the home page
                >
                    NFLIX
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex lg:ml-4 lg:mt-0 mx-2 w-[50%] lg:w-[600px]">
                <input
                    type="text"
                    placeholder="Search for movies..."
                    className="w-full p-2 rounded-lg text-black pr-10"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)} // Update search text
                    onKeyPress={(e) => {
                        if (e.key === "Enter") handleSearch(); // Perform search on Enter key press
                    }}
                />
                <FaSearch
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={handleSearch} // Perform search on clicking the icon
                />
            </div>

            {/* Saved List Button */}
            <div className="flex items-center ml-2">
                <button
                    className="text-l font-bold bg-red-600 text-white py-2 px-4 rounded-lg "
                    onClick={() => navigate("/my-movies")}
                >
                    Saved List
                </button>
            </div>
        </header>
    );
};

export default Header;
