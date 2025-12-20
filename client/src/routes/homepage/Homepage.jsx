import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("student");

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="" className="orbital" aria-hidden="true" />
      <div className="left">
        <h1>Study Smart</h1>
        <h2>AI Student Study Assistant</h2>
        <h3>
          Your AI-powered study companion designed to help students learn more effectively. 
          Get instant explanations tailored to your education level, summarize complex notes 
          into key points, and generate practice quizzes to test your understanding.
        </h3>
        <Link to="/dashboard">
          <span>Get Started</span>
        </Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="AI Study Assistant Bot" className="bot" />
          <div className="chat">
            <img
              src={
                typingStatus === "student"
                  ? "/human1.jpeg"
                  : "/bot.png"
              }
              alt="Chat avatar"
            />
            <TypeAnimation
              sequence={[
                "Student: I don't understand photosynthesis...",
                2000,
                () => setTypingStatus("ai"),
                "AI: Here's a simple explanation! 🌱",
                2000,
                () => setTypingStatus("student"),
                "Student: Can you summarize this chapter?",
                2000,
                () => setTypingStatus("ai"),
                "AI: Here are 5 key points 📝",
                2000,
                () => setTypingStatus("student"),
                "Student: I have a test tomorrow!",
                2000,
                () => setTypingStatus("ai"),
                "AI: Let me create a practice quiz 📋",
                2000,
                () => setTypingStatus("student"),
                "Student: Explain at my level please",
                2000,
                () => setTypingStatus("ai"),
                "AI: Here's an easier explanation 🎓",
                2000,
                () => setTypingStatus("student"),
              ]}
              wrapper="span"
              speed={40}
              deletionSpeed={60}
              repeat={Infinity}
              cursor={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" aria-hidden="true" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
