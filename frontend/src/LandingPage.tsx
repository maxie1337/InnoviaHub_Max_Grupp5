import React from "react";
import "./LandingPage.css";
import Navbar from "./components/navbar";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-root">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <h1 className="text-2xl font-bold mb-4">Welcome to Innovia Hub</h1>
        <p>Your gateway to innovative resource management.</p>
        
      </section>

      {/* About Section */}
      <section className="about">
        <h2 className="text-2xl font-bold mb-4">About Innovia Hub</h2>
        <p>
          Innovia Hub is designed to simplify and streamline resource management
          for teams and organizations. Easily book, track, and manage resources
          with our intuitive platform. Whether you're a small team or a large
          enterprise, Innovia Hub helps you stay organized and efficient.
        </p>
      </section>

      {/* CTA Section */}
      <section className="cta text-center mt-12 p-6 rounded-2xl shadow-md ">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">
          Book your resources in seconds and experience effortless management with Innovia Hub.
        </p>
        <Link
          to="/bookings"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl transition"
        >
          Go to Booking Page
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
