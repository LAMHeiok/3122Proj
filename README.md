# Requirements

Please install Node.js

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

You will need to set the OpenAI model through editing the "credentials" file before using it.

Format of credentials:

```GITHUB_API_KEY="{your github api key}"
GITHUB_API_ENDPOINT="https://models.inference.ai.azure.com"
GITHUB_API_MODEL_NAME="gpt-4o-mini"
```

If any error occurs, please check the F12 console to see if any error occurs, normally, you would see

```
GetResponse is called!
```

Inside F12/Network, you should see `generate` where the actual response is `response/content`.

If you encounter bug, go to 3122Proj\node_modules\pdf-parse\index.js, remove testing purpose code.