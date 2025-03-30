var longShortQuestionGenerate = ({ questionId, questionText, correctAnswer, answerShow, questionType }) => {
    let currentQuestion;

    function initialize() {
        currentQuestion = { questionId, questionText, correctAnswer, answerShow, questionType };
        console.log(`Initialized Long/Short Question: ${currentQuestion.questionText}`);
        createQuestionContainer(currentQuestion);
    }

    function createQuestionContainer(question) {
        // Create the question container div
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        questionContainer.style.display = 'flex';
        questionContainer.style.flexDirection = 'column';
        questionContainer.setAttribute('questionType', questionType);
    
        // Create and append the question text
        const questionTextSpan = document.createElement('span');
        questionTextSpan.className = 'question-text-span';
        questionTextSpan.textContent = question.questionText;
        questionContainer.appendChild(questionTextSpan);
    
        // Create the input field for the answer
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'input-text';
        inputField.setAttribute('data-correct-answer', question.correctAnswer); // Custom attribute for correct answer
        inputField.placeholder = 'Your Answer';
    
        questionContainer.appendChild(inputField);
    
        // Append the question container to the main-question-container
        const mainQuestionContainer = document.getElementById('main-question-container');
        if (mainQuestionContainer) {
            mainQuestionContainer.appendChild(questionContainer);
        } else {
            console.error('Main question container not found.');
        }
    }
    return {
        initialize,
        // Add any additional methods like gameStart as needed
    };
};