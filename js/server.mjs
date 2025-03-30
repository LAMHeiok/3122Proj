import express from 'express';
import { LMStudioClient } from '@lmstudio/sdk';
import cors from 'cors'; // Import the cors package
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises'
import { fileURLToPath } from 'url';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { readFileSync } from 'fs';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import OpenAI from "openai"

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Initialize openAi

// Read the TOML file
let token;
let client;
try {
    const o = await createOpenAIClient(); // Await the result
    token =o.token;
    client=o.client;
    console.log("Token from outside:", token); // Now you can access the token
    // Now you can use the 'client' object
} catch (error) {
    console.error("Failed to create OpenAI client:", error);
}

// Serve static files from the project directory
app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages', 'index.html'));
});

// Define a route to handle requests
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await client.chat.completions.create({
    messages: [
      { role:"system", content: `generate questions in format of json, questionId cummulates and correctAnswer equals to index in optoins only provide the code itself. template: { "exerciseId": 10000, "exerciseTitle": "Exercise 1: ", "sections": [ { "sectionId": 11000, "sectionTitle": "A.: ", "questions": [ { "questionId": 11001, "questionText": "This is a test MC question", "correctAnswer": 2, "questionType": 1, "answerShow": "", "options": [ "yes", "no", "ok", "not ok" ] } ] }, { "sectionId": 12000, "sectionTitle": "B. No Thank you, no fankiu", "questions": [ { "questionId": 12001, "questionText": "This is a test short/long question: should people always say thank you?", "correctAnswer": "Yes, they should./Yes, they should always say thank you.", "questionType": 2, "answerShow": "Yes, they should" } ] } ] }"`},
      { role:"user", content: prompt }
    ],
    model: "gpt-4o-mini",
    temperature: 0.5,
    max_tokens: 4096,
    top_p: 1
  });

        // Send the response back to the client
        res.json({ response: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.post('/saveResponse', async (req, res) => {
    const filePath = 'data.json'; // Define file path
    try {
        const responseFromLLM = req.body.response; // Extract the response from the request body
        if (!responseFromLLM) {
            return res.status(400).send('Missing response data'); // Handle missing data
        }

        await saveJsonToFile(responseFromLLM, filePath); // Pass the correct response

        res.status(200).send('Response saved successfully'); // Send success response
    } catch (error) {
        console.error('Error in /saveResponse route:', error);
        res.status(500).send('Error saving response'); // Send error response
    }
});
// Route to handle file upload
app.post('/uploads', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads');
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        console.log(files); // Log the files object to inspect its structure

        const file = files.file;
        if (!file) {
            res.status(400).send('No file uploaded');
            return;
        }

        const oldPath = file.filepath || file.path; // Use file.path for older versions of formidable
        const newPath = path.join(form.uploadDir, file.originalFilename || file.name); // Use file.name for older versions of formidable

        fs.rename(oldPath, newPath, async (err) => {
            if (err) {
                res.status(500).send(err);
                return;
            }

            // Extract text from .docx file
            if (path.extname(newPath) === '.docx') {
                try {
                    const buffer = readFileSync(newPath);
                    const result = await mammoth.extractRawText({ buffer });
                    const text = result.value;
                    // save the text as .txt file
                    const txtPath = newPath.replace('.docx', '.txt');
                    fs.writeFileSync(txtPath, text);
                    // remove .docx file
                    //fs.unlinkSync(newPath);
                    res.send(text);
                } catch (error) {
                    res.status(500).send(error);
                }
            } else if (path.extname(newPath) === '.pdf') {
                // Extract text from .pdf file
                try {
                    const dataBuffer = readFileSync(newPath);
                    const data = await pdfParse(dataBuffer);
                    const text = data.text;
                    res.send(text);
                } catch (error) {
                    res.status(500).send(error);
                }
            } else {
                // Read the file text
                fs.readFile(newPath, 'utf8', function(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    // Send the file text to the client
                    res.send(data);
                });
            }
        });
    });
});

app.get('/retrieve-file', async (req, res) => {
    const { filePath } = req.query; // Assume filePath is passed as a query parameter

    if (!filePath) {
        return res.status(400).json({ error: 'File path is required' });
    }

    try {
        const content = await retrieveFileContent(filePath);
        if (content === null) {
            return res.status(404).json({ error: 'File not found' }); // Handle file not found
        }
        res.status(200).json({ content }); // Return the file content
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve file content' });
    }
});

app.get('/list-questiongenerated', async (req, res) => {
    const folderPath = path.join(__dirname, '../questiongenerated');

    try {
        const files = await listFolderContents(folderPath);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list folder contents' });
    }
});

// Route to list uploaded files
app.get('/list-uploads', (req, res) => {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            res.status(500).send(err);
            console.log('list upload only error')
            return;
        }
        
        // Filter out .txt files that have corresponding .docx or .pdf files
        const filteredFiles = files.filter(file => {
            if (path.extname(file) === '.txt') {
                const baseName = path.basename(file, '.txt');
                const hasDocx = files.includes(`${baseName}.docx`);
                const hasPdf = files.includes(`${baseName}.pdf`);
                return !(hasDocx || hasPdf);
            }
            return true;
        });

        res.json(filteredFiles);
    });
});

// Route to rename uploaded files
app.post('/rename-file', async (req, res) => {
    const { oldName, newName } = req.body;
    const uploadDir = path.join(__dirname, '../uploads');

    if (!oldName || !newName) {
        return res.status(400).json({ error: 'Old name and new name are required' });
    }

    const oldPath = path.join(uploadDir, oldName);
    const newPath = path.join(uploadDir, newName);

    try {
        // Check if the old file exists
        await fsp.access(oldPath);

        // Rename the file
        await fsp.rename(oldPath, newPath);
        console.log(`File renamed from ${oldName} to ${newName}`);

        res.status(200).json({ message: 'File renamed successfully' });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: 'File not found' });
        }
        console.error('Error renaming file:', error);
        res.status(500).json({ error: 'Failed to rename file' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

async function createOpenAIClient() {
    let token = "";

    try {
        const data = await fsp.readFile('credentials', 'utf8');
        const regex = /GITHUB_API_KEY\s*=\s*"([^"]+)"/;
        const match = data.match(regex);

        if (match) {
            token = match[1];
            console.log('GitHub API Key:', token);
        } else {
            console.log('GITHUB_API_KEY not found.');
            throw new Error('GITHUB_API_KEY not found.'); // Throw an error to be caught
        }

        console.log("Token is:", token);

        const client = new OpenAI({
            baseURL: "https://models.inference.ai.azure.com",
            apiKey: token,
        });
        console.log("OpenAI client created successfully.");

        return { token: token, client: client }; // Return both token and client
    } catch (err) {
        console.error('Error reading the file or creating OpenAI client:', err);
        throw err; // Re-throw the error to be handled by the caller
    }
}
async function saveJsonToFile(jsonString, filePath) {
    let longerPath = `questiongenerated/${filePath}`
    let newFilePath = longerPath;
    let counter = 1;

    try {
        // Check if the file exists
        await fsp.access(newFilePath); // Throws an error if the file doesn't exist

        // If the file exists, generate a new filename
        const { dir, name, ext } = path.parse(longerPath);
        while (true) {
            newFilePath = path.join(dir, `${name}_${counter}${ext}`);
            try {
                await fsp.access(newFilePath); // Check if the new file exists
                counter++;
            } catch (err) {
                // File doesn't exist, so we can use this path
                break;
            }
        }
    } catch (err) {
        // File doesn't exist, so we can use the original path
    }

    try {
        const jsonObject = JSON.parse(jsonString);
        const formattedJsonString = JSON.stringify(jsonObject, null, 2);
        await fsp.writeFile(newFilePath, formattedJsonString, 'utf8');
        console.log(`JSON data saved to ${newFilePath}`);
    } catch (error) {
        console.error('Error saving JSON to file:', error);
        throw error; // Re-throw the error so the route can handle it
    }
}

async function listFolderContents(folderPath) {
    try {
        const files = await fsp.readdir(folderPath);
        return files; // Returns an array of file names
    } catch (err) {
        console.error(`Error reading folder contents: ${err.message}`);
        throw err; // Re-throw the error for handling
    }
}

async function retrieveFileContent(filePath) {
    try {
        // Check if the file exists
        await fsp.access(filePath);

        // Read the content of the file
        const content = await fsp.readFile(filePath, 'utf8');
        return content; // Return the content
    } catch (err) {
        if (err.code === 'ENOENT') {
            // File does not exist
            return null; // Return null if the file does not exist
        } else {
            console.error(`Error retrieving file: ${err.message}`);
            throw err; // Re-throw the error for handling
        }
    }
}