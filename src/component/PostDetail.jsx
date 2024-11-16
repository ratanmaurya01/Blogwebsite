// src/components/PostDetail.js
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../context/PostContext"; // Import the context
import Sidebar from "../Navbar/Sidebar";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext for theme state
import Pagination from "../pages/Pagination";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore instance
import { useTranslation } from "react-i18next"; // Import useTranslation
import DOMPurify from "dompurify";

const PostDetail = () => {
  const { postId } = useParams(); // Fetching postId from the route
  const { posts, loading } = usePosts(); // Use the context
  const { isDarkTheme } = useContext(ThemeContext); // Consume the ThemeContext
  const { t, i18n } = useTranslation(); // Use the translation hook

  // Update the view count for the post when the component mounts
  useEffect(() => {
    const updateViewCount = async () => {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        viewCount: increment(1), // Increment the view count
      });
    };

    if (!loading) {
      updateViewCount();
    }
  }, [postId]);

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`mb-4 p-4 ${
                  isDarkTheme ? "bg-gray-800" : "bg-white"
                } shadow-md rounded animate-pulse`}
                aria-label={t("Loading post...")} // Accessibility improvement
              >
                <div
                  className={`h-8 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  } rounded mb-4`}
                  aria-hidden="true"
                ></div>
                <div
                  className={`h-6 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  } rounded mb-2`}
                  aria-hidden="true"
                ></div>
                <div
                  className={`h-6 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  } rounded mb-2`}
                  aria-hidden="true"
                ></div>
                <div
                  className={`h-64 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  } rounded`}
                  aria-hidden="true"
                ></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  const post = posts.find((post) => post.id === postId); // Find the post by ID

  if (!post) {
    return (
      <>
        <div className="text-center text-2xl mt-10 font-arial">
        Oop's  Post not found!
        </div>
      </>
    );
  }

  return (
    <div
      className={`flex flex-col lg:flex-row mt-10 p-3 ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div>
        <div className="container mx-auto overflow-y-auto p-4 lg:w-4/4 shadow-lg">
          <p className="font-mono text-sm">Create By : {post?.authName}</p>
          <p className="font-mono text-sm">
            {" "}
            Created at: {post?.createdAt.toDate().toLocaleString()}
          </p>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <div>
            <pre style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
              <code
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content),
                }}
              />
            </pre>
          </div>
        </div>

        <div className="mt-2">
          <Pagination />
        </div>
      </div>

      <div className="lg:w-1/4 w-full lg:ml-4 overflow-y-auto mt-4 lg:mt-0">
        <Sidebar posts={posts} />
      </div>
    </div>
  );
};

export default PostDetail;
