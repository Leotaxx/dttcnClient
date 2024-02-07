import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Allows programmatic navigation.

const LoginPage = () => {
    const [email, setEmail] = useState(''); // State to store the user's email.
    const [password, setPassword] = useState(''); // State to store the user's password.
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission behavior.
        try {
            const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8888';
            const response = await axios.post(`${apiUrl}/.netlify/functions/login`, { email, password });
            const user=response.data.user;
            console.log(user);
            const userId=user.userId;
            navigate(`/Userprofile/${userId}`,{state:{user:user}}); // Change '/dashboard' to your success route
        } catch (error) {
            // Update the error message based on the response or a default message
            setErrorMessage(error.response?.data?.message || '登录失败：邮箱或密码不正确。');
        }
    };

    // Function to navigate to the signup page.
    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="flex justify-center items-center h-screen bg-green-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-xs">
                <h2 className="text-2xl text-gray-800 font-bold mb-6">登录</h2>
                {errorMessage && (
                    <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                <input
                    className="mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="邮箱"
                    required />
                <input
                    className="mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='密码'
                    required />
                <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline" type='submit'>登录</button>
                <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleSignUp}>注册新账号</button>
            </form>
        </div>
    );
}

export default LoginPage;
