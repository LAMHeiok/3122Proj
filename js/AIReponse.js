var AIResponse = window.AIResponse || (() => {

    const getResponse = async (prompt) => {
        console.log('getResponse is called!')
        if (!prompt) {
            throw new Error('Prompt is required');
        }

        try {
            // Make a POST request to the Node.js server
            const response = await fetch('http://localhost:3000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const cleanedText = cleanContent(data.response.content);
            return cleanedText;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while processing your request');
        }
    };

    // Helper function to clean the response content
    const cleanContent = (responseText) => {
        responseText = responseText.replace(/\n/g, '').replaceAll(/<\/?[^>]+(>|$)/g, ""); // Remove newline characters
        return responseText;
    }

    return {
        getResponse,
    }
})();
