// src/PostContext.js
import React, { createContext, useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]); // For notifications

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = [];
      snapshot.forEach((doc) => postsData.push({ ...doc.data(), id: doc.id }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


    // Fetch notifications
    useEffect(() => {
      const notificationQuery = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(notificationQuery, (snapshot) => {
        const notificationsData = [];
        snapshot.forEach((doc) => notificationsData.push({ ...doc.data(), id: doc.id }));
        setNotifications(notificationsData);
      });
  
      return () => unsubscribe();
    }, []);
    
  return (
    <PostContext.Provider value={{ posts, loading, notifications , setNotifications }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  return React.useContext(PostContext);
};
