import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [newlyAddedMovies, setNewlyAddedMovies] = useState([]); // Added state for Newly Added Movies
  const [topMoviesIndex, setTopMoviesIndex] = useState(0);
  const [recentMoviesIndex, setRecentMoviesIndex] = useState(0);
  const [newlyAddedMoviesIndex, setNewlyAddedMoviesIndex] = useState(0); // Index for Newly Added Movies
  const navigate = useNavigate();

  // Fetch Top Movies
  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/imdb/top-movies");
        const data = await response.json();
        setTopMovies(data.slice(0, 30)); // Get top 30 movies
      } catch (error) {
        console.error("Error fetching top movies:", error);
      }
    };

    fetchTopMovies();
  }, []);

  // Fetch Recently Added Movies
  useEffect(() => {
    const fetchRecentMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/newly-added-image");
        const data = await response.json();
        setRecentMovies(data);
      } catch (error) {
        console.error("Error fetching recently added movies:", error);
      }
    };

    fetchRecentMovies();
  }, []);

  // Fetch Newly Added Movies
  useEffect(() => {
    const fetchNewlyAddedMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/newly-added-movies"); // Newly Added Movies API
        const data = await response.json();
        setNewlyAddedMovies(data);
      } catch (error) {
        console.error("Error fetching newly added movies:", error);
      }
    };

    fetchNewlyAddedMovies();
  }, []);

  const goToPreviousTopMovies = () => {
    setTopMoviesIndex((prevIndex) => {
      if (prevIndex === 0) {
        return Math.floor(topMovies.length / 5) - 1;
      }
      return prevIndex - 1;
    });
  };

  const goToNextTopMovies = () => {
    setTopMoviesIndex((prevIndex) => {
      if (prevIndex === Math.floor(topMovies.length / 5) - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const goToPreviousRecentMovies = () => {
    setRecentMoviesIndex((prevIndex) => {
      if (prevIndex === 0) {
        return Math.floor(recentMovies.length / 5) - 1;
      }
      return prevIndex - 1;
    });
  };

  const goToNextRecentMovies = () => {
    setRecentMoviesIndex((prevIndex) => {
      if (prevIndex === Math.floor(recentMovies.length / 5) - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const goToPreviousNewlyAddedMovies = () => { // Navigation for Newly Added Movies
    setNewlyAddedMoviesIndex((prevIndex) => {
      if (prevIndex === 0) {
        return Math.floor(newlyAddedMovies.length / 5) - 1;
      }
      return prevIndex - 1;
    });
  };

  const goToNextNewlyAddedMovies = () => { // Navigation for Newly Added Movies
    setNewlyAddedMoviesIndex((prevIndex) => {
      if (prevIndex === Math.floor(newlyAddedMovies.length / 5) - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const goToMovieDetails = (imdbNumber) => {
    navigate(`/movie-details/${imdbNumber}`); // Navigate to movie details page using useNavigate
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header Section */}
      <header className="p-6 bg-gray-800 text-center text-6xl font-bold text-red-700">
      <button
          className="text-white text-xl font-bold text-left mr-20"
          onClick={() => navigate("/search-movie")} // Navigate to home when clicked
        >
          Search
        </button>
        NFLIX
        <button
          className="text-white text-xl font-bold text-left ml-20"
          onClick={() => navigate("/my-movies")} // Navigate to home when clicked
        >
          Saved List
        </button>
      </header>

      {/* Top Movies Section */}
      <section className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Top Movies</h2>
        <div className="relative">
          <div className="flex overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${(topMoviesIndex * 100) / 5}%)`,
              }}
            >
              {topMovies.map((movie, index) => (
                <div
                  key={index}
                  className="w-64 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden shadow-lg mx-6"
                >
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-1">
                    <h3 className="text-lg font-bold mb-2">{movie.name}</h3>
                    <button
                      onClick={() => goToMovieDetails(movie.imdb)} // On button click, navigate to details page
                      className="bg-red-600 text-white py-2 px-4 rounded mt-2 align-middle"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPreviousTopMovies}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
          >
            &lt;
          </button>
          <button
            onClick={goToNextTopMovies}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Recently Added Movies Section */}
      <section className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
        <div className="relative">
          {/* Carousel Wrapper */}
          <div className="flex overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${(recentMoviesIndex * 100) / 5}%)`,
              }}
            >
              {recentMovies.map((movie, index) => (
                <div
                  key={index}
                  className="w-64 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden shadow-lg mx-6" // Same style as top movies
                >
                  {movie.image ? (
                    <img
                      src={movie.image}
                      alt={movie.name}
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-700 flex justify-center items-center">
                      <span className="text-white text-xl">No Image Available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{movie.name}</h3>
                    {movie.details && (
                      <p className="text-sm">{movie.details}</p>
                    )}
                    <button
                      onClick={() => goToMovieDetails(movie.imdb)} // On button click, navigate to details page
                      className="bg-red-600 text-white py-2 px-4 rounded mt-2 align-middle"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons for Recently Added */}
          <button
            onClick={goToPreviousRecentMovies}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
          >
            &lt;
          </button>
          <button
            onClick={goToNextRecentMovies}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Newly Added Movies Section */}
      <section className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Newly Added Movies</h2>
        <div className="relative">
          <div className="flex overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${(newlyAddedMoviesIndex * 100) / 5}%)`,
              }}
            >
              {newlyAddedMovies.map((movie, index) => (
                <div
                  key={index}
                  className="w-64 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden shadow-lg mx-6"
                >
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-1">
                    <h3 className="text-lg font-bold mb-2">{movie.name}</h3>
                    <button
                      onClick={() => goToMovieDetails(movie.imdb)} // On button click, navigate to details page
                      className="bg-red-600 text-white py-2 px-4 rounded mt-2 align-middle"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons for Newly Added Movies */}
          <button
            onClick={goToPreviousNewlyAddedMovies}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
          >
            &lt;
          </button>
          <button
            onClick={goToNextNewlyAddedMovies}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full"
          >
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
