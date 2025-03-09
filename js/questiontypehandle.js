fetch('questiontext.json')
  .then(response => response.json())
  .then(exerciseData => {
      // Loop through the sections and process the questions
      exerciseData.sections.forEach(section => {
          section.questions.forEach(question => {
              const { questionId, questionText, questionType, answerShow, options } = question;

              if (questionType === 1) {
                  // Call radioMultiChoice for multiple-choice questions
                  radioMultiChoice(questionId, questionText, options);
              } else if (questionType === 2) {
                  // Call longShortQuestion for short/long questions
                  longShortQuestion(questionId, questionText, answerShow);
              }
          });
      });
  })
  .catch(error => {
      console.error('Error loading JSON:', error);
  });