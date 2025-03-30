var radioMultiChoiceGenerate = ({ questionId, questionText, options, correctAnswer,questionType }) => {
    let currentQuestion;

    function initialize() {
        currentQuestion = { questionId, questionText, options, correctAnswer };
        console.log(`Initialized MC Question: ${currentQuestion.questionText}`);
        createQuestionContainer(currentQuestion);
    }

    function createQuestionContainer(currentQuestion) {
        // Create the question container div
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
    
        // Create and append the question text
        const questionTextSpan = document.createElement('span');
        questionTextSpan.className = 'question-text-span';
        questionTextSpan.textContent = currentQuestion.questionText;
        questionContainer.appendChild(questionTextSpan);
        questionContainer.setAttribute('questionType', questionType);
    
        // Create radio button options
        currentQuestion.options.forEach((option, index) => {
            const radioDiv = document.createElement('div');
            radioDiv.className = 'radio-select';
    
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question-${currentQuestion.questionId}`; // Ensure unique name for grouping
            radioInput.value = option;
            radioInput.setAttribute('data-correct-answer', currentQuestion.correctAnswer === index + 1); // Assuming correctAnswer is 1-based index
    
            const label = document.createElement('label');
            label.textContent = option;
            label.prepend(radioInput); // Add radio input before the label text
    
            radioDiv.appendChild(label);
            questionContainer.appendChild(radioDiv);
        });
    
        // Append the question container to the main-question-container
        const mainQuestionContainer = document.getElementById('main-question-container');
        if (mainQuestionContainer) {
            mainQuestionContainer.appendChild(questionContainer); // Ensure your HTML has a main-question-container div
        } else {
            console.error('Main question container not found.');
        }
    }

    return {
        initialize,
        // Add any additional methods like gameStart as needed
    };
};