import quizDataEN from '../dttqen.json';
import quizDataCN from '../dttcn.json';

const generateRandomQuestions = () => {
    // Assuming both quizDataEN and quizDataCN are aligned by question_id
    const questionIds = quizDataCN.map(q => q.question_id); // Extract all question_ids
    const selectedIds = new Set();

    // Assuming you want to select 40 unique question_ids
    while (selectedIds.size < 40 && questionIds.length > selectedIds.size) {
        const randomId = questionIds[Math.floor(Math.random() * questionIds.length)];
        selectedIds.add(randomId);
    }

    const questions = Array.from(selectedIds).map(id => ({
        EN: quizDataEN.find(q => q.question_id === id),
        CN: quizDataCN.find(q => q.question_id === id),
    }));
    
    return questions;
};

export default generateRandomQuestions;
