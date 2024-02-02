import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';//allows programmatic navigation.


const SignUpPage = () => {
    const [email, setEmail] = useState('');//states store the user's credentials.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {//Makes an asynchronous POST request to the login endpoint with the user's email and password.
        event.preventDefault();//Prevents the default form submission behavior.
        try {
            const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
            const response = await axios.post(`${apiUrl}/auth/register`, { username, email, password,inviteCode });//is used for making HTTP requests.
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            // Update the error message based on the response or a default message
            setErrorMessage(error.response?.data?.message || 'Signup failed: User already exists or the provided details do not meet the required criteria.');
        }
        
    };
     // Function to toggle the visibility of the explanation section.
   
    // Function to navigate to the login page.
    const hanldeLogin=()=>{
        navigate('/login');
    }

    return (
        <div className="flex justify-center items-center h-screen bg-green-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-xs">
                <h2 className="text-2xl text-gray-800 font-bold mb-6">SignUp</h2>
                {errorMessage && (
                    <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                <input
                    className="mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    required />
                
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
                <input
                    className="mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    type='inviteCode'
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder='邀请码'
                    required />
                <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline" type='submit'>SignUp</button>
                <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={hanldeLogin}>Login if already Signed</button>
                
            </form>
            
        </div>
    );
}

export default SignUpPage;
