import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../api/authApi";
import { UserContext } from "./UserContext";
import type { User, UserContextInterface } from "./UserContext";

// Define the props that UserProvider accepts
// "children" means any React components inside <UserProvider>
type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    // State to store the logged-in user's data
    const [user, setUser] = useState<User>({ email: "" });

    // State to store the JWT token
    const [token, setToken] = useState<string>("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
}, []);


    // REGISTER
    const register = async (
        email: string,
        firstName: string,
        lastName: string,
        password: string,
        confirmPassword: string
    ): Promise<boolean> => {
        const result = await registerUser(
            email,
            firstName,
            lastName,
            password,
            confirmPassword
        );

        if (!result.success) {
            toast.error(
                result.message || "Ett fel inträffade vid registrering."
            );
            return false;
        }

        return true;
    };

    // LOGIN
    const login = async (email: string, password: string): Promise<boolean> => {
        const result = await loginUser(email, password);

        if (!result.success || !result.data) {
            toast.error(result.message || "Ett fel inträffade vid inloggning.");
            return false;
        }

        // Save token in localStorage so the session persists after refresh
        localStorage.setItem("token", result.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
        })
    );

        // Update the state with token and user data
        setToken(result.data.token);
        setUser({ email });

        return true;
    };

    // LOGOUT
    const logout = () => {
        // Clears token from both state and localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser({ email: "" });
        setToken("");

        toast.success("Du är utloggad!", {
            position: "top-center",
        });
    };

    const isAuthenticated = token ? true : false;

    // This object will be passed down to all components using the context
    const contextValue: UserContextInterface = {
        user,
        setUser,
        login,
        register,
        logout,
        token,
        isAuthenticated,
    };

    if (loading) return <p>Laddar användare...</p>;  

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
