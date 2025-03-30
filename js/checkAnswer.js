// checkAnswer.js

function checkAnswer() {
    // Get all question containers
    const questionContainers = document.querySelectorAll('.question-container');
    
    questionContainers.forEach(container => {
        const questionType = parseInt(container.getAttribute('questiontype'));
        console.log(questionType)
        // Reset background color first
        container.style.backgroundColor = '';

        if (questionType === 1) {
            // Handle multiple choice (radio) questions
            const selectedRadio = container.querySelector('input[type="radio"]:checked');
            console.log('selected Radio: ' , selectedRadio)
            if (selectedRadio) {
                const isCorrect = selectedRadio.getAttribute('data-correct-answer') === 'true';
                if (isCorrect) {
                    container.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'; // Green with 20% opacity
                }
            }
        } else if (questionType === 2) {
            console.log('checked type 2')
            // Handle text input questions
            const inputField = container.querySelector('.input-text');
            const correctAnswer = inputField.getAttribute('data-correct-answer').trim().toLowerCase();
            const userAnswer = inputField.value.trim().toLowerCase();

            if (userAnswer === correctAnswer) {
                container.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'; // Green with 20% opacity
            } else {
                console.log('correct answer: ', correctAnswer)
                
            }
        }
    });
}

// Add event listener to submit button
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', checkAnswer);
    }
});

// Export the function if needed for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkAnswer };
}