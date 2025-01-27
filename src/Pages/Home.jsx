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

  // Fetch Movies
  useEffect(() => {
    const loadMovies = () => {
      const savedTopMovies = localStorage.getItem("topMovies");
      const savedRecentMovies = localStorage.getItem("recentMovies");
      const savedNewlyAddedMovies = localStorage.getItem("newlyAddedMovies");

      if (savedTopMovies && savedRecentMovies && savedNewlyAddedMovies) {
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

        // Set topMovies data and immediately set isLoading to false
        setTopMovies(topData.slice(0, 30)); 
        setIsLoading(false);
        setRecentMovies(recentData);
        setNewlyAddedMovies(newlyAddedData);

        // Save fetched data to localStorage
        localStorage.setItem("topMovies", JSON.stringify(topData.slice(0, 30)));
        localStorage.setItem("recentMovies", JSON.stringify(recentData));
        localStorage.setItem("newlyAddedMovies", JSON.stringify(newlyAddedData));

      } catch (error) {
        console.error("Error fetching movies:", error);
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

  const goToMovieDetails = (imdbNumber) => navigate(`/movie-details/${imdbNumber}`);

  return (
    <div className="bg-gray-900 min-h-screen text-white relative pb-8">
      <Header />
      {isLoading && <LoadingOverlay />}

      <div className="pt-24" />

      <Carousel
        title="IMDB Top Movies"
        movies={topMovies}
        index={topMoviesIndex}
        movieDetails={goToMovieDetails}
       // setIndex={setTopMoviesIndex}
        goToPrevious={goToPreviousTopMovies}
        goToNext={goToNextTopMovies}
      />

      <Carousel
        title="Recently Added Tv Series/Tv Shows"
        movies={recentMovies}
        index={recentMoviesIndex}
        movieDetails={goToMovieDetails}
      //  setIndex={setRecentMoviesIndex}
        goToPrevious={goToPreviousRecentMovies}
        goToNext={goToNextRecentMovies}
      />

      <Carousel
        title="Newly Added Movies"
        movies={newlyAddedMovies}
        index={newlyAddedMoviesIndex}
        movieDetails={goToMovieDetails}
       // setIndex={setNewlyAddedMoviesIndex}
        goToPrevious={goToPreviousNewlyAddedMovies}
        goToNext={goToNextNewlyAddedMovies}
      />
    </div>
  );
};

export default Home;
