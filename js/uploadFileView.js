document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Check if the file is a text file, a .docx file, or a .pdf file
    const allowedExtensions = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
    if (!allowedExtensions.includes(file.type)) {
        alert('Only text files, .docx and .pdf files are allowed.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:3000/uploads', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    })
    .then(data => {
        if (typeof data === 'object' && data.isPdf) {
            // Handle PDF file
            const binaryString = atob(data.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            renderPDF(bytes.buffer);
        } else if (file.type === 'application/pdf') {
            // If the file is PDF but not returned as JSON
            fetch(URL.createObjectURL(file))
                .then(response => response.arrayBuffer())
                .then(buffer => renderPDF(buffer))
                .catch(error => console.error('Error loading PDF:', error));
        } else {
            document.getElementById('fileContent').textContent = data;
        }
        loadUploadedFiles();
    })
    .catch(error => console.error('Error uploading file:', error));
});

function renderPDF(pdfData) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfLoading = document.getElementById('pdfLoading');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    // Show loading indicator
    pdfLoading.classList.remove('hidden');

    // Create a new PDF document
    const loadingTask = pdfjsLib.getDocument(new Uint8Array(pdfData));
    
    loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');
        
        // Get the first page
        pdf.getPage(1).then(function(page) {
            const scale = 1.25;
            const viewport = page.getViewport({scale: scale});

            // Prepare canvas using PDF page dimensions
            pdfViewer.height = viewport.height;
            pdfViewer.width = viewport.width;

            // Get canvas context
            const context = pdfViewer.getContext('2d');

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext).promise.then(function() {
                console.log('Page rendered');
                // Hide loading indicator when done
                pdfLoading.classList.add('hidden');
            }).catch(function(error) {
                console.error('Error rendering page:', error);
                pdfLoading.classList.add('hidden');
            });
        });
    }).catch(function(error) {
        console.error('Error loading PDF:', error);
        pdfLoading.classList.add('hidden');
    });
}