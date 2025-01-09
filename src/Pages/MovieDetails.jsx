// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const MovieDetails = () => {
//   const { imdbNumber } = useParams(); // Get imdbNumber from the URL
//   const [movieDetails, setMovieDetails] = useState(null);
//   const [trailerUrl, setTrailerUrl] = useState(null); // State to store trailer URL
//   const navigate = useNavigate();

//   console.log("IMDb Number:", imdbNumber);

//   useEffect(() => {
//     const fetchMovieDetails = async () => {
//       try {
//         const response = await fetch(
//           `http://127.0.0.1:5000/Get-Movie-By-ID/${imdbNumber}`
//         );
//         const data = await response.json();
//         console.log("Movie details:", data);    
//         setMovieDetails(data);

//         // Fetch trailer URL
//         const trailerResponse = await fetch(
//           `http://127.0.0.1:5000/Get-Trailer-By-ID/${imdbNumber}`
//         );
//         const trailerData = await trailerResponse.json();
//         console.log("Trailer details:", trailerData);
//         setTrailerUrl(trailerData.trailer_url); // Set the trailer URL
//       } catch (error) {
//         console.error("Error fetching movie details:", error);
//       }
//     };

//     fetchMovieDetails();
//   }, [imdbNumber]); // Re-fetch when imdbNumber changes

//   // Helper function to render "Not mentioned" if value is null or undefined
//   const renderField = (value) => {
//     return value ? value : "Not mentioned";
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen text-white">
//       <header className="p-6 bg-gray-800 text-center text-6xl font-bold text-red-700">
//         <button
//           className="text-white text-xl font-bold text-left mr-20"
//           onClick={() => navigate("/")} // Navigate to home when clicked
//         >
//           Home
//         </button>
//         Movie Details
//         <button
//           className="text-white text-xl font-bold text-left ml-20"
//           onClick={() => navigate("/search-movie")} // Navigate to home when clicked
//         >
//           Search
//         </button>
//       </header>

//       <section className="container mx-auto p-4">
//         {movieDetails ? (
//           <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold mb-4">{renderField(movieDetails.name)}</h2>
//             <img
//               src={movieDetails.image || "/path/to/default-image.jpg"} // Default image if null
//               alt={movieDetails.name}
//               className="w-full h-80 object-cover mb-4"
//             />
//             <p className="text-lg mb-4">{renderField(movieDetails.description)}</p>
//             <p className="text-lg mb-4">IMDb Number: {renderField(imdbNumber)}</p> {/* Display IMDb number */}

//             {/* Actors */}
//             <div className="mb-4">
//               <h3 className="text-xl font-bold">Cast</h3>
//               <ul className="list-disc pl-6">
//                 {movieDetails.actor && movieDetails.actor.length > 0 ? (
//                   movieDetails.actor.map((actor, index) => (
//                     <li key={index}>
//                       <a
//                         href={actor.url || "#"} // Fallback to "#" if no URL
//                         className="text-blue-400"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         {actor.name || "Not mentioned"} {/* Display fallback if name is null */}
//                       </a>
//                     </li>
//                   ))
//                 ) : (
//                   <li>Not mentioned</li>
//                 )}
//               </ul>
//             </div>

//             {/* Trailer Embed */}
//             {trailerUrl ? (
//               <div className="mb-4">
//                 <h3 className="text-xl font-bold">Watch Trailer</h3>
//                 <video width="100%" height="400" controls>
//                   <source src={trailerUrl} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//             ) : (
//               <p>Trailer not available</p>
//             )}

//             {/* Movie Ratings */}
//             <div className="mb-4">
//               <h3 className="text-xl font-bold">Ratings</h3>
//               <p className="text-lg">Rating: {renderField(movieDetails.aggregateRating?.ratingValue)}</p>
//               <p className="text-lg">Number of Ratings: {renderField(movieDetails.aggregateRating?.ratingCount)}</p>
//             </div>

//             {/* Director */}
//             <div className="mb-4">
//               <h3 className="text-xl font-bold">Director</h3>
//               <a
//                 href={movieDetails.director && movieDetails.director[0]?.url || "#"} // Fallback URL
//                 className="text-blue-400"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {renderField(movieDetails.director && movieDetails.director[0]?.name)}
//               </a>
//             </div>

//             {/* Genre */}
//             <div className="mb-4">
//               <h3 className="text-xl font-bold">Genres</h3>
//               <ul className="list-disc pl-6">
//                 {movieDetails.genre && movieDetails.genre.length > 0 ? (
//                   movieDetails.genre.map((genre, index) => (
//                     <li key={index}>{genre}</li>
//                   ))
//                 ) : (
//                   <li>Not mentioned</li>
//                 )}
//               </ul>
//             </div>
//           </div>
//         ) : (
//           <p>Loading movie details...</p>
//         )}
//       </section>
//     </div>
//   );
// };

// export default MovieDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";

const MovieDetails = () => {
  const { imdbNumber } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const renderField = (value) => (value ? value : "Not mentioned");

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <Header/>

      {/* Content Section */}
      <section className="container mx-auto p-6 flex flex-col md:flex-row items-start gap-6 pt-28">
        {/* Left Section: Movie Poster */}
        <div className="w-full md:w-1/3">
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
            
            <span className="text-sm ml-4 ">
              {movieDetails?.aggregateRating?.ratingCount || 0} Votes
            </span>
          </div>

          <p
            className="text-lg mb-4 text-gray-300"
            style={{ letterSpacing: "0.02em" }}
          >
            {renderField(movieDetails?.description)}
          </p>

          {/* Action Buttons: Play and Download */}
          <div className="flex items-center gap-4 mb-6">
            {/* Play Button */}
            <button
              className="flex items-center bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
              onClick={""}
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
              onClick={""}
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

          </div>


          {/* Trailer Button */}
          {trailerUrl && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white px-4 py-2 mt-2 rounded-lg text-md font-semibold hover:bg-red-700 transition"
            >
              Watch Trailer
            </button>
          )}

        </div>
      </section>

      {/* Trailer Modal */}
      {isModalOpen && (
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
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;

