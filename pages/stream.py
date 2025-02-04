import streamlit as st
import json, os, toml
from openai import OpenAI

#API key
api_path = 'pages/secret'
if os.path.exists(api_path):
    with open(api_path, 'r') as f:
        secrets = toml.load(f)
else:
    secrets = st.secrets

def github_reply(system_prompt, user_prompt):
    print("Answer using Github API")
    endpoint = "https://models.inference.ai.azure.com"
    model_name = "gpt-4o-mini"
    token = secrets['GITHUB']['GITHUB_API_KEY']

    client = OpenAI(
        base_url=endpoint,
        api_key=token,
    )
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            }
        ],
        temperature=1.0,
        top_p=1.0,
        max_tokens=1000,
        model=model_name
    )

    return response.choices[0].message.content


# execute if the script is run directly
if __name__ == "__main__":
    # model_type = "openrouter"
    model_type = "github"
    result = github_reply("Answer in chinese", "What is the capital of France?")
    st.text(result)
    print(result)

