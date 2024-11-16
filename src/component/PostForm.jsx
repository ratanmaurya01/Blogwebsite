import React, { useState, useContext, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ThemeContext } from "../context/ThemeContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Messages } from "../utils/Message";
import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore"; // Import Firestore functions


const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const categories = [
  "Technology",
  "Health",
  "Education",
  "Sports",
  "Entertainment",
];

const PostForm = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState(null); // State to store logged-in user info

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Store the current user info in state
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!content.trim()) {
      alert(Messages.EMPTY_INPUT);
      return;
    }
    if (!category.trim()) {
      alert(Messages.SELECT_CATEGORY);
      return;
    }

    try {
      const postData = {
        title,
        content,
        category,
        createdAt: new Date(),
        userId: user ? user.uid : null,
        userEmail: user ? user.email : "Guest",
        authName: user ? user.displayName : "Anonymous",
      };

      if (image) {
        await uploadImage(postData);
      } else {
        await savePost(postData);
        toast("Post created successfully!");
      }
    } catch (err) {
      console.error("Error creating post: ", err);
      alert("Error creating post. Please try again.");
    }
  };

  const uploadImage = async (postData) => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image: ", error);
        alert("Error uploading image. Please try again.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        postData.imageUrl = downloadURL;
        await savePost(postData);
        toast("Post created successfully with image!");
      }
    );
  };

  const savePost = async (postData) => {
    const postDocRef = await addDoc(collection(db, "posts"), postData);

    // Create a notification for the new post
    await addDoc(collection(db, "notifications"), {
      postId: postDocRef.id,
      title: postData.title,
      content: postData.content,
      createdAt: new Date(),
      userId: postData.userId || "Guest",
      read: false,
    });

    resetForm();
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Check if the title, content, and category fields are filled
  //   if (title.trim() === "") {
  //     alert("Please enter a title");
  //     return;
  //   }
  //   if (content.trim() === "") {
  //     alert(Messages.EMPTY_INPUT);
  //     return;
  //   }
  //   if (category.trim() === "") {
  //     alert(Messages.SELECT_CATEGORY);
  //     return;
  //   }
  
  //   try {
  //     let postData = {
  //       title,
  //       content,
  //       category,
  //       createdAt: new Date(),
  //       userId: user ? user.uid : null, // Store user ID if logged in
  //       userEmail: user ? user.email : "Guest", // Default to "Guest" if not logged in
  //       authName: user ? user.displayName : "Anonymous", // Default to "Anonymous" if not logged in
  //     };
  
  //     if (image) {
  //       // Upload image to Firebase Storage
  //       const storageRef = ref(storage, `images/${image.name}`);
  //       const uploadTask = uploadBytesResumable(storageRef, image);
  
  //       uploadTask.on(
  //         "state_changed",
  //         (snapshot) => {
  //           const progress =
  //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //           setUploadProgress(progress);
  //         },
  //         (error) => {
  //           console.error("Error uploading image: ", error);
  //           alert("Error uploading image. Please try again.");
  //         },
  //         async () => {
  //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //           postData.imageUrl = downloadURL;
  
  //           // Save post to Firestore
  //           const postDocRef = await addDoc(collection(db, "posts"), postData);
  
  //           // Create a notification for the new post without requiring a user to be logged in
  //           await addDoc(collection(db, "notifications"), {
  //             postId: postDocRef.id,
  //             title: postData.title,
  //             content: postData.content,
  //             createdAt: new Date(),
  //             userId: postData.userId || "Guest", // Set as "Guest" if no user is logged in
  //             read: false, // New property to indicate if the notification is read
  //           });
  
  //           // Reset form fields
  //           resetForm();
  //           toast("Post created successfully with image!");
  //         }
  //       );
  //     } else {
  //       // Save post to Firestore without image
  //       const postDocRef = await addDoc(collection(db, "posts"), postData);
  
  //       // Create a notification for the new post without requiring a user to be logged in
  //       await addDoc(collection(db, "notifications"), {
  //         postId: postDocRef.id,
  //         title: postData.title,
  //         content: postData.content,
  //         createdAt: new Date(),
  //         userId: postData.userId || "Guest", // Set as "Guest" if no user is logged in
  //         read: false, // New property to indicate if the notification is read
  //       });
  
  //       // Reset form fields
  //       resetForm();
  //       toast("Post created successfully!");
  //     }
  //   } catch (err) {
  //     console.error("Error adding document: ", err);
  //     alert("Error creating post. Please try again.");
  //   }
  // };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Check if the user is logged in
  //   if (!user) {
  //     alert("You must be logged in to create a post.");
  //     return;
  //   }

  //   // Check if the user is logged in
  //   if (!user) {
  //     alert("You must be logged in to create a post.");
  //     return;
  //   }

  //   if (title.trim() === "") {
  //     alert("Please enter a title");
  //     return;
  //   }
  //   if (content.trim() === "") {
  //     alert(Messages.EMPTY_INPUT);
  //     return;
  //   }
  //   if (category.trim() === "") {
  //     alert(Messages.SELECT_COTOGARY);
  //     return;
  //   }

  //   try {
  //     let postData = {
  //       title,
  //       content,
  //       category,
  //       createdAt: new Date(),
  //       userId: user.uid,
  //       userEmail: user.email,
  //       authName: user.displayName,
  //     };

  //     if (image) {
  //       // Upload image to Firebase Storage
  //       const storageRef = ref(storage, `images/${image.name}`);
  //       const uploadTask = uploadBytesResumable(storageRef, image);

  //       uploadTask.on(
  //         "state_changed",
  //         (snapshot) => {
  //           const progress =
  //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //           setUploadProgress(progress);
  //         },
  //         (error) => {
  //           console.error("Error uploading image: ", error);
  //           alert("Error uploading image. Please try again.");
  //         },
  //         async () => {
  //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //           postData.imageUrl = downloadURL;

  //           // Save post to Firestore
  //           const postDocRef = await addDoc(collection(db, "posts"), postData);

  //           // Create a notification for the new post
  //           await addDoc(collection(db, "notifications"), {
  //             postId: postDocRef.id,
  //             title: postData.title,
  //             content: postData.content,
  //             createdAt: new Date(),
  //             userId: user.uid,
  //           });

  //           // Reset form fields
  //           resetForm();
  //           toast("Post created successfully with image!");
  //         }
  //       );
  //     } else {
  //       // Save post to Firestore without image
  //       const postDocRef = await addDoc(collection(db, "posts"), postData);

  //       // Create a notification for the new post
  //       await addDoc(collection(db, "notifications"), {
  //         postId: postDocRef.id,
  //         title: postData.title,
  //         content: postData.content,
  //         createdAt: new Date(),
  //         userId: user.uid,
  //       });

  //       // Reset form fields
  //       resetForm();
  //       toast("Post created successfully!");
  //     }
  //   } catch (err) {
  //     console.error("Error adding document: ", err);
  //     alert("Error creating post. Please try again.");
  //   }
  // };

  // Helper function to reset form fields
  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setImage(null);
    setUploadProgress(0);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Check if the user is logged in
  //   if (!user) {
  //     alert("You must be logged in to create a post.");
  //     return;
  //   }

  //   if (title.trim() === "") {
  //     alert("Please enter a title");
  //     return;
  //   }
  //   if (content.trim() === "") {
  //     alert(Messages.EMPTY_INPUT);
  //     return;
  //   }
  //   if (category.trim() === "") {
  //     alert(Messages.SELECT_COTOGARY);
  //     return;
  //   }

  //   try {
  //     if (image) {
  //       // Upload image to Firebase Storage
  //       const storageRef = ref(storage, `images/${image.name}`);
  //       const uploadTask = uploadBytesResumable(storageRef, image);

  //       uploadTask.on(
  //         "state_changed",
  //         (snapshot) => {
  //           const progress =
  //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //           setUploadProgress(progress);
  //         },
  //         (error) => {
  //           console.error("Error uploading image: ", error);
  //           alert("Error uploading image. Please try again.");
  //         },
  //         async () => {
  //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //           await addDoc(collection(db, "posts"), {
  //             title,
  //             content,
  //             category,
  //             imageUrl: downloadURL,
  //             createdAt: new Date(),
  //             userId: user.uid, // Save user UID
  //             userEmail: user.email, // Save user email
  //             authName: user.displayName,
  //           });

  //           // Increment global notification count for all users
  //           const notificationRef = doc(db, "notifications", "globalNotification");

  //           // Check if the document exists before updating
  //           const notificationDoc = await getDoc(notificationRef);
  //           if (!notificationDoc.exists()) {
  //               // If it doesn't exist, create it with an initial count of 0
  //               await setDoc(notificationRef, { count: 0 });
  //           }

  //           // Now increment the count
  //           await updateDoc(notificationRef, {
  //               count: increment(1),
  //           });

  //           setTitle("");
  //           setContent("");
  //           setCategory("");
  //           setImage(null);
  //           setUploadProgress(0);
  //           toast("Post created successfully with image!");
  //         }
  //       );
  //     } else {
  //       await addDoc(collection(db, "posts"), {
  //         title,
  //         content,
  //         category,
  //         imageUrl: "", // Empty image URL if no image is uploaded
  //         createdAt: new Date(),
  //         userId: user.uid, // Save user UID
  //         userEmail: user.email, // Save user email
  //         authName: user.displayName,
  //       });

  //      // Increment global notification count for all users
  //      const notificationRef = doc(db, "notifications", "globalNotification");

  //      // Check if the document exists before updating
  //      const notificationDoc = await getDoc(notificationRef);
  //      if (!notificationDoc.exists()) {
  //          // If it doesn't exist, create it with an initial count of 0
  //          await setDoc(notificationRef, { count: 0 });
  //      }

  //      // Now increment the count
  //      await updateDoc(notificationRef, {
  //          count: increment(1),
  //      });

  //       // Reset form fields
  //       setTitle("");
  //       setContent("");
  //       setCategory("");
  //       setImage(null);
  //       setUploadProgress(0);

  //       toast("Post created successfully!");
  //     }
  //   } catch (err) {
  //     console.error("Error adding document: ", err);
  //     alert("Error creating post. Please try again.");
  //   }
  // };

  return (
    <>
      <div className="mt-12 flex items-center justify-center">
        <div
          className={`w-full md:w-[600px] lg:w-[800px] rounded-lg ${
            isDarkTheme ? "shadow-lg bg-gray-800" : "shadow-lg bg-white"
          }`}
        >
          <form className="m-4 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded ${
                  isDarkTheme
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-black"
                }`}
              />
            </div>
            <div>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                className="border border-gray-300 rounded h-50"
              />
            </div>

            <div className="flex items-center text-center space-x-4">
              <div className="flex items-center flex-1">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    isDarkTheme
                      ? "bg-gray-700 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <input
                  className="border border-gray-300 rounded w-full"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className="mt-2">
                <progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </form>

          <div className="mt-5 text-center mb-10">
            <button
              type="submit"
              className="bg-blue-500 justify-center text-white py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Create Post
            </button>
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
};

export default PostForm;
