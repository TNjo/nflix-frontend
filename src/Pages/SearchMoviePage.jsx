import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SearchMoviePage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [movies, setMovies] = useState([]); // State for API response
  const [error, setError] = useState(null); // State for handling errors
  const navigate = useNavigate();

  // Function to fetch movies when the search button is clicked
  const handleSearch = async () => {
    if (!searchTerm) return; // Prevent empty search

    try {
      const response = await axios.get(`http://127.0.0.1:5000/search-movie/${searchTerm}`);
      setMovies(response.data); // Set movies data
      setError(null);
      setSearchTerm(''); // Clear the search field after search
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      setMovies([]); // Clear movies on error
      setSearchTerm(''); // Clear the search field on error
    }
  };

  // Helper function to format size (MB or GB)
  const formatSize = (size) => {
    const sizeInGB = size / (1024 * 1024 * 1024);
    return sizeInGB >= 1
      ? `${sizeInGB.toFixed(2)} GB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const streamMovie = async(info_hash, name) => {
    const response = await axios.get(`http://127.0.0.1:5000/generate-magnet/${info_hash}/${name}`);
    alert(response.data.message);
  };

  const goToMovieDetails = (imdbNumber) => {
    navigate(`/movie-details/${imdbNumber}`); // Navigate to movie details page using useNavigate
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="p-6 bg-gray-800 text-center text-6xl font-bold text-red-700">
      <button
          className="text-white text-xl font-bold text-left mr-20"
          onClick={() => navigate("/")} // Navigate to home when clicked
        >
          Home
        </button>
        Search Movies
        <button
          className="text-white text-xl font-bold text-left ml-20"
          onClick={() => navigate("/my-movies")} // Navigate to home when clicked
        >
            Saved List
        </button>
      </header>

      <section className="container mx-auto p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-center mb-4">
            <input
              type="text"
              placeholder="Enter movie name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-1/3 text-lg rounded-lg border border-gray-600 text-black"
            />
            <button
              onClick={handleSearch}
              className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>

        {/* Movie List */}
        {movies.length > 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <table className="w-full text-lg">
              <thead>
                <tr className="text-left">
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
                    <td className="px-4 py-2 break-words text-sm"> {/* Smaller text size for movie name */}
                      {/* Display movie name and ensure it wraps in two lines if long */}
                      <p className="line-clamp-2">{movie.name}</p>
                    </td>
                    <td className="px-4 py-2 text-sm">{formatSize(parseInt(movie.size))}</td> {/* Smaller text size */}
                    <td className="px-4 py-2 text-sm">{movie.seeders}</td> {/* Smaller text size */}
                    <td className="px-4 py-2 text-sm">{movie.leechers}</td> {/* Smaller text size */}
                    <td className="px-4 py-2">
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
