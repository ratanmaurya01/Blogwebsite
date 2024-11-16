import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext to access theme state

const Sidebar = ({ posts }) => {
  const { isDarkTheme } = useContext(ThemeContext); // Consume the ThemeContext

  return (
    <aside className={` p-4 rounded lg:sticky lg:top-0 h-full ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-black'}`}>Blog Titles</h2>
      <ul>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="mb-4">
              <Link 
               
                to={`/posts/${post.id}`} 
                className={`text-blue-500 hover:underline ${isDarkTheme ? 'text-blue-300' : 'text-blue-500'}`} // Change link color based on theme
              >
                {post.title}
              </Link>
            </li>
          ))
        ) : (
          <li className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>No posts available</li> // Change text color based on theme
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
