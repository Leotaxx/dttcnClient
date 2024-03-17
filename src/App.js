import React from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import LimitQuiz from './components/LimitQ';
import Quiz from './components/AllQ';
import UserProfile from './components/UserProfile';
import MockTestPage from './components/MockTest';
import Header from './components/Header';
function App() {
  
  
  return (
    <Router>
      <div>
        <Header />
      <Routes>
        {/* Redirect users based on authentication status */}
        <Route path="/"  element={<LoginPage />} />
        <Route path="/limit" element={ <LimitQuiz />  } />
        <Route path="/signup" element={<SignUpPage /> } />
        <Route path="/AllQuiz/:userId"   element={<LoginPage />}  />
        <Route path="/march/AllQuiz/:userId" element={<Quiz />} />
        <Route path='/UserProfile/:userId' element={<LoginPage />}/>
        <Route path='/march/profile/:userId' element={<UserProfile />} />
        <Route path='/march/MockTest/:userId' element={<MockTestPage />}/>
        <Route path='/MockTest/:userId' element={<LoginPage />}/>
        
      </Routes>
      </div>
    </Router>
  );
}

export default App;
