import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';

import LimitQuiz from './components/LimitQ.js';


import Quiz  from './components/AllQ.js';

function App() {
  return (
      <Router >
        <Routes>
          <Route path="/login" element={<LoginPage />}  />
          <Route path='/signup' element={<SignUpPage />}  />
          <Route path="/AllQuiz/:userID" element={<Quiz/>} /> 
          <Route path="/" element={<LimitQuiz />} />
          
          
        </Routes>
      </Router>
  );
}

export default App;
