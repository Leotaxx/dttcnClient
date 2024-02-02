import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState(''); // State hooks for managing form inputs and other UI elements.
    const [password, setPassword] = useState(''); // Stores the password input value.
    const navigate = useNavigate(); // Hook from React Router for navigation.
    const [errorMessage, setErrorMessage] = useState(''); // Stores error messages for display.
    // Function to handle the form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();// Prevents the default form submission behavior.
        
        try {
            // Fetches the API base URL from environment variables or uses a default value.
            const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
            // Makes an asynchronous POST request to the login endpoint with the user's credentials.
            const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
            const userID = response.data._id;// Extracts the user ID from the response data.
            navigate(`/Allquiz/${userID}`);// Navigates to the user's profile page using the user ID.
        } catch (error) {
            // Update the error message based on the response or a default message
            setErrorMessage(error.response?.data?.message || 'Login failed: Incorrect credentials or no matching user.');
        }
    };
   

    return (
        <div className="flex justify-center items-center h-screen bg-green-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-xs">
                <h2 className="text-2xl text-gray-800 font-bold mb-6">Login</h2>
                {errorMessage && (
                    <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                <input
                    className="mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required />

                <input
                    className="mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required />

                <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type='submit'>Login</button>
                
                

 
            </form>
            

        </div>
    );
};

export default LoginPage;
