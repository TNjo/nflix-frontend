import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import Header from "../components/Header";
import LoadingOverlay from "../components/LoadingOverlay";
import Carousel from "../components/Carousel";

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [newlyAddedMovies, setNewlyAddedMovies] = useState([]); // Added state for Newly Added Movies
  const [topMoviesIndex, setTopMoviesIndex] = useState(0);
  const [recentMoviesIndex, setRecentMoviesIndex] = useState(0);
  const [newlyAddedMoviesIndex, setNewlyAddedMoviesIndex] = useState(0); // Index for Newly Added Movies
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  const checkLocalStorageExpiry = () => {
    const savedTimestamp = localStorage.getItem("moviesTimestamp");
    const currentTime = Date.now();

    if (savedTimestamp && currentTime - savedTimestamp < 15 * 60 * 1000) {
      // If last saved data is less than 15 minutes ago, return true
      return true;
    }

    // If it's expired or not present, return false
    return false;
  };

  const saveToLocalStorage = (topMovies, recentMovies, newlyAddedMovies) => {
    const currentTime = Date.now();
    localStorage.setItem("topMovies", JSON.stringify(topMovies));
    localStorage.setItem("recentMovies", JSON.stringify(recentMovies));
    localStorage.setItem("newlyAddedMovies", JSON.stringify(newlyAddedMovies));
    localStorage.setItem("moviesTimestamp", currentTime); // Save current timestamp
  };

  // Fetch Movies
  useEffect(() => {
    const loadMovies = () => {
      const savedTopMovies = localStorage.getItem("topMovies");
      const savedRecentMovies = localStorage.getItem("recentMovies");
      const savedNewlyAddedMovies = localStorage.getItem("newlyAddedMovies");

      if (checkLocalStorageExpiry() && savedTopMovies && savedRecentMovies && savedNewlyAddedMovies) {
        // If data is valid in localStorage and hasn't expired
        setTopMovies(JSON.parse(savedTopMovies));
        setRecentMovies(JSON.parse(savedRecentMovies));
        setNewlyAddedMovies(JSON.parse(savedNewlyAddedMovies));
        setIsLoading(false); // Set loading to false if data is already in localStorage
      } else {
        fetchMovies();
      }
    };

    const fetchMovies = async () => {
      try {
        const topRes = await fetch("http://127.0.0.1:5000/imdb/top-movies");
        const topData = await topRes.json();
        setTopMovies(topData.slice(0, 30));  // Set topMovies data

        // Now set isLoading to false after top movies have been fetched
        setIsLoading(false);

        // Fetch other movies
        const [recentRes, newlyAddedRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/newly-added-image"),
          fetch("http://127.0.0.1:5000/newly-added-movies"),
        ]);

        const [recentData, newlyAddedData] = await Promise.all([
          recentRes.json(),
          newlyAddedRes.json(),
        ]);

        setRecentMovies(recentData);
        setNewlyAddedMovies(newlyAddedData);

        // Save fetched data to localStorage and timestamp
        saveToLocalStorage(topData.slice(0, 30), recentData, newlyAddedData);

      } catch (error) {
        console.error("Error fetching movies:", error);
        setIsLoading(false); // In case of an error, stop loading
      }
    };

    loadMovies();
  }, []);

  // Navigation Functions
  const goToPreviousTopMovies = () => setTopMoviesIndex((prevIndex) => (prevIndex === 0 ? Math.floor(topMovies.length / 5) - 1 : prevIndex - 1));
  const goToNextTopMovies = () => setTopMoviesIndex((prevIndex) => (prevIndex === Math.floor(topMovies.length / 5) - 1 ? 0 : prevIndex + 1));

  const goToPreviousRecentMovies = () => setRecentMoviesIndex((prevIndex) => (prevIndex === 0 ? Math.floor(recentMovies.length / 5) - 1 : prevIndex - 1));
  const goToNextRecentMovies = () => setRecentMoviesIndex((prevIndex) => (prevIndex === Math.floor(recentMovies.length / 5) - 1 ? 0 : prevIndex + 1));

  const goToPreviousNewlyAddedMovies = () => setNewlyAddedMoviesIndex((prevIndex) => (prevIndex === 0 ? Math.floor(newlyAddedMovies.length / 5) - 1 : prevIndex - 1));
  const goToNextNewlyAddedMovies = () => setNewlyAddedMoviesIndex((prevIndex) => (prevIndex === Math.floor(newlyAddedMovies.length / 5) - 1 ? 0 : prevIndex + 1));

  const goToMovieDetails = (imdbNumber,infoHash, movieName) => navigate(`/movie-details/${imdbNumber}`, { state: { infoHash, movieName } });

  return (
    <div className="bg-gray-900 min-h-screen text-white relative pb-8">
      <Header />
      {isLoading && <LoadingOverlay />}

      <div className="pt-24" />

      {topMovies.length > 0 && (
      <Carousel
        title="IMDB Top Movies"
        movies={topMovies}
        index={topMoviesIndex}
        movieDetails={goToMovieDetails}
        goToPrevious={goToPreviousTopMovies}
        goToNext={goToNextTopMovies}
      />
    )}

    {recentMovies.length > 0 && (
      <Carousel
        title="Recently Added Tv Series/Tv Shows"
        movies={recentMovies}
        index={recentMoviesIndex}
        movieDetails={goToMovieDetails}
        goToPrevious={goToPreviousRecentMovies}
        goToNext={goToNextRecentMovies}
      />
    )}

    {newlyAddedMovies.length > 0 && (
      <Carousel
        title="Newly Added Movies"
        movies={newlyAddedMovies}
        index={newlyAddedMoviesIndex}
        movieDetails={goToMovieDetails}
        goToPrevious={goToPreviousNewlyAddedMovies}
        goToNext={goToNextNewlyAddedMovies}
      />
    )}
    
    </div>
  );
};

export default Home;
