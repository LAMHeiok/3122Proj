const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

function updateFileLabel(input) {
    const fileLabel = document.getElementById('fileLabel');
    fileLabel.textContent = input.files.length > 0 
        ? input.files[0].name 
        : 'No file selected';
}

// Add height transition class
function addTransitionClass() {
    dropZone.style.transition = 'all 0.3s ease';
    dropZone.style.minHeight = '160px';
}

// Remove height transition class
function removeTransitionClass() {
    dropZone.style.transition = 'all 0.3s ease';
    dropZone.style.minHeight = '80px';
}

// File input change handler
fileInput.addEventListener('change', function() {
    updateFileLabel(this);
});

// Drag and drop handlers
const dragHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        dropZone.classList.add('drag-active');
        addTransitionClass();
    }
};

dropZone.addEventListener('dragenter', dragHandler);
dropZone.addEventListener('dragover', dragHandler);

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-active');
        removeTransitionClass();
    }
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-active');
    removeTransitionClass();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        updateFileLabel(fileInput);
    }
});