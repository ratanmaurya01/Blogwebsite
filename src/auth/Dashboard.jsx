import React, { useState, useEffect, useContext } from "react";
import { usePosts } from "../context/PostContext";
import { db } from "../firebase";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { onAuthStateChanged } from "firebase/auth";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify"; // Import DOMPurify

import {
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../pages/Pagination";


export default function Dashboard() {
    const navigate = useNavigate();
  const { isDarkTheme } = useContext(ThemeContext);
  const { posts, loading } = usePosts(); // Destructure posts and loading
  const [newTitle, setNewTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [user, setUser] = useState(null); // To store the logged-in user

  useEffect(() => {
    const auth = getAuth();
    // Set up an authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is signed in
      } else {
        setUser(null); // User is signed out
      }
    });
    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  const userPosts = posts.filter((post) => post.userId === user?.uid);
  // Handle adding a new post
  const handleAddPost = async () => {
    if (newTitle.trim()) {
      await addDoc(collection(db, "posts"), {
        title: newTitle,
        createdAt: new Date(),
      });
      setNewTitle(""); // Clear input field after adding
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    toast("Your Post is deleted succesfully");
  };

  // Handle editing a post
  const handleEditPost = async (id, title) => {
    setEditId(id);
    setEditTitle(title);
  };

  // Handle saving the edited post
  const handleSavePost = async (id) => {
    await updateDoc(doc(db, "posts", id), { title: editTitle });
    toast("Your Post is Updated  succesfully");
    setEditId(null); // Clear the editing state after saving
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }
  const handleClicOnDashboard = () => {
    
    navigate("/PostForm");
  };



  return (
    <>
      <div>
        <div
          className={`flex  justify-center items-center ${
            isDarkTheme ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
          }`}
        >
          <div className="p-8 text-center m-1">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Posts</h2>
              {userPosts.length === 0 ? (
                <>
                  <h6 className="font-mono">No posts available</h6>

                  <button
                   onClick={handleClicOnDashboard}
                    className="inline-flex px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                  >
                    Create Post
                  </button>
                </>
              ) : (
                <ul className="space-y-4">
                  {userPosts.map((post) => (
                    <li key={post.id}>
                      <div
                        className={`p-4 w-full md:w-[600px] lg:w-[800px] rounded-lg shadow-lg flex justify-between items-center mx-auto ${
                          isDarkTheme ? "bg-gray-700" : "bg-white"
                        }`}
                      >
                        {editId === post.id ? (
                          <>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className={`border border-gray-300 p-2 rounded-md w-full ${
                                isDarkTheme
                                  ? "text-white bg-gray-700"
                                  : "text-black bg-white"
                              }`}
                            />
                            <div className="ml-4 flex">
                              <button
                                onClick={() => handleSavePost(post.id)}
                                className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditId(null)}
                                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <strong
                              className={`text-lg ${
                                isDarkTheme ? "text-white" : "text-black"
                              }`}
                            >
                              {post.title}
                            </strong>

                            <div>
                              <button
                                onClick={() =>
                                  handleEditPost(post.id, post.title)
                                }
                                className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {userPosts.length > 0 ? (
              <span>
                <Pagination />
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}
