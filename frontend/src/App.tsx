import { Route, Routes } from "react-router";
import "./App.css";
import LandingPage from "./LandingPage";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import { UserProvider } from "./context/UserProvider.tsx";
import Navbar from "./components/navbar.tsx";

function App() {
    return (
        <UserProvider>
            <>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </main>
                {/* <Footer /> */}
            </>
        </UserProvider>
    );
}

export default App;
