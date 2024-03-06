import React, { useEffect, useState } from 'react';
import Question from './Question';
import { useLocation, useNavigate } from 'react-router-dom';
import generateRandomQuestions from './generateRandomQuestions'; // Ensure this path is correct


const MockTestPage = () => {
    const location=useLocation();
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(40 * 60); // Set to 40 minutes
    const [language, setLanguage] = useState('CN'); // Default language
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selectedQuestions, setSelectedQuestions] = useState(() => generateRandomQuestions());
    const [testEnded, setTestEnded] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const user= location.state.user
    const userId=user.userId;
    const [incorrectMockIds, setIncorrectMockIds] = useState([]);

    // Effect to generate questions only once on component mount
    const saveResults = () => {
        const result = {
            score: correctAnswers,
            total: selectedQuestions.length,
            date: new Date().toLocaleString(),
            incorrectMockIds: incorrectMockIds // Save the incorrect question IDs
        };
        const results = JSON.parse(localStorage.getItem('mockTestResults')) || [];
        results.push(result);
        localStorage.setItem('mockTestResults', JSON.stringify(results));
    };
    

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer); // Set the selected answer
    
        // Ensure we're working with the current question's data
        const currentQuestion = selectedQuestions[currentQuestionIndex];
        // Fetch the correct answer text using the correct_answer property
        const correctOptionKey = 'option_' + currentQuestion[language].correct_answer.toLowerCase();
        const correctAnswerText = currentQuestion[language][correctOptionKey];
    
        // Compare the selected answer with the correct answer text
        const isCorrect = answer === correctAnswerText;
        
    
        if (isCorrect) {
            setCorrectAnswers(prev => {
                const newScore = prev + 1;
                
                // If this is the last question, save results after updating the score
               
                
                return newScore;
            });
        
        }
        if(!isCorrect) {
           
            setIncorrectMockIds(prevIds => {
                const newIds = new Set(prevIds);
                newIds.add(currentQuestion[language].question_id);
                return [...newIds];

            });
           
        }
           
        
    
        // Proceed to the next question or end the test
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < selectedQuestions.length) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedAnswer(""); // Reset selected answer for the next question
        } else {
            
            setTestEnded(true);
            
        }
    };
    useEffect(() => {
        if (timeLeft === 0 || currentQuestionIndex >= selectedQuestions.length) {
            setTestEnded(true);
            
        }
        const timerId = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, currentQuestionIndex, selectedQuestions.length]);
    useEffect(() => {
        if (testEnded) {
          saveResults(); // Ensure this only gets called once the test has actually ended.
        }
      }, [testEnded, incorrectMockIds, correctAnswers]); 
  
    useEffect(() => {
       
    }, [incorrectMockIds]);
  

    const toggleLanguage = () => setLanguage(prevLang => prevLang === 'CN' ? 'EN' : 'CN');
    const getLocalizedResultsText = () => {
      return language === 'CN' ? '模拟测试结果' : 'Mock Test Results';
  };
  const getLocalizedGoBackButtonText = () => {
    return language === 'CN' ? '回到菜单页' : 'back to profile';
};
const getLocalizedTimeLeftText = () => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = ('0' + timeLeft % 60).slice(-2);
  return language === 'CN' ? `剩余时间: ${minutes}:${seconds}` : `Time Left: ${minutes}:${seconds}`;
};
const getLocalizedCorrectAnswersText = (correctAnswers, totalQuestions) => {
  return language === 'CN' ? `正确答案: ${correctAnswers} / ${totalQuestions}` : `Correct Answers: ${correctAnswers} / ${totalQuestions}`;
};
    if (testEnded) {
        
        return (
          <div className="results-page p-4">
          <h2 className='bg-green-300 py-1'>{getLocalizedResultsText()}</h2>
          <p className='bg-yellow-400 py-1'>{getLocalizedCorrectAnswersText(correctAnswers, selectedQuestions.length)}</p>
          <button onClick={() => navigate(`/march/profile/${userId}`,{state:{user:user}})}className="bg-red-400 text-green-900 px-3 mt-2 py-1 rounded-full text-sm  hover:bg-red-500 md:text-base shadow-sm">
              
              {getLocalizedGoBackButtonText()}
          </button>
      </div>
        );
    }
  
    
    return (
        <div className="mock-test-page p-4">
                        <div className="bg-yellow-500 ml-2 mr-2 text-white mt-2 mb-2 py-2 px-4 rounded block w-full sm:w-auto transition-colors duration-300 ease-in-out" >{getLocalizedTimeLeftText()}
                        <button onClick={() => navigate(`/march/profile/${userId}`,{state:{user:user}})}className="bg-red-400 text-green-900 px-3 ml-2 py-1 rounded-full text-sm  hover:bg-red-500 md:text-base shadow-sm">
              {language === 'CN' ? '终止测试（数据将不保存）' : 'back to profile'}</button></div> 
                        
            {selectedQuestions.length > 0 && (
                <Question
                    key={currentQuestionIndex}
                    index={currentQuestionIndex}
                    data={selectedQuestions[currentQuestionIndex][language]}
                    onAnswer={handleAnswerClick}
                    selectedAnswer={selectedAnswer}
                    language={language}
                    disableOnSelect={false} 
                />
            )}
            <button onClick={toggleLanguage} className="bg-blue-300 px-3 py-1 rounded-full text-sm md:text-base shadow-sm">
                {language === 'CN' ? '切换英文' : '切换中文'}
            </button>
            
        </div>

    );
};

export default MockTestPage;
