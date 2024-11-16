import React, { useState } from "react";
import "./App.css";

export default function Test() {
  const [name, setName] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);

  const handleGreet = () => {
    if (name) setShowGreeting(true);
  };

  return (
    <div className="diwali-container text-center">
      <h6>Test Application </h6>

      <div className="input-section">
        <h1 className="main-title">Welcome to the Diwali Celebration</h1>
        <input
          className="name-input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="greet-button" onClick={handleGreet}>
          Show Diwali Wishes
        </button>
      </div>

      {showGreeting && (
        <div className="diwali-greeting">
          <h1>Happy Diwali, {name}!</h1>
          <p>
            दीप जलते रहे मन से मन मिलते रहे |
            <br />
            गिले सिकवे सारे मन से निकलते रहे |
            <br />
            सारे विश्व मे सुख-शांति की प्रभात ले आये |
            <br />
            ये दीपो का त्योहार खुशी की सोंगात ले आये |
          </p>
          <img
            src="https://1.bp.blogspot.com/-nc1SosMnpqQ/XZcJUBcJO8I/AAAAAAAAMEQ/xLEUUihybjMqFS6Z53K3qL7eYK3KSJGlgCLcBGAsYHQ/s1600/diwali.jpg"
            alt="Diwali Celebration"
          />
        </div>
      )}
    </div>
  );
}
