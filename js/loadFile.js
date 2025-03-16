function loadUploadedFiles() {
    fetch('/list-uploads')
        .then(response => response.json())
        .then(files => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
            files.forEach(file => {
                const listItem = document.createElement('li');
                listItem.textContent = file;
                const button = document.createElement('button');
                button.textContent = 'Select';
                button.addEventListener('click', () => {
                    fetch(`/uploads/${file}`)
                        .then(response => response.text())
                        .then(data => {
                            document.getElementById('fileContent').textContent = data;
                        })
                        .catch(error => console.error('Error fetching file content:', error));
                });
                listItem.appendChild(button);
                fileList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading uploaded files:', error));
}

// Load the uploaded files when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadUploadedFiles();
    setInterval(loadUploadedFiles, 5000); // Refresh the list every 5 seconds
});