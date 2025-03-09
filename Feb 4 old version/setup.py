import os

# Specify the packages to install
packages = ['openai', 'streamlit']

# Install each package using pip
for package in packages:
    os.system(f'pip install {package}')