import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import Header from "./Header";

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [newlyAddedMovies, setNewlyAddedMovies] = useState([]); // Added state for Newly Added Movies
  const [topMoviesIndex, setTopMoviesIndex] = useState(0);
  const [recentMoviesIndex, setRecentMoviesIndex] = useState(0);
  const [newlyAddedMoviesIndex, setNewlyAddedMoviesIndex] = useState(0); // Index for Newly Added Movies
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [topRes, recentRes, newlyAddedRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/imdb/top-movies"),
          fetch("http://127.0.0.1:5000/newly-added-image"),
          fetch("http://127.0.0.1:5000/newly-added-movies"),
        ]);

        const [topData, recentData, newlyAddedData] = await Promise.all([
          topRes.json(),
          recentRes.json(),
          newlyAddedRes.json(),
        ]);

        setTopMovies(topData.slice(0, 30));
        setRecentMovies(recentData);
        setNewlyAddedMovies(newlyAddedData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchMovies();
  }, []);

  const goToPreviousTopMovies = () => {
    setTopMoviesIndex((prevIndex) => {
      if (prevIndex === 0) {
        return Math.floor(window.innerWidth / 320) - 1;
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
    <div className="bg-gray-900 min-h-screen text-white relative pb-8">

      {/* Header Section */}
      <Header/>

      {/* Top Movies Section */}
      {/* Loading Overlay */}
      {/* {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
      )} */}

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen z-20">
          <div className="progress-circle"></div>
        </div>
      ) : (
        <>
          <section className="container mx-auto px-4 pt-24">
            <h2 className="text-2xl font-bold px-4 pt-8 pb-8">Top Movies</h2>
            <div className="relative flex items-center">

              {/* Fixed Area for Previous Button */}
              <div className="flex-shrink-0 w-12 sm:w-16 lg:w-20 flex justify-center">
                <button
                  onClick={goToPreviousTopMovies}
                  className="text-white bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full"
                >
                  &lt;
                </button>
              </div>

              {/* Carousel Wrapper */}
              <div className="flex overflow-hidden flex-grow">
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
                        <h3 className="text-lg font-bold mb-2 break-words max-w-xs">{movie.name}</h3>
                        {/* {movie.details && (
                          <p className="text-sm">{movie.details}</p>
                        )} */}
                        <button
                          onClick={() => goToMovieDetails(movie.imdb)}
                          className="bg-red-600 text-white py-2 px-4 rounded mt-2 align-middle"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Area for Next Button */}
              <div className="flex-shrink-0 w-12 sm:w-16 lg:w-20 flex justify-center">
                <button
                  onClick={goToNextTopMovies}
                  className="text-white bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full"
                >
                  &gt;
                </button>
              </div>
            </div>
          </section>


          {/* Recently Added Movies Section */}
          <section className="container mx-auto px-4">
            <h2 className="text-2xl font-bold px-4 pt-8 pb-8">Recently Added</h2>
            <div className="relative flex items-center">
              {/* Fixed Area for Previous Button */}
              <div className="flex-shrink-0 w-12 sm:w-16 lg:w-20 flex justify-center">
                <button
                  onClick={goToPreviousRecentMovies}
                  className="text-white bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full"
                >
                  &lt;
                </button>
              </div>

              {/* Carousel Wrapper */}
              <div className="flex overflow-hidden flex-grow">
                <div
                  className="flex transition-transform duration-500"
                  style={{
                    transform: `translateX(-${(recentMoviesIndex * 100) / 5}%)`,
                  }}
                >
                  {recentMovies.map((movie, index) => (
                    <div
                      key={index}
                      className="w-64 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden shadow-lg mx-6"
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
                        <h3 className="text-lg font-bold mb-2 break-words max-w-xs">{movie.name}</h3>
                        {/* {movie.details && (
                          <p className="text-sm">{movie.details}</p>
                        )} */}
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

              {/* Fixed Area for Next Button */}
              <div className="flex-shrink-0 w-12 sm:w-16 lg:w-20 flex justify-center">
                <button
                  onClick={goToNextRecentMovies}
                  className="text-white bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full"
                >
                  &gt;
                </button>
              </div>
            </div>
          </section>

          {/* Newly Added Movies Section */}
          <section className="container mx-auto px-4">
            <h2 className="text-2xl font-bold px-4 pt-8 pb-8">Newly Added Movies</h2>
            <div className="relative flex items-center">
              {/* Fixed Area for Previous Button */}
              <div className="flex-shrink-0 w-12 sm:w-16 lg:w-20 flex justify-center">
                <button
                  onClick={goToPreviousNewlyAddedMovies}
                  className="text-white bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full"
                >
                  &lt;
                </button>
              </div>

              {/* Carousel Wrapper */}
              <div className="flex overflow-hidden flex-grow">
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
                        <h3 className="text-lg font-bold mb-2 break-words max-w-xs">{movie.name}</h3>
                        {/* {movie.details && (
                          <p className="text-sm">{movie.details}</p>
                        )} */}
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

              {/* Fixed Area for Next Button */}
              <div className="flex-shrink-0 w-12 sm:w-16 lg:w-20 flex justify-center">
                <button
                  onClick={goToNextNewlyAddedMovies}
                  className="text-white bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full"
                >
                  &gt;
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
