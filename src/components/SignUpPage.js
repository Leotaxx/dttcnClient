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
        const [signupAttempts, setSignupAttempts] = useState(0);

        const handleSubmit = async (event) => {//Makes an asynchronous POST request to the login endpoint with the user's email and password.
            event.preventDefault();//Prevents the default form submission behavior.
            if(signupAttempts>5){
                setErrorMessage('您已达到最大登录尝试次数。');
                return;
            }
            try {
                const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8888';
                const response = await axios.post(`${apiUrl}/.netlify/functions/register`, { username, email, password,inviteCode },);//is used for making HTTP requests.
                const user=response.data.user;
                const userId=user.userId;
                navigate(`/Userprofile/${userId}`,{state:{user:user}});
            } catch (error) {
                setSignupAttempts(setSignupAttempts+1)
                // Update the error message based on the response or a default message
                setErrorMessage(error.response?.data?.message || '用户邮箱已被注册或邀请码已被使用或不正确');
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
                        placeholder='用户名'
                        required />
                    
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
                    <input
                        className="mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                        type='inviteCode'
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder='邀请码'
                        required />
                    <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline" type='submit'>注册会员</button>
                    <button className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={hanldeLogin}>使用已有账号登录</button>
                    
                </form>
                
            </div>
        );
    }

    export default SignUpPage;
