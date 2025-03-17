document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Check if the file is a text file, a .docx file, a .pdf file, or a .csv file
    const allowedExtensions = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'text/csv'];
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
    .then(response => response.text())
    .then(data => {
        // if (file.type === 'application/pdf') {
        //     renderPDF(data);
        // } else {
        document.getElementById('fileContent').textContent = data;
        // }
        loadUploadedFiles();
    })
    .catch(error => console.error('Error uploading file:', error));
});

// function renderPDF(pdfData) {
//     const pdfjsLib = window['pdfjs-dist/build/pdf'];
//     const pdfViewer = document.getElementById('pdfViewer');
//     pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

//     const loadingTask = pdfjsLib.getDocument({ data: pdfData });
//     loadingTask.promise.then(function(pdf) {
//         pdf.getPage(1).then(function(page) {
//             const viewport = page.getViewport({ scale: 1.5 });
//             const context = pdfViewer.getContext('2d');
//             pdfViewer.height = viewport.height;
//             pdfViewer.width = viewport.width;

//             const renderContext = {
//                 canvasContext: context,
//                 viewport: viewport
//             };
//             page.render(renderContext);
//         });
//     });
// }