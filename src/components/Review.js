import React from 'react';
import { useLocation } from 'react-router-dom';
import Question from './Question';

const ReviewPage = () => {
    const location = useLocation();
    const { incorrectQuestionIds, userId } = location.state;

    // Assume you have a function to fetch question details by ID
    // const fetchQuestionById = (id) => { ... };

    return (
        <div className="review-page">
            <h2>Review Incorrect Questions</h2>
            {incorrectQuestionIds.map((questionId, index) => (
                <Question key={index} questionId={questionId} />
                // Implement your logic to display questions based on IDs
                // You might need to fetch question details based on IDs or pass them directly if available
            ))}
        </div>
    );
};
