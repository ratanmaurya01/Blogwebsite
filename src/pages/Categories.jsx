import React, { useContext } from "react";
import { usePosts } from "../context/PostContext"; // Import the context
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext
import './style.css';

function Categories() {
  const { isDarkTheme } = useContext(ThemeContext); // Access ThemeContext
  const categories = [
    "All",
    "Recent",
    "News",
    "Technology",
    "Blog",
    "Gadget",
    "Top",
    "Health",
    "Education",
    "Sports",
    "Entertainment",
    "Movies",
    "Story",
  ];

  return (
    <div className={`mt-24 m-2 ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex ml-4 my- overflow-x-scroll hide-scroll-bar">
        <div className="flex space-x-5 flex-nowrap min-w-full">
          {categories.map((category) => (
            <div
              key={category}
              className={`flex-none duration-300 rounded-xl px-4 py-1 font-medium cursor-pointer whitespace-nowrap ${
                isDarkTheme
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
