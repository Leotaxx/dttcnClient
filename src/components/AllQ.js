import React, { useEffect, useState } from 'react';
import quizDataEN from '../dttqen.json';
import quizDataCN from '../dttcn.json';
//  import { useNavigate } from 'react-router-dom';


const getImagePath = (imageName) => {
try {
    return require(`../images/${imageName}`);
} catch (e) {
    console.error("Error loading image:", e);
    return ""; // Return an empty string or a default image path
}
};




const ProgressBarSlider = ({ current, total, onSliderChange }) => (
<input
    type="range"
    min="1"
    max={total}
    value={current}
    className="w-full h-3 cursor-pointer"
    onChange={onSliderChange}
    style={{ background: 'transparent' }} // additional styling can be added here
/>
);
const formatAnswer = (optionKey, answer) => {
return `${optionKey.charAt(optionKey.length - 1).toUpperCase()}. ${answer}`;
};

const Question = ({ index,data, onAnswer, showExplanation, selectedAnswer, nextQuestion ,language,redoIncorrect,nextRedoQuestion}) => {
    if (!data) {
        // Fallback UI could be a loading spinner, a message, or just null
        return <div>Loading question...</div>; // or return null;
    }
    const {  question_text, image_name, correct_answer,explanation } = data;

    const isCorrectAnswer = (answer) => answer === data['option_' + correct_answer.toLowerCase()];
    const formatExplanation = () => {
    const correctOptionKey = 'option_' + data.correct_answer.toLowerCase();
    const correctAnswerText = data[correctOptionKey];
    

    // Determine the selected option letter
    let selectedOptionLetter = '';
    ['option_a', 'option_b', 'option_c', 'option_d'].forEach(optionKey => {
    if (data[optionKey] === selectedAnswer) {
        selectedOptionLetter = optionKey.charAt(optionKey.length - 1).toUpperCase();
    }
    })

    const userResponse = selectedAnswer === correctAnswerText 
    ? (language === 'CN' ? `正确! ` : `Correct! `)
    : (language === 'CN' ? `不正确，你选择的答案是：${selectedOptionLetter}. ${selectedAnswer} ` 
                        : `Incorrect, your selected answer is: ${selectedOptionLetter}. ${selectedAnswer} `);

    return `${userResponse}${language === 'CN' ? '正确答案是：' : 'The correct answer is: '}${data.correct_answer}. ${correctAnswerText}. ${explanation}`;
};


return (
    <div className="p-4 rounded bg-white">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">
        {index+1}: {question_text}
    </h2>
    {image_name !== "loader.gif" && (
        <img src={getImagePath(image_name)} alt="Quiz Illustration" className="w-2/3 max-w-sm mx-auto mb-4" />
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey) => (
        <button
            key={optionKey}
            onClick={() => onAnswer(data[optionKey])}
            className={`bg-blue-500 text-white font-bold py-3 px-5 rounded text-base sm:text-lg ${selectedAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={!!selectedAnswer} // Disable button if an answer is selected
        >
            {formatAnswer(optionKey, data[optionKey])}
        </button>
        ))}
    </div>
    {showExplanation && (
        <div className={`p-4 rounded ${isCorrectAnswer(selectedAnswer) ? 'bg-green-300' : 'bg-red-300'}`}>
        <p className="mb-4 text-sm sm:text-base">{formatExplanation()}</p>
        <button onClick={redoIncorrect ? nextRedoQuestion : nextQuestion} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
            {language === 'CN' ? '下一题' : 'Next Question'}
        </button>
        </div>
    )}
    </div>
);
};

const AllQ = ({ fullAccess }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
        // Retrieve and parse the index from local storage, or default to 0
        const savedIndex = JSON.parse(localStorage.getItem('currentQuestionIndex'));
        return savedIndex !== null ? savedIndex : 0;
      });
const [selectedAnswer, setSelectedAnswer] = useState("");
const [showExplanation, setShowExplanation] = useState(false);
const [score, setScore] = useState(() => {
    // Retrieve and parse the score from local storage, or default to { correct: 0, incorrect: 0 }
    const savedScore = JSON.parse(localStorage.getItem('quizScore'));
    return savedScore !== null ? savedScore : { correct: 0, incorrect: 0 };
  });

const [incorrectQuestionIds, setIncorrectQuestionIds] = useState(() => {
    // Retrieve and parse the incorrect question IDs from local storage, or default to an empty array
    const savedIncorrectIds = JSON.parse(localStorage.getItem('incorrectQuestionIds'));
    return savedIncorrectIds !== null ? savedIncorrectIds : [];
  });
  

const [redoIncorrect, setRedoIncorrect] = useState(false);
const [currentRedoIndex, setCurrentRedoIndex] = useState(0);

const [language, setLanguage] = useState('CN'); // New state for language selection
const [quizData, setQuizData] = useState(quizDataCN); // Initialize with Chinese data
const [savedIndex, setSavedIndex] = useState(null);
const [redoAnswerCorrect,setRedoAnswerCorrect]=useState(false);


const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  // Use the throttle function instead of debounce
  const throttledSliderChange = throttle((selectedQuestionIndex) => {
    setCurrentQuestionIndex(selectedQuestionIndex);
  }, 100);
  
  const handleSliderChange = (e) => {
    const selectedQuestionIndex = parseInt(e.target.value, 10) - 1;
    throttledSliderChange(selectedQuestionIndex);
  };
  
// Function to toggle language
const toggleLanguage = () => {
    setLanguage((prevLang) => {
    const newLang = prevLang === 'CN' ? 'EN' : 'CN';
    setQuizData(newLang === 'CN' ? quizDataCN : quizDataEN);
    return newLang;
    });
};

useEffect(() => {
    if (redoIncorrect) {
        // Adjust to show current redo question index out of total incorrect questions
        document.title = `Redo Question ${currentRedoIndex + 1} of ${incorrectQuestionIds.length}`;
    } else {
        document.title = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    }
}, [currentQuestionIndex, quizData, currentRedoIndex, incorrectQuestionIds.length, redoIncorrect]);


const handleAnswerClick = (answer) => {
    
    setSelectedAnswer(answer);
    setShowExplanation(true);

    const currentQuestion = redoIncorrect
        ? quizData.find(q => q.question_id === incorrectQuestionIds[currentRedoIndex])
        : quizData[currentQuestionIndex];

    const correctAnswerText = currentQuestion['option_' + currentQuestion.correct_answer.toLowerCase()];

    if (answer === correctAnswerText) {
        if (!redoIncorrect) { // Only update score if not in redo mode
            setScore((prevScore) => ({
                correct: prevScore.correct + 1,
                incorrect: prevScore.incorrect
            }));
        }

        // If the answer is correct and we're in redo mode, move to the next redo question
        if (redoIncorrect) {
            setRedoAnswerCorrect(true);
        }
    } else {
        if (!redoIncorrect) { // Only update score if not in redo mode
            setScore((prevScore) => ({
                correct: prevScore.correct,
                incorrect: prevScore.incorrect + 1 // Ensure incorrect score is incremented
            }));

            // Add question ID to incorrectQuestionIds if not already present
            if (!incorrectQuestionIds.includes(currentQuestion.question_id)) {
                const updatedIncorrectQuestionIds = [...incorrectQuestionIds, currentQuestion.question_id];
                setIncorrectQuestionIds(updatedIncorrectQuestionIds);
                localStorage.setItem('incorrectQuestionIds', JSON.stringify(updatedIncorrectQuestionIds));
            }
        }
        // In redo mode, don't update score but move to the next question if incorrect
        else if (redoIncorrect) {
            setRedoAnswerCorrect(false);
        }
    }
};



const nextQuestion = () => {

    setShowExplanation(false);
    setSelectedAnswer("");
    setCurrentQuestionIndex((prevIndex) => (prevIndex < quizData.length - 1 ? prevIndex + 1 : 0));
};

const handleRedoIncorrect = () => {
    setSavedIndex(currentQuestionIndex); // Save the current index before entering redo mode
    setRedoIncorrect(true);
    setCurrentRedoIndex(0); // Start from the first incorrect question
    
};

const exitRedoMode = () => {
    setRedoIncorrect(false);
    setShowExplanation(false); // Reset explanation visibility if applicable
    setSelectedAnswer(""); // Clear any selected answer if applicable

    if (savedIndex !== null && savedIndex < quizData.length) {
        setCurrentQuestionIndex(savedIndex); // Restore the saved index
    } else {
        // Handle case where savedIndex is not applicable or user finished the quiz
        setCurrentQuestionIndex(0); // Optionally redirect to start or a different logic
    }

    localStorage.setItem('currentQuestionIndex', JSON.stringify(currentQuestionIndex));
    setSavedIndex(null); // Reset the saved index

    // Optional: Provide user feedback about mode transition
    // showToastNotification('Returning to the main quiz.'); // Example function call
};

const nextRedoQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer("");

    if (redoAnswerCorrect) {
        // Remove the correctly answered question from the list
        const updatedIncorrectQuestionIds = incorrectQuestionIds.filter((id, index) => index !== currentRedoIndex);
        setIncorrectQuestionIds(updatedIncorrectQuestionIds);
        localStorage.setItem('incorrectQuestionIds', JSON.stringify(updatedIncorrectQuestionIds));

        // Check if there are no more incorrect questions left
        if (updatedIncorrectQuestionIds.length === 0||updatedIncorrectQuestionIds.length<currentRedoIndex+1) {
            exitRedoMode(); // Exit redo mode if all incorrect questions have been corrected
            return; // Early return to prevent further execution
        }
    }

    // Calculate the next index based on the current position and the length of the updated list
    const nextIndex = redoAnswerCorrect ? currentRedoIndex : currentRedoIndex + 1;

    if (nextIndex < incorrectQuestionIds.length) {
        setCurrentRedoIndex(nextIndex);
    } else {
        // This case may not be necessary if all logic paths are correctly handled above
        exitRedoMode(); // Safeguard to exit redo mode if the next index is out of bounds
    }
};

useEffect(() => {
    // Update local storage when currentQuestionIndex changes
    localStorage.setItem('currentQuestionIndex', JSON.stringify(currentQuestionIndex));
}, [currentQuestionIndex]);
useEffect(() => {
    // Update local storage when incorrectQuestionIds changes
    localStorage.setItem('incorrectQuestionIds', JSON.stringify(incorrectQuestionIds));
  }, [incorrectQuestionIds]);
  useEffect(() => {
    // Update local storage when score changes
    localStorage.setItem('quizScore', JSON.stringify(score));
  }, [score]);

if (redoIncorrect) {
    

    const currentRedoQuestionId = incorrectQuestionIds[currentRedoIndex];
    const currentRedoQuestion = quizData.find(q => q.question_id === currentRedoQuestionId);
    
    return <Question index={currentRedoIndex}  data={currentRedoQuestion} onAnswer={handleAnswerClick} selectedAnswer={selectedAnswer}
                    showExplanation={showExplanation} nextQuestion={nextRedoQuestion} language={language} redoIncorrect={redoIncorrect} nextRedoQuestion={nextRedoQuestion}/>;
}

return (
    
    
    <div className="bg-gray-100 p-4 pt-2 sm:p-6 min-h-screen">
    <Question index={currentQuestionIndex} data={quizData[currentQuestionIndex]} onAnswer={handleAnswerClick} selectedAnswer={selectedAnswer}
                showExplanation={showExplanation} nextQuestion={nextQuestion} language={language}/>
    <ProgressBarSlider current={currentQuestionIndex+1} total={quizData.length} onSliderChange={handleSliderChange} ></ProgressBarSlider> 
              
    <div className="text-center mb-8 md:mb-12">
        <div className="bg-gray-100 p-4 pt-2 sm:p-6 flex flex-col sm:flex-row items-center justify-center">  
            <div className="flex items-center justify-start mb-4 space-x-2">
                <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm md:text-base shadow-sm">
                    {language === 'CN' ? '正确' : 'Correct'}: {score.correct}
                </span>
                <span className="bg-red-400 text-red-900 px-3 py-1 rounded-full text-sm md:text-base shadow-sm">
                    {language === 'CN' ? '错误' : 'Incorrect'}: {score.incorrect}
                </span>
                <button onClick={toggleLanguage} className="bg-blue-300 px-3 py-1 rounded-full text-sm md:text-base shadow-sm">
                    {language === 'CN' ? '切换英文' : '切换中文'} 
                </button>
                <button
                onClick={handleRedoIncorrect}
                disabled={!!selectedAnswer || incorrectQuestionIds.length === 0} // Disable button if an answer is selected or no incorrect questions
                className={`${
                    selectedAnswer || incorrectQuestionIds.length === 0 ? ' cursor-not-allowed bg-red-500 hover:opacity-50' : 'bg-red-500 hover:bg-red-600'
                } text-white px-3 py-1 rounded-full text-sm md:text-base shadow-sm  `}
                >
                {language === 'CN' ? `错题练习 (${incorrectQuestionIds.length}题)` : `Practice Incorrect (${incorrectQuestionIds.length})`}
                </button>
            </div>
            </div>
          </div>
          </div>
  
);
};

export default AllQ;