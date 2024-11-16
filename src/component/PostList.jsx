// src/components/PostList.js
import React, { useContext } from "react";
import { usePosts } from "../context/PostContext"; // Import the context
import Sidebar from "../Navbar/Sidebar";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext"; // Ensure to import your ThemeContext
import Pagination from "../pages/Pagination";

const PostList = () => {
  const { posts, loading } = usePosts(); // Use the context
  const navigate = useNavigate();
  const { isDarkTheme } = useContext(ThemeContext); // Consume the ThemeContext

  const truncateHTML = (html, maxLength) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    let text = doc.body.innerText;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const openPostDetail = (postId) => {
    navigate(`/posts/${postId}`); // Navigate to the post detail page
  };

  return (
    <div
      className={`container mx-auto p-4 ${
        isDarkTheme ? "bg-gray-900" : "bg-white"
      }`}
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`mb-4 p-4 ${
                  isDarkTheme ? "bg-gray-800" : "bg-white"
                } shadow-md rounded animate-pulse`}
              >
                <div
                  className={`h-8 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  } rounded mb-4`}
                ></div>
                <div
                  className={`h-6 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  } rounded mb-2`}
                ></div>
                <div
                  className={`h-6 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  } rounded mb-2`}
                ></div>
                <div
                  className={`h-64 ${
                    isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  } rounded`}
                ></div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap">
          <div className="lg:w-3/4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`mb-4  ${
                    isDarkTheme ? "bg-gray-800" : "bg-white"
                  } shadow-md rounded`}
                >
                  {post.imageUrl && (
                    // <div className="image-container">
                    //   <img
                    //     src={post.imageUrl}
                    //     alt={`Image for ${post.title}`}
                    //     className="w-auto h-60 object-cover rounded"
                    //     loading="lazy"
                    //   />
                    // </div>

                    <div className="image-container">
                      <img
                        src={post.imageUrl}
                        alt={`Image for ${post.title}`}
                        className="w-full h-auto max-w-full max-h-60 object-cover rounded"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="ml-5 mb-3">
                    {post.title ? (
                      <span
                        className="font-mono"
                        dangerouslySetInnerHTML={{
                          __html: truncateHTML(post.title, 50),
                        }}
                      />
                    ) : (
                      <span>No description available</span>
                    )}
                    <div className="mt-1">
                      <button
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" ${
                          isDarkTheme ? "text-blue-300" : "text-blue-500"
                        }`}
                        onClick={() => openPostDetail(post.id)}
                      >
                        Read More
                        <svg
                          class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-1">
                      <p
                        className={`text-sm font-mono ${
                          isDarkTheme ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Created at: {post?.createdAt.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination />
          </div>
          <div className="lg:w-1/4 w-full lg:ml-4 mt-4 lg:mt-0">
            <Sidebar posts={posts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
