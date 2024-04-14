import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const Context = createContext();

const ContextProvider = (props) => {
    const [id, setId] = useState("");
    const [quantity, setQuantity] = useState();
    const [token, setToken] = useState("" || localStorage.getItem('token'));
    const [searchQuery, setSearchQuery] = useState('');

    const isPersonAdmin = () => {
        const user = getUser();
        return user ? user.isAdmin : false; // Check if user exists, then check isAdmin
    };

    const getUser = () => {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken;
        } catch (ex) {
            console.error("Error decoding token:", ex); // Add error handling
            return null;
        }
    };

    const isLoggedIn = () => {
        const data = localStorage.getItem("token");
        if (!data) {
            return false;
        }
        return data;
    };

    const contextValue = {
        setId,
        id,
        quantity,
        setQuantity,
        token,
        setToken,
        searchQuery,
        setSearchQuery,
        isPersonAdmin,
        getUser,
        isLoggedIn
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;