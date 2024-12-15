import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const { imdbNumber } = useParams(); // Get imdbNumber from the URL
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null); // State to store trailer URL
  const navigate = useNavigate();

  console.log("IMDb Number:", imdbNumber);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/Get-Movie-By-ID/${imdbNumber}`
        );
        const data = await response.json();
        console.log("Movie details:", data);    
        setMovieDetails(data);

        // Fetch trailer URL
        const trailerResponse = await fetch(
          `http://127.0.0.1:5000/Get-Trailer-By-ID/${imdbNumber}`
        );
        const trailerData = await trailerResponse.json();
        console.log("Trailer details:", trailerData);
        setTrailerUrl(trailerData.trailer_url); // Set the trailer URL
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [imdbNumber]); // Re-fetch when imdbNumber changes

  // Helper function to render "Not mentioned" if value is null or undefined
  const renderField = (value) => {
    return value ? value : "Not mentioned";
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
        Movie Details
        <button
          className="text-white text-xl font-bold text-left ml-20"
          onClick={() => navigate("/search-movie")} // Navigate to home when clicked
        >
          Search
        </button>
      </header>

      <section className="container mx-auto p-4">
        {movieDetails ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{renderField(movieDetails.name)}</h2>
            <img
              src={movieDetails.image || "/path/to/default-image.jpg"} // Default image if null
              alt={movieDetails.name}
              className="w-full h-80 object-cover mb-4"
            />
            <p className="text-lg mb-4">{renderField(movieDetails.description)}</p>
            <p className="text-lg mb-4">IMDb Number: {renderField(imdbNumber)}</p> {/* Display IMDb number */}
            
            {/* Actors */}
            <div className="mb-4">
              <h3 className="text-xl font-bold">Cast</h3>
              <ul className="list-disc pl-6">
                {movieDetails.actor && movieDetails.actor.length > 0 ? (
                  movieDetails.actor.map((actor, index) => (
                    <li key={index}>
                      <a
                        href={actor.url || "#"} // Fallback to "#" if no URL
                        className="text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {actor.name || "Not mentioned"} {/* Display fallback if name is null */}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>Not mentioned</li>
                )}
              </ul>
            </div>

            {/* Trailer Embed */}
            {trailerUrl ? (
              <div className="mb-4">
                <h3 className="text-xl font-bold">Watch Trailer</h3>
                <video width="100%" height="400" controls>
                  <source src={trailerUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <p>Trailer not available</p>
            )}

            {/* Movie Ratings */}
            <div className="mb-4">
              <h3 className="text-xl font-bold">Ratings</h3>
              <p className="text-lg">Rating: {renderField(movieDetails.aggregateRating?.ratingValue)}</p>
              <p className="text-lg">Number of Ratings: {renderField(movieDetails.aggregateRating?.ratingCount)}</p>
            </div>

            {/* Director */}
            <div className="mb-4">
              <h3 className="text-xl font-bold">Director</h3>
              <a
                href={movieDetails.director && movieDetails.director[0]?.url || "#"} // Fallback URL
                className="text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                {renderField(movieDetails.director && movieDetails.director[0]?.name)}
              </a>
            </div>

            {/* Genre */}
            <div className="mb-4">
              <h3 className="text-xl font-bold">Genres</h3>
              <ul className="list-disc pl-6">
                {movieDetails.genre && movieDetails.genre.length > 0 ? (
                  movieDetails.genre.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))
                ) : (
                  <li>Not mentioned</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p>Loading movie details...</p>
        )}
      </section>
    </div>
  );
};

export default MovieDetails;
