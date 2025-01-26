import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchMoviePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query"); // Retrieve the search query
  const [searchTerm, setSearchTerm] = useState(query); // State for search input
  const [movies, setMovies] = useState([]); // State for API response
  const [error, setError] = useState(null); // State for handling errors
  const navigate = useNavigate();

  // Run fetchMovies when the query in the URL changes
  useEffect(() => {
    setSearchTerm(query); // Update the search term in the input field
    fetchMovies(query); // Fetch movies based on the query
  }, [query]);

  // Fetch movies based on the search query
  const fetchMovies = async (searchValue) => {
    if (!searchValue) {
      setMovies([]);
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:5000/search-movie/${searchValue}`);
      setMovies(response.data); // Set movies data
      setError(null);
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
      setMovies([]); // Clear movies on error
    }
  };

  // Handle search when the button is clicked
  const handleSearch = () => {
    navigate(`/search-movie?query=${encodeURIComponent(searchTerm.trim())}`); // Update the URL
  };

  // Helper function to format size (MB or GB)
  const formatSize = (size) => {
    const sizeInGB = size / (1024 * 1024 * 1024);
    return sizeInGB >= 1
      ? `${sizeInGB.toFixed(2)} GB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const streamMovie = async (info_hash, name) => {
    const response = await axios.get(`http://127.0.0.1:5000/generate-magnet/${info_hash}/${name}`);
    alert(response.data.message);
  };

  const goToMovieDetails = (imdbNumber) => {
    navigate(`/movie-details/${imdbNumber}`); // Navigate to movie details page using useNavigate
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white relative pb-8">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search text
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
        <div className="flex items-center ml-3">
          <button
            className="text-l font-bold bg-red-600 text-white py-2 px-4 rounded-lg "
            onClick={() => navigate("/my-movies")}
          >
            Saved List
          </button>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-24">
        {/* Movie List */}
        {movies.length > 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg ">
            <table className="w-full text-lg">
              <thead>
                <tr className="text-left bg-gray-700 text-gray-300">
                  <th className="px-4 py-2 w-1/4">Name</th> {/* Shortened the movie name column */}
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Seeders</th>
                  <th className="px-4 py-2">Leechers</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="px-4 py-4 break-words text-sm"> {/* Smaller text size for movie name */}
                      {/* Display movie name and ensure it wraps in two lines if long */}
                      <p className="line-clamp-2">{movie.name}</p>
                    </td>
                    <td className="px-4 py-4 text-sm">{formatSize(parseInt(movie.size))}</td> {/* Smaller text size */}
                    <td className="px-4 py-4 text-sm">{movie.seeders}</td> {/* Smaller text size */}
                    <td className="px-4 py-4 text-sm">{movie.leechers}</td> {/* Smaller text size */}
                    <td className="px-4 py-4">
                      <div className="flex space-x-4">
                        <button
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-32 text-sm"
                          onClick={() => streamMovie(movie.info_hash, movie.name)}
                        >
                          Watch
                        </button>
                        <button
                          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 w-32 text-sm"
                          onClick={() => alert('Download Movie')}
                        >
                          Download
                        </button>
                        {movie.imdb && (
                          <button
                            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 w-32 text-sm"
                            onClick={() => goToMovieDetails(movie.imdb)}
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No movies found. Try searching for a title.</p>
        )}
      </section>
    </div>
  );
};

export default SearchMoviePage;
