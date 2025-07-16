import { createContext } from "react";
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext();

export const AuthProvider = ({ childern }) => {
    const vlaue = {
        axios
    }
    return (
        <AuthContext.Provider value={value}>
            {childern}
        </AuthContext.Provider>
    )
}