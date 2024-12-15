import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import Home from './Pages/Home';
import MovieDetails from './Pages/MovieDetails';
import SearchMoviePage from './Pages/SearchMoviePage';
import FileList from './Pages/FileList';
// Make sure to import the Home component

function App() {
  return (
    <Router>
      <Routes>
        {/* Use Route within Routes component */}
        <Route path="/" element={<Home />} />
        <Route path="/movie-details/:imdbNumber" element={<MovieDetails/>} />
        <Route path='/search-movie' element={<SearchMoviePage />} />
        <Route path='/my-movies' element={<FileList />} />
      </Routes>
    </Router>
  );
}

export default App;
