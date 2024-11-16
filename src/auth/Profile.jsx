import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth"; // Import Firebase Auth
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage for images
import { storage } from "../firebase"; // Make sure to import storage
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton from MUI

export default function Profile() {
  const { isDarkTheme } = useContext(ThemeContext);
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        setUserProfile(userData);
        setDisplayName(userData.displayName);
        setEmail(userData.email);
        setLoading(false); // Stop loading when data is set
      } else {
        setUserProfile(null);
        setLoading(false); // Stop loading when data is set
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Update profile data
      await updateProfile(user, {
        displayName: displayName,
        photoURL: imageUrl || user.photoURL, // Update photo URL if image is uploaded
      });

      setUserProfile((prevProfile) => ({
        ...prevProfile,
        displayName: displayName, // Update the display name
        photoURL: imageUrl || prevProfile.photoURL, // Update the photo URL
      }));

      setIsEditing(false);
      toast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("Error updating profile.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `profile_images/${file.name}`); // Use the storage reference
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url + "?t=" + new Date().getTime()); // Append a timestamp as a query parameter
    } catch (error) {
      console.error("Error uploading image: ", error); // Log any errors
    }
  };

  return (
    <>
      <div
        className={`flex justify-center ${
          isDarkTheme
            ? "bg-gray-800 text-white shadow-6xl"
            : "bg-gray-200 text-black"
        }`}
      >
        <div className="mt-10 m-5 w-full md:w-[600px] lg:w-[800px]">
          <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-center">Profile</h1>
            <div className="flex mt-10 flex-col items-center pb-10">
              {/* {userProfile?.photoURL || imageUrl ? (
                <img
                  key={imageUrl} // Set a unique key based on the imageUrl
                  src={
                    imageUrl ||
                    userProfile?.photoURL ||
                    "https://img.icons8.com/?size=100&id=kDoeg22e5jUY&format=png&color=000000"
                  }
                  alt="Profile"
                  className={`w-32 h-32 rounded-full translate-x-2 shadow-lg ${
                    isDarkTheme ? "bg-gray-800" : "bg-gray-200"
                  }`}
                />
              ) : (
                <img
                  src="https://img.icons8.com/?size=100&id=kDoeg22e5jUY&format=png&color=000000"
                  alt="Default Profile"
                  className="w-32 h-32 rounded-full translate-x-2 shadow-lg"
                />
              )} */}

              {loading ? (
                <Skeleton variant="circular" width={128} height={128} /> // Skeleton for profile image
              ) : (
                <img
                  key={imageUrl}
                  src={
                    imageUrl ||
                    userProfile?.photoURL ||
                    "https://img.icons8.com/?size=100&id=kDoeg22e5jUY&format=png&color=000000"
                  }
                  alt="Profile"
                  className={`w-32 h-32 rounded-full translate-x-2 shadow-lg ${
                    isDarkTheme ? "bg-gray-800" : "bg-gray-200"
                  }`}
                />
              )}

              {isEditing ? (
                <div className="mt-5">
                  <div>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Display Name"
                      className={`border border-gray-300 p-2 rounded-md w-full ${
                        isDarkTheme
                          ? "text-white bg-gray-700"
                          : "text-black bg-white"
                      }`}
                    />
                  </div>
                  <div className="mt-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className={`border border-gray-300 p-2 rounded-md w-full ${
                        isDarkTheme
                          ? "text-white bg-gray-700"
                          : "text-black bg-white"
                      }`}
                    />
                  </div>
                  <div className="mt-4">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="border border-gray-300 p-2 rounded-md w-full"
                    />
                  </div>
                  <div className="mt-5 flex justify-center">
                    <button
                      onClick={handleUpdateClick}
                      className="bg-blue-500 text-white p-2 rounded mt-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-red-500 text-white p-2 rounded mt-2 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {loading ? (
                    <>
                      <span className="shadow-lg">
                        <Skeleton variant="text" width={200} height={40} />
                      </span>

                      <span>
                        <Skeleton variant="text" width={200} height={40} />
                      </span>
                    </>
                  ) : (
                    <>
                      <p className="mb-1 text-xl font-medium font-mono text-gray-900 dark:text-white">
                        Name: {userProfile?.displayName}
                      </p>
                      <span className="text-sm text-gray-900 font-mono dark:text-white">
                        Email: {userProfile?.email}
                      </span>
                    </>
                  )}
                  
                  <div className="flex justify-center mt-4 md:mt-6">
                    {loading ? (
                      <>
                        <span>
                          <Skeleton variant="text" width={50} height={60} />
                        </span>
                        <span className="ml-5">
                          <Skeleton variant="text" width={50} height={60} />
                        </span>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleEditClick}
                          className="inline-flex px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        >
                          Edit
                        </button>
                        <a
                          href="#"
                          className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                        >
                          Add
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
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
