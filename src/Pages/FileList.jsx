import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch files/folders from the Flask backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get-files');
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        setFiles(data); // Set the files returned by the API
      } catch (error) {
        setError(error.message); // Set error if fetching fails
      }
    };

    fetchFiles();
  }, []);

  // Handle folder deletion
  const handleDelete = async (folderName) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/delete-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      const data = await response.json();
      alert(data.message); // Show success message

      // Refresh the file list after deletion
      setFiles(files.filter(file => file.name !== folderName));
    } catch (error) {
      alert(error.message); // Show error message if the delete fails
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />
      <section className="container mx-auto px-12 pt-24">
        <h2 className="text-3xl font-bold px-2 pt-8 pb-8">Downloads and Saved List</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <ul className="space-y-6 px-8">
            {files.map((file, index) => (
              <li
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-transform hover:scale-105"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1 text-gray-100 truncate">
                    {file.name}
                  </h2>
                  <p className="text-sm text-gray-400">{file.size ? file.size : 'Unknown size'}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black  transition-colors"
                    onClick={""}
                  >
                    Open
                  </button>
                  <button
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => handleDelete(file.name)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default FileList;
