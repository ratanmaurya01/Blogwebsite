// src/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h5 className="text-lg font-semibold">About Us</h5>
            <p className="mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0 justify-center ">
            <h5 className="text-lg font-semibold">Quick Links</h5>
            <ul className="mt-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h5 className="text-lg font-semibold">Contact Us</h5>
            <p className="mt-2">
              1234 Street Name, City, State, 12345
            </p>
            <p className="mt-2">
              Email: <a href="mailto:info@example.com" className="text-gray-400 hover:text-white">info@example.com</a>
            </p>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
