function loadUploadedFiles() {
    fetch('http://localhost:3000/list-uploads')
        .then(response => response.json())
        .then(files => {
            console.log('Available files:', files);
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
            files.forEach(file => {
                const listItem = document.createElement('li');
                listItem.className = 'flex items-center justify-between p-2';

                // Create filename span with dots
                const fileNameContainer = document.createElement('div');
                fileNameContainer.className = 'flex-1 flex items-center';
                
                const fileName = document.createElement('span');
                fileName.textContent = file;
                fileName.className = 'flex-shrink-0';
                
                const dots = document.createElement('div');
                dots.className = 'flex-1 mx-2 border-b border-dotted border-gray-300 dark:border-gray-600';
                
                fileNameContainer.appendChild(fileName);
                fileNameContainer.appendChild(dots);

                // Create button
                const button = document.createElement('button');
                button.textContent = 'Select';
                button.className = 'flex-shrink-0 bg-primary text-white px-3 py-1 rounded hover:bg-opacity-90 ml-2';
                button.addEventListener('click', async () => {
                    console.log('Requesting file:', file);
                    const fileExtension = file.split('.').pop().toLowerCase();
                    
                    try {
                        const response = await fetch(`http://localhost:3000/uploads/${file}`);
                        console.log('Response headers:', response.headers);
                        const contentType = response.headers.get('content-type');
                        
                        let data;
                        if (fileExtension === 'pdf') {
                            console.log('Detected PDF file');
                            data = await response.arrayBuffer();
                        } else if (fileExtension === 'docx') {
                            console.log('Detected DOCX file');
                            // Changed to text() since server will send converted text
                            data = await response.text();
                        } else if (contentType && contentType.includes('application/json')) {
                            console.log('Detected JSON response');
                            data = await response.json();
                        } else {
                            console.log('Detected text response');
                            data = await response.text();
                        }
            
                        console.log('Received data:', data);
                        console.log('Received data type:', typeof data);
                        
                        if (fileExtension === 'pdf') {
                            console.log('Processing PDF file');
                            showPdfContent();
                            renderPDF(data);
                        } else if (fileExtension === 'docx') {
                            console.log('Processing DOCX content');
                            showTextContent();
                            // Display the text directly since server has already converted it
                            document.getElementById('fileContent').textContent = data;
                        } else {
                            console.log('Processing text content');
                            showTextContent();
                            document.getElementById('fileContent').textContent = data;
                        }
                    } catch (error) {
                        console.error('Error fetching file content:', error);
                        document.getElementById('fileContent').textContent = `Error loading file: ${error.message}`;
                    }
                });
                listItem.appendChild(fileNameContainer);
                listItem.appendChild(button);
                fileList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error loading uploaded files:', error);
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = `<li class="error">Error loading files: ${error.message}</li>`;
        });
}

function showTextContent() {
    document.getElementById('textContent').classList.remove('hidden');
    document.getElementById('pdfContent').classList.add('hidden');
}

function showPdfContent() {
    document.getElementById('textContent').classList.add('hidden');
    document.getElementById('pdfContent').classList.remove('hidden');
}