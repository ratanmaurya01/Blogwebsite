// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PostList from "./component/PostList";
import PostForm from "./component/PostForm";
import PostDetail from "./component/PostDetail"; // Ensure correct import
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { PostProvider } from "./context/PostContext";
import { ThemeProvider } from "./context/ThemeContext";
import Categories from "./pages/Categories";
import { CreateAccount } from "./auth/CreateAccount";
import Login from "./auth/Login";
import Dashboard from "./auth/Dashboard";
import Profile from "./auth/Profile";
import Test from "./Test";
import Game from "./pages/Game";


function App() {
  return (
    <ThemeProvider>
      <PostProvider>
      
          <Router>
            <Navbar />
            <Categories />
            <div>
              <Routes>
                <Route path="/PostForm" element={<PostForm />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
                <Route path="/" element={<PostList />} />
                <Route path="/createAccount" element={<CreateAccount />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Test" element={<Test />} />
                <Route path="/Game" element={<Game />} />
              </Routes>
            </div>

            <div className="mt-5">
              <Footer />
            </div>
          </Router>

          
    
      </PostProvider>
    </ThemeProvider>
  );
}

export default App;
