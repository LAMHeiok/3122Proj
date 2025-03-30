async function loadUploadedFiles() {
    fetch('http://localhost:3000/list-uploads')
        .then(response => response.json())
        .then(files => {
            console.log('Available files:', files);
            const fileList = document.getElementById('fileList');
            
            // Clear existing list
            fileList.innerHTML = '';
            
            // Check if files array is empty
            if (!files || files.length === 0) {
                fileList.innerHTML = '<li class="p-4 text-gray-500 dark:text-gray-400 text-center italic">No files uploaded yet</li>';
                return;
            }
            
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

                // Create Select button
                const selectButton = document.createElement('button');
                selectButton.textContent = 'Select';
                selectButton.className = 'flex-shrink-0 bg-primary text-white px-3 py-1 rounded hover:bg-opacity-90 ml-2';
                selectButton.addEventListener('click', async () => {
                    console.log('Requesting file:', file);
                    const fileExtension = file.split('.').pop().toLowerCase();
                    
                    try {
                        if (fileExtension === 'docx') {
                            file = file.replace('.docx', '.txt');
                        }
                        const response = await fetch(`http://localhost:3000/uploads/${file}`);
                        console.log('Response headers:', response.headers);
                        const contentType = response.headers.get('content-type');
                        
                        let data;
                        if (fileExtension === 'pdf') {
                            console.log('Detected PDF file');
                            data = await response.arrayBuffer();
                        } else if (fileExtension === 'docx') {
                            console.log('Detected DOCX file');
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

                // Create Edit button
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'flex-shrink-0 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-opacity-90 ml-2';
                editButton.addEventListener('click', async () => {
                    const newFileName = prompt('Enter new file name:', file);
                    if (newFileName && newFileName !== file) {
                        try {
                            const response = await fetch('http://localhost:3000/rename-file', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    oldName: file,
                                    newName: newFileName,
                                }),
                            });

                            if (response.ok) {
                                console.log(`File renamed from ${file} to ${newFileName}`);
                                // Refresh the file list after renaming
                                loadUploadedFiles();
                            } else {
                                const errorData = await response.json();
                                console.error('Error renaming file:', errorData.error);
                                alert(`Error: ${errorData.error}`);
                            }
                        } catch (error) {
                            console.error('Error during rename request:', error);
                            alert('Error renaming file. Please try again.');
                        }
                    }
                });

                // Append buttons to list item
                listItem.appendChild(fileNameContainer);
                listItem.appendChild(selectButton);
                listItem.appendChild(editButton);
                fileList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error loading uploaded files:', error);
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = `<li class="error">Error loading files: ${error.message}</li>`;
        });
}

async function showTextContent() {
    document.getElementById('textContent').classList.remove('hidden');
    document.getElementById('pdfContent').classList.add('hidden');
}

async function showPdfContent() {
    document.getElementById('textContent').classList.add('hidden');
    document.getElementById('pdfContent').classList.remove('hidden');
}