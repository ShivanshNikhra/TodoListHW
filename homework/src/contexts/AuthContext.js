// Importing necessary hooks and functionalities
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Creating a context for authentication. Contexts provide a way to pass data through 
// the component tree without having to pass props down manually at every level.
const AuthContext = createContext();

// This is a custom hook that we'll use to easily access our authentication context from other components.
export const useAuth = () => {
    return useContext(AuthContext);
};

// This is our authentication provider component.
// It uses the context to provide authentication-related data and functions to its children components.
export function AuthProvider({ children }) {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user')))
    const [loginError, setLoginError] = useState(null)

    // Fire base config details
    const firebaseConfig = {
        apiKey: "AIzaSyDJIYx1eSAQK5bQYWi6LHXF3V5AQDzIPSE",
        authDomain: "tpeo-todohw-db.firebaseapp.com",
        projectId: "tpeo-todohw-db",
        storageBucket: "tpeo-todohw-db.appspot.com",
        messagingSenderId: "931859591830",
        appId: "1:931859591830:web:86564c60a7fa1f931cc8b7",
        measurementId: "G-DXRGHPGB1Q"
      };

    // Initialize Firebase stuff 
    const app = initializeApp(firebaseConfig); 
    const auth = getAuth(app); 

    // Register new users 
    const register = (email, password) => { 
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            setCurrentUser(userCredential.user);
            localStorage.setItem("user", JSON.stringify(userCredential.user))
              // correct and formal way of getting access token
            userCredential.user.getIdToken().then((accessToken) => {
                // console.log(accessToken)
            })
            navigate("/");
          })
          .catch((error) => {
            //console.log(error.message); 
            setLoginError(error.message);
          });
    };

    // Sign in existing users
    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setCurrentUser(userCredential.user);
            console.log("BIG BODY INH TEXAS")
            console.log(userCredential.user.accessToken)
            localStorage.setItem("user", JSON.stringify(userCredential.user))
            console.log(JSON.stringify(userCredential.user))

            navigate("/");
        })
        .catch((error) => {
            setLoginError(error.message);
        });
    };

    // Sign out users
    const logout = () => {
        auth.signOut().then(() => {
        setCurrentUser(null);
        localStorage.removeItem('user')
        navigate("/login");
        });
    };



    // const VALID_USERNAME = "Shiv"
    // const VALID_PASSWORD = "pass"
    
    // // Login function that validates the provided username and password.
    // // const login = (username, password) => {
    // //     if(username === VALID_USERNAME && password === VALID_PASSWORD) {
    // //         setCurrentUser({username})
    // //         localStorage.setItem("user", JSON.stringify({username}))
    // //         navigate("/")
    // //     } else {
    // //         setLoginError("ERROR")
    // //     }
    // // };

    // // Logout function to clear user data and redirect to the login page.
    // const logout = () => {
    //     setCurrentUser(null)
    //     localStorage.removeItem('user')
    //     navigate('/login')
    // };

    // An object containing our state and functions related to authentication.
    // By using this context, child components can easily access and use these without prop drilling.
    const contextValue = {
        currentUser, 
        login, 
        logout, 
        loginError, 
        register
    };

    // The AuthProvider component uses the AuthContext.Provider to wrap its children.
    // This makes the contextValue available to all children and grandchildren.
    // Instead of manually passing down data and functions, components inside this provider can
    // simply use the useAuth() hook to access anything they need.
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}