import express from 'express';
import { LMStudioClient } from '@lmstudio/sdk';
import cors from 'cors'; // Import the cors package
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { readFileSync } from 'fs';
import mammoth from 'mammoth';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Initialize LMStudioClient
const client = new LMStudioClient();

// Serve static files from the project directory
app.use(express.static(path.join(__dirname, '../')));

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

        // Load the model
        const model = await client.llm.model("deepseek-r1-distill-qwen-7b".toLowerCase());

        // Generate a response
        const result = await model.respond(prompt);

        // Send the response back to the client
        res.json({ response: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
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

            // Extract text from .docx file and save as .txt file
            if (path.extname(newPath) === '.docx') {
                try {
                    const buffer = readFileSync(newPath);
                    const result = await mammoth.extractRawText({ buffer });
                    const text = result.value;
                    const txtPath = newPath.replace('.docx', '.txt');
                    fs.writeFileSync(txtPath, text);
                    // remove the .docx file
                    fs.unlinkSync(newPath);
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

// Route to list uploaded files
app.get('/list-uploads', (req, res) => {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(files);
    });
});

// Route to get the content of a specific file
app.get('/uploads/:filename', async (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(data);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});