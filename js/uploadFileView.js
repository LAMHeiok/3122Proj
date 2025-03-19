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
    const pdfContainer = document.getElementById('pdfContent');
    const pdfLoading = document.getElementById('pdfLoading');

    if (!pdfViewer || !pdfContainer || !pdfLoading) {
        console.error('Required PDF viewer elements not found');
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    // Show loading indicator and container
    pdfLoading.classList.remove('hidden');
    pdfContainer.classList.remove('hidden');

    // Clear existing content
    pdfViewer.innerHTML = '';

    // Create a new PDF document
    const loadingTask = pdfjsLib.getDocument(new Uint8Array(pdfData));
    
    loadingTask.promise.then(async function(pdf) {
        console.log('PDF loaded');
        const numPages = pdf.numPages;
        
        // Create a container for all pages
        const pagesContainer = document.createElement('div');
        pagesContainer.className = 'flex flex-col items-center space-y-4';
        pdfViewer.appendChild(pagesContainer);

        // Get container width for scaling
        const containerWidth = pdfViewer.clientWidth - 32; // subtract padding
        
        // Render each page
        for(let pageNum = 1; pageNum <= numPages; pageNum++) {
            try {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.0 }); // Get original viewport
                
                // Calculate scale to fit container width
                const scale = containerWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale });

                // Create canvas for this page
                const canvas = document.createElement('canvas');
                canvas.className = 'shadow-lg rounded-lg w-full';
                pagesContainer.appendChild(canvas);

                // Prepare canvas using scaled PDF page dimensions
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                // Get canvas context
                const context = canvas.getContext('2d');

                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };

                await page.render(renderContext).promise;
                console.log(`Page ${pageNum} rendered at scale ${scale}`);
                
                if(pageNum === numPages) {
                    pdfLoading.classList.add('hidden');
                }
            } catch(error) {
                console.error(`Error rendering page ${pageNum}:`, error);
                pdfLoading.classList.add('hidden');
            }
        }
    }).catch(function(error) {
        console.error('Error loading PDF:', error);
        pdfLoading.classList.add('hidden');
    });
}