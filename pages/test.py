import streamlit as st

# Title
st.title("Writing Practice")

# Dropdown for writing type selection
writing_type = st.selectbox("Choose a writing type:", ["Narrative", "Descriptive", "Expository", "Persuasive"])

# Complete writing sentence based on the selected type
if writing_type == "Narrative":
    example_sentence = "Once upon a time in a small village, a young girl named Lily discovered a hidden treasure."
elif writing_type == "Descriptive":
    example_sentence = "The sunset painted the sky in hues of orange and pink, casting a warm glow over the tranquil sea."
elif writing_type == "Expository":
    example_sentence = "Photosynthesis is the process by which green plants use sunlight to synthesize foods with the help of chlorophyll."
elif writing_type == "Persuasive":
    example_sentence = "Every citizen should make an effort to vote, as it is our fundamental right and the foundation of democracy."
elif writing_type == "PersuaAive":
    example_sentence = "Every citizen should make an effort to vote, as it is our fundamental right and the foundation of democracy."

# Display the example sentence
st.write(f"**Example Sentence**: {example_sentence}")

# Instructions for writing
st.write(f"You chose: **{writing_type}**. Please write around 200 words in this style below:")

# Text area for the user's writing
user_response = st.text_area("Your Writing:", height=300)

# Button to submit and display the response
if st.button("Submit"):
    if user_response:
        st.write("Thank you for your submission! Here’s what you wrote:")
        st.write(user_response)
    else:
        st.write("Please write your response before submitting.")