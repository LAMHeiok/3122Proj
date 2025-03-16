# Requirements

Mar17: Added functions to upload/read files

Functions:
- Able to upload .txt/.docx/.csv files
- Can read .docx file as pure text and saves as .txt file

Problems:
- Unable to load uploaded files when clicked on "File Upload" button
- Cannot handle other types of files (If .png file is uploaded, it will cause error. I will fix it later)

Please install Node.js, LMStudio

```
npm install @lmstudio/sdk, cors, docx, express, formidable, mammoth
```

Version for reference:

```{
  "dependencies": {
    "@lmstudio/sdk": "^1.0.1",
    "cors": "^2.8.5",
    "docx": "^9.3.0",
    "express": "^4.21.2",
    "formidable": "^2.1.2",
    "mammoth": "^1.9.0"
  }
}
```

Remember to run `node js/server.mjs` for the AI to response

You can always change the model to test the efficiency/performance in `server.mjs (line 27)`

You will need to install the model through LMStudio before using it.

For my potato computer, it really TAKES some time to respond, in case you think it doesn't work

If any error occurs, please check the F12 console to see if any error occurs, normally, you would see

```
sendLLM Ran
GetResponse is called!
```

Inside F12/Network, you should see `generate` where the actual response is `response/content`, I have a cleaner to remove any tag or `\n` 
