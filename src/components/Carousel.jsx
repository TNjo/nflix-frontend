// src/components/Carousel.js
import React from 'react';

const Carousel = ({
  title,
  movies,
  index,
  movieDetails,
 // setIndex,
  goToPrevious,
  goToNext,
}) => {
  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold px-4 pt-8 pb-8">{title}</h2>
      <div className="relative flex items-center">
        {/* Fixed Area for Previous Button */}
        <div className="flex-shrink-0 w-12 sm:w-16 lg:w-20 flex justify-center">
          <button
            onClick={goToPrevious}
            className="text-white bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full"
          >
            &lt;
          </button>
        </div>

        {/* Carousel Wrapper */}
        <div className="flex py-4 overflow-hidden flex-grow">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${(index * 100) / 5}%)`,
            }}
          >
            {movies.map((movie, movieIndex) => (
              <div
                key={movieIndex}
                className="w-[285px] flex-shrink-0 bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 mx-6 flex flex-col justify-between"
              >
                <div className="relative">
                  {movie.image ? (
                    <img
                      src={movie.image}
                      alt={movie.name}
                      className="w-full h-80 rounded-t-2xl" // object-cover to image classname
                    />
                  ) : (
                    <div className="w-full h-80 bg-gray-700 flex justify-center items-center rounded-t-2xl">
                      <span className="text-white text-xl">No Image Available</span>
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
                <div className="p-4 flex flex-col h-full">
                  <h3 className="text-lg font-bold mb-4 text-white line-clamp-2">
                    {movie.name}
                  </h3>
                  <div className="mt-auto">
                    <button
                      onClick={() => movieDetails(movie.imdb, movie.info_hash, movie.name)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 mb-2 rounded-full w-full transition duration-300 shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Area for Next Button */}
        <div className="flex-shrink-0 w-12 sm:w-16 lg:w-20 flex justify-center">
          <button
            onClick={goToNext}
            className="text-white bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
