import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from './Header';

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
      <Header/>
      <section className="container mx-auto px-4 pt-24">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <ul className="space-y-4">
            {files.map((file, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
                <div className="text-sm">
                  <strong className="block text-xl">{file.name}</strong> {/* File name */}
                  <span className="text-gray-400">{file.size}</span> {/* File size */}
                </div>
                <button
                  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
                  onClick={""}
                >
                  Open
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleDelete(file.name)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default FileList;
