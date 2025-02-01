import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const MovieDetails = () => {
  const { imdbNumber } = useParams();
  const location = useLocation();
  const { infoHash, movieName } = location.state || {};
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/Get-Movie-By-ID/${imdbNumber}`
        );
        const data = await response.json();
        setMovieDetails(data);

        const trailerResponse = await fetch(
          `http://127.0.0.1:5000/Get-Trailer-By-ID/${imdbNumber}`
        );
        const trailerData = await trailerResponse.json();
        setTrailerUrl(trailerData.trailer_url);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [imdbNumber]);

  const streamMovie = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/generate-magnet/${infoHash}/${movieName}`);
      toast.success(response.data.message);
    } catch (err) {
      toast.error("Failed to generate magnet link. Please try again.");
    }
  };

  const downloadMovie = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/generate-magnet-download/${infoHash}/${movieName}`);
      toast.success(response.data.message);
    } catch (err) {
      toast.error("Failed to generate magnet link. Please try again.");
    }
  };

  const renderField = (value) => (value ? value : "Not mentioned");

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <Header />

      {/* Content Section */}
      <section className="container mx-auto p-6 flex flex-col md:flex-row items-start pt-28">
        {/* Left Section: Movie Poster */}
        <div className="w-full md:w-1/3 mr-8 ml-16">
          <img
            src={movieDetails?.image || "/path/to/default-image.jpg"}
            alt={movieDetails?.name}
            className="rounded-lg shadow-lg object-cover w-full h-[600px]"
          />
        </div>

        {/* Right Section: Movie Details */}
        <div className="w-full md:w-2/3">
          <h2 className="text-4xl font-bold mt-4 mb-4">{renderField(movieDetails?.name)}</h2>

          {/* Ratings and Votes */}
          <div className="flex items-center mb-8 text-lg text-gray-400">
            <span className="flex items-center">
              <span className="text-lg mr-2">
                {movieDetails?.aggregateRating?.ratingValue || "N/A"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-yellow-500 mr-2"
              >
                <path d="M12 2l2.39 7.26h7.64l-6.19 4.5 2.39 7.26-6.19-4.5-6.19 4.5 2.39-7.26-6.19-4.5h7.64z" />
              </svg>
            </span>
            |
            <span className="text-sm ml-4">
              {movieDetails?.aggregateRating?.ratingCount || 0} Votes
            </span>
          </div>

          <p
            className="text-lg mb-4 text-gray-300"
            style={{ letterSpacing: "0.02em" }}
          >
            {renderField(movieDetails?.description)}
          </p>

          {infoHash && (
            <div className="flex items-center gap-4 mb-6">
              {/* Play Button */}
              <button
                className="flex items-center bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                onClick={streamMovie}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="w-5 h-5 mr-1"
                >
                  <path d="M11.596 8.697l-6-4A.5.5 0 0 0 5 5v6a.5.5 0 0 0 .796.404l6-4a.5.5 0 0 0 0-.808z" />
                </svg>
                Play
              </button>

              {/* Download Button */}
              <button
                className="flex items-center bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                onClick={downloadMovie}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2"
                >
                  <path d="M12 16l4-5h-3V4h-2v7H8l4 5z" />
                  <path d="M20 18v2H4v-2h16z" />
                </svg>
                Download
              </button>
            </div>
          )}

          {/* Cast, Director, and Genres */}
          <div className="mb-6 text-md">
            {/* Genres */}
            <div className="flex mb-4">
              <span className="w-32 text-gray-400 font-medium">Genres</span>
              <span className="flex flex-wrap gap-2">
                {movieDetails?.genre?.length > 0 ? (
                  movieDetails.genre.map((genre, index) => (
                    <span
                      key={index}
                      className="border border-gray-300 text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-700 transition"
                    >
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Not mentioned</span>
                )}
              </span>
            </div>

            {/* Cast */}
            <div className="flex mb-2">
              <span className="w-32 text-gray-400 font-medium">Cast</span>
              <span className="text-white flex flex-wrap gap-3">
                {movieDetails?.actor?.length > 0 ? (
                  movieDetails.actor.map((actor, index) => (
                    <a
                      key={index}
                      href={actor.url || "#"}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {actor.name || "Not mentioned"}
                    </a>
                  ))
                ) : (
                  <span>Not mentioned</span>
                )}
              </span>
            </div>

            {/* Director */}
            <div className="flex mb-2">
              <span className="w-32 text-gray-400 font-medium">Director</span>
              <span className="text-white flex flex-wrap gap-3">
                {movieDetails?.director?.length > 0 ? (
                  movieDetails.director.map((dir, index) => (
                    <a
                      key={index}
                      href={dir.url || "#"}
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {dir.name || "Not mentioned"}
                    </a>
                  ))
                ) : (
                  <span>Not mentioned</span>
                )}
              </span>
            </div>
            {trailerUrl && (
            <button
              onClick={() => setIsTrailerOpen(true)}
              className="bg-red-600 text-white px-4 py-2 mt-2 rounded-lg text-md font-semibold hover:bg-red-700 transition"
            >
              Watch Trailer
            </button>
          )}
          </div>
        </div>
      </section>

       {/* Trailer Modal */}
       {isTrailerOpen && (
         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
         <div className="bg-gray-900 p-6 rounded-lg w-full md:w-3/4 lg:w-1/2">
           <h2 className="text-2xl font-semibold mb-4 text-white">{movieDetails?.name} - Trailer</h2>
           {trailerUrl ? (
             <video width="100%" height="auto" controls>
               <source src={trailerUrl} type="video/mp4" />
               Your browser does not support the video tag.
             </video>
           ) : (
             <p className="text-white">Trailer not available</p>
           )}
           <button
             onClick={() => setIsTrailerOpen(false)}
             className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
           >
             Close
           </button>
         </div>
       </div>
     )}
      <ToastContainer />
    </div>
  );
};

export default MovieDetails;
