import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import { UserContext } from "@/context/UserContext.tsx";
import { motion } from "framer-motion";
import Button from "../components/Button/Button.tsx";

const LandingPage: React.FC = () => {
    const { token } = React.useContext(UserContext);

    const isLoggedIn = !!token;

    return (
        <div className="landing-root">
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col justify-center items-center text-white text-center px-6 relative overflow-hidden">
                {/* Floating shapes */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full mix-blend-soft-light animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full mix-blend-soft-light animate-pulse"></div>

                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-9xl md:text-6xl font-bold mb-6"
                >
                    Innovia Hub
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-5xl md:text-4xl mb-12 mt-6"
                >
                    Your all-in-one platform for managing resources and
                    workspaces efficiently in real time
                </motion.p>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <Link to={isLoggedIn ? "/bookings" : "/signup"}>
                        <Button
                            design="outline-white"
                            className="px-6 py-3 text-black mt-8"
                        >
                            {isLoggedIn ? "Go to Booking Page" : "Sign Up"}
                        </Button>
                    </Link>
                </motion.div>
            </section>

            {/* Feature Sections */}
            <section className="py-24 px-6 md:px-20 bg-gray-50 text-[#111827]">
                <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="card p-6"
                    >
                        <h3 className="text-2xl font-semibold mb-3">
                            Quick Booking
                        </h3>
                        <p className="text-lg">
                            Reserve desks, meeting rooms, VR headsets, or AI
                            resources in seconds. Fast, intuitive, and easy.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="card p-6"
                    >
                        <h3 className="text-2xl font-semibold mb-3">
                            Real-Time Monitoring
                        </h3>
                        <p className="text-lg">
                            Instantly see which resources are available and
                            monitor occupancy with up-to-date sensor data.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="card p-6"
                    >
                        <h3 className="text-2xl font-semibold mb-3">
                            Advanced Technology
                        </h3>
                        <p className="text-lg">
                            Leverage VR, AI, and sensor integrations to optimize
                            resources and monitor occupancy in real time.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section
                className="py-24 px-6 md:px-20 text-white text-center"
                style={{
                    background:
                        "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                }}
            >
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold mb-6"
                >
                    Ready to get started?
                </motion.h2>
                <Link
                    to={isLoggedIn ? "/bookings" : "/signup"}
                    className="flex justify-center"
                >
                    <Button design="outline-white" className="px-6 py-3 mt-6">
                        {isLoggedIn ? "Go to Booking Page" : "Sign Up"}
                    </Button>
                </Link>
            </section>
        </div>
    );
};

export default LandingPage;
