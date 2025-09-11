import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

// Define the user object type
export type User = {
    username?: string;
    email: string;
    // role?: "admin" | "medlem";
};

// Define everything that will be available in the UserContext
export interface UserContextInterface {
    user: User; // the current logged-in user's data
    setUser: Dispatch<SetStateAction<User>>; // function to update the user state
    token: string;
    login: (email: string, password: string) => Promise<boolean>; // function to log in
    register: (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        confirmPassword: string
    ) => Promise<boolean>; // function to register a new account
    logout: () => void; // function to log out
    isAuthenticated: boolean; // indicates whether the user is logged in or not
}

// We need a default (initial) value for the context
// to unsure that the app doesn't crash if the context is not set
const defaultState = {
    user: { email: "" },
    setUser: () => {},
    token: "",
    login: async () => false,
    register: async () => false,
    logout: () => {},
    isAuthenticated: false,
} as UserContextInterface;

// Create the actual UserContext
// This will let components "consume" (access) and "provide" (set) user data
export const UserContext = createContext<UserContextInterface>(defaultState);
