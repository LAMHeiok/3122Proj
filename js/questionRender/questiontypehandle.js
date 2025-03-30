var questionTypeHandle = window.questionTypeHandle || function() {
const exerciseDataString = localStorage.getItem('currentExerciseInfo');

if (exerciseDataString) {
    try {
        const exerciseData = JSON.parse(exerciseDataString)
        exerciseData.sections.forEach(section => {
            console.log(`Section Title: ${section.sectionTitle}`);
    
            section.questions.forEach(question => {
                const { questionId, questionText, options, correctAnswer, questionType, answerShow } = question;
    
                if (questionType === 1) {
                    // Call function for type 1 questions
                    const questionGenerator = radioMultiChoiceGenerate({ questionId, questionText, options, correctAnswer, questionType });
                    questionGenerator.initialize();
                } else if (questionType === 2) {
                    // Call function for type 2 questions
                    const questionGenerator = longShortQuestionGenerate({ questionId, questionText, options, correctAnswer, answerShow, questionType });
                    questionGenerator.initialize();
                }
            });
        });
        document.querySelector('#content-placeholder').textContent = '';
        document.querySelector('#submit-button').classList.remove('hidden');
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
} else {
    console.error('No exercise data found in localStorage');
}
};