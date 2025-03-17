document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    formData.append('file', fileInput.files[0]);

    fetch('http://localhost:3000/uploads', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('fileContent').textContent = data;
        loadUploadedFiles();
    })
    .catch(error => console.error('Error uploading file:', error));
});