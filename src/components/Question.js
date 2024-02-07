// Question.js
import React from 'react';

    const getImagePath = (imageName) => {
        try {
            return require(`../images/${imageName}`);
        } catch (e) {
            console.error("Error loading image:", e);
            return ""; // Return an empty string or a default image path
        }
    };

const formatAnswer = (optionKey, answer) => {
    return `${optionKey.charAt(optionKey.length - 1).toUpperCase()}. ${answer}`;
};

const Question = ({ index,data, onAnswer, showExplanation, selectedAnswer, nextQuestion ,language,redoIncorrect,nextRedoQuestion, disableOnSelect = false}) => {
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
                    className={`bg-blue-500 text-white font-bold py-3 px-5 rounded text-base sm:text-lg ${selectedAnswer && disableOnSelect ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    disabled={!!selectedAnswer && disableOnSelect} // Conditionally disable button based on props
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

export default Question;
