import React from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import LimitQuiz from './components/LimitQ';
import Quiz from './components/AllQ';
import UserProfile from './components/UserProfile';
import MockTestPage from './components/MockTest';
function App() {
  
  
  return (
    <Router>
      <Routes>
        {/* Redirect users based on authentication status */}
        <Route path="/"  element={<LimitQuiz />} />
        <Route path="/login" element={ <LoginPage />  } />
        <Route path="/signup" element={<SignUpPage /> } />
        <Route path="/AllQuiz/:userId"   element={<Quiz />}  />
        <Route path='/UserProfile/:userId' element={<UserProfile />}/>
        <Route path='/MockTest/:userId' element={<MockTestPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
