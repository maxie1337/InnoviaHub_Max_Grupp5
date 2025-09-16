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

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        console.log('UserProvider: Loading stored data - token:', !!storedToken, 'user:', !!storedUser);
        
        if (storedToken) {
            setToken(storedToken);
            console.log('UserProvider: Token loaded from localStorage');
        }
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log('UserProvider: User loaded from localStorage:', parsedUser);
            } catch (error) {
                console.error("Error parsing stored user data:", error);
                localStorage.removeItem("user");
            }
        }
        
        console.log('UserProvider: Initial load completed');
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

        // Save token and user data in localStorage so the session persists after refresh
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        // Update the state with token and user data
        setToken(result.data.token);
        setUser(result.data.user);

        console.log('UserProvider: Login successful, user saved:', result.data.user);
        console.log('UserProvider: Token saved:', result.data.token);
        return true;
    };

    // LOGOUT
    const logout = () => {
        // Clears token and user data from both state and localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser({ email: "" });
        setToken("");

        console.log('UserProvider: Logout successful, all data cleared');
        toast.success("Du är utloggad!", {
            position: "top-center",
        });
    };

    const isAuthenticated = token ? true : false;
    
    // Debug logging
    console.log('UserProvider: Current state - token:', !!token, 'user:', user.email, 'isAuthenticated:', isAuthenticated);

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

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
