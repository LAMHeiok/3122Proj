import express from 'express';
import { LMStudioClient } from '@lmstudio/sdk';
import cors from 'cors'; // Import the cors package

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Initialize LMStudioClient
const client = new LMStudioClient();

// Define a route to handle requests
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Load the model
        const model = await client.llm.model("llama-3.2-1b-instruct".toLowerCase());

        // Generate a response
        const result = await model.respond(prompt);

        // Send the response back to the client
        res.json({ response: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});