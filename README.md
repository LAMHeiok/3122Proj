# Requirements

Mar19: Update file list reload and add PDF viewer (.docx not done)

Please install Node.js, LMStudio

```
npm install cors@^2.8.5
npm install express@^4.21.2
npm install formidable@^2.1.2
npm install mammoth@^1.9.0
npm install openai@^4.87.4
npm install pdf-parse@^1.1.1
```

Version for reference:

```{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "formidable": "^2.1.2",
    "mammoth": "^1.9.0",
    "openai": "^4.87.4",
    "package": "^1.0.1",
    "pdf-parse": "^1.1.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0"
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

If you encounter bug, go to 3122Proj\node_modules\pdf-parse\index.js, remove testing purpose code.