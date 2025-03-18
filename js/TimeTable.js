
// Global variables to store timetable data
let timetableData = {
    events: []
};

// Time configuration
const timeConfig = {
    startHour: 8,
    endHour: 20,
    intervalMinutes: 30
};


// Dark mode detection and toggle
function initializeDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    // Listen for changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
    
    // Toggle button
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });
}

// Initialize application
function initializeApp() {
    initializeDarkMode();
    setupEventForm();
    generateTimeGrid();
    updateJsonPreview();
    
    // Setup the color input to update the hex display
    const colorInput = document.getElementById('eventColor');
    const colorHexValue = document.getElementById('colorHexValue');
    
    colorInput.addEventListener('input', function() {
        colorHexValue.textContent = this.value.toUpperCase();
    });
}

// Generate time grid
function generateTimeGrid() {
    const timeLabels = document.getElementById('timeLabels');
    const timetableGrid = document.getElementById('timetableGrid');
    
    // Clear existing content
    timeLabels.innerHTML = '';
    timetableGrid.innerHTML = '';
    
    // Generate the grid for the days
    for (let day = 0; day < 7; day++) {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'relative h-full border-r border-gray-200 dark:border-gray-700 last:border-r-0';
        dayColumn.dataset.day = getDayName(day);
        timetableGrid.appendChild(dayColumn);
    }
    
    // Generate time slots
    const totalMinutes = (timeConfig.endHour - timeConfig.startHour) * 60;
    const slots = totalMinutes / timeConfig.intervalMinutes;
    
    for (let i = 0; i <= slots; i++) {
        const minutes = i * timeConfig.intervalMinutes;
        const hour = timeConfig.startHour + Math.floor(minutes / 60);
        const minute = minutes % 60;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Add time label
        const timeLabel = document.createElement('div');
        timeLabel.className = 'text-xs font-medium text-gray-500 dark:text-gray-400 text-center h-10 flex items-center justify-center';
        timeLabel.textContent = timeString;
        timeLabels.appendChild(timeLabel);
        
        // Add horizontal grid line
        if (i < slots) {
            const gridLine = document.createElement('div');
            gridLine.className = 'time-grid-line absolute left-0 right-0';
            gridLine.style.top = `${(i + 1) * 40}px`; // 40px per time slot
            timetableGrid.appendChild(gridLine);
        }
    }
    
    // Set height of the timetable grid
    timetableGrid.style.height = `${slots * 40}px`;
}

// Get day name from index
function getDayName(index) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[index];
}

// Get day index from name
function getDayIndex(name) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(name);
}

// Convert time to grid position
function timeToGridPosition(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = (hours - timeConfig.startHour) * 60 + minutes;
    // Ensure we don't get negative positions for times earlier than startHour
    return Math.max(0, (totalMinutes / timeConfig.intervalMinutes) * 40); // 40px per slot
}

// Setup event form
function setupEventForm() {
    const eventForm = document.getElementById('eventForm');
    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveEvent();
    });
}

// Open event editor for a new event
function openNewEventEditor() {
    const eventEditor = document.getElementById('eventEditor');
    const editorTitle = document.getElementById('editorTitle');
    const deleteBtn = document.getElementById('deleteBtn');
    const eventForm = document.getElementById('eventForm');
    
    // Set default values
    document.getElementById('eventId').value = '';
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDay').value = 'Monday';
    document.getElementById('eventStart').value = '09:00';
    document.getElementById('eventEnd').value = '10:00';
    document.getElementById('eventLocation').value = '';
    document.getElementById('eventDescription').value = '';
    document.getElementById('eventColor').value = '#5D5CDE';
    document.getElementById('colorHexValue').textContent = '#5D5CDE';
    
    // Update UI
    editorTitle.textContent = 'Add New Event';
    deleteBtn.classList.add('hidden');
    eventEditor.classList.remove('hidden');
    
    // Focus on the title field
    document.getElementById('eventTitle').focus();
}

// Open event editor to edit an existing event
function openEditEventEditor(eventId) {
    const event = timetableData.events.find(e => e.id === eventId);
    if (!event) return;
    
    const eventEditor = document.getElementById('eventEditor');
    const editorTitle = document.getElementById('editorTitle');
    const deleteBtn = document.getElementById('deleteBtn');
    
    // Set form values
    document.getElementById('eventId').value = event.id;
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDay').value = event.day;
    document.getElementById('eventStart').value = event.startTime;
    document.getElementById('eventEnd').value = event.endTime;
    document.getElementById('eventLocation').value = event.location || '';
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventColor').value = event.color || '#5D5CDE';
    document.getElementById('colorHexValue').textContent = event.color || '#5D5CDE';
    
    // Update UI
    editorTitle.textContent = 'Edit Event';
    deleteBtn.classList.remove('hidden');
    eventEditor.classList.remove('hidden');
    
    // Focus on the title field
    document.getElementById('eventTitle').focus();
}

// Close event editor
function closeEventEditor() {
    const eventEditor = document.getElementById('eventEditor');
    eventEditor.classList.add('hidden');
}

// Save event (add new or update existing)
function saveEvent() {
    const eventId = document.getElementById('eventId').value;
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDay = document.getElementById('eventDay').value;
    const eventStart = document.getElementById('eventStart').value;
    const eventEnd = document.getElementById('eventEnd').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventColor = document.getElementById('eventColor').value;
    
    // Validate form
    if (!eventTitle || !eventStart || !eventEnd) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Validate times
    if (eventStart >= eventEnd) {
        alert('Start time must be before end time.');
        return;
    }
    
    if (eventId) {
        // Update existing event
        const index = timetableData.events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            timetableData.events[index] = {
                id: eventId,
                title: eventTitle,
                day: eventDay,
                startTime: eventStart,
                endTime: eventEnd,
                location: eventLocation,
                description: eventDescription,
                color: eventColor
            };
        }
    } else {
        // Add new event
        const newEvent = {
            id: 'event_' + Date.now(),
            title: eventTitle,
            day: eventDay,
            startTime: eventStart,
            endTime: eventEnd,
            location: eventLocation,
            description: eventDescription,
            color: eventColor
        };
        timetableData.events.push(newEvent);
    }
    
    // Update the UI
    renderTimetable();
    updateJsonPreview();
    closeEventEditor();
}

// Delete event
function deleteEvent() {
    const eventId = document.getElementById('eventId').value;
    if (!eventId) return;
    
    // Find and remove the event
    const index = timetableData.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
        timetableData.events.splice(index, 1);
        
        // Update the UI
        renderTimetable();
        updateJsonPreview();
        closeEventEditor();
    }
}

// Render timetable with events
function renderTimetable() {
    // Clear existing events (but keep the grid structure)
    const dayColumns = document.querySelectorAll('#timetableGrid > div');
    dayColumns.forEach(col => {
        // Keep the column but remove events
        Array.from(col.children).forEach(child => {
            if (child.classList.contains('event-item')) {
                col.removeChild(child);
            }
        });
    });
    
    // Add events to the grid
    timetableData.events.forEach(event => {
        addEventToGrid(event);
    });
}

// Add single event to the grid
function addEventToGrid(event) {
    // Find the correct day column by data-day attribute
    const dayColumn = document.querySelector(`#timetableGrid > div[data-day="${event.day}"]`);
    
    if (!dayColumn) {
        console.error(`Day column not found for day: ${event.day}`);
        return;
    }
    
    const startPos = timeToGridPosition(event.startTime);
    const endPos = timeToGridPosition(event.endTime);
    const height = endPos - startPos;
    
    // Create event element
    const eventElement = document.createElement('div');
    eventElement.className = 'absolute w-11/12 left-1/2 transform -translate-x-1/2 rounded-md p-2 overflow-hidden event-item shadow-sm';
    eventElement.style.top = `${startPos}px`;
    eventElement.style.height = `${height}px`;
    eventElement.style.backgroundColor = event.color;
    eventElement.style.color = getContrastColor(event.color);
    eventElement.style.zIndex = '5';
    eventElement.dataset.eventId = event.id;
    
    // Event content
    const titleElement = document.createElement('div');
    titleElement.className = 'font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis';
    titleElement.textContent = event.title;
    
    const timeElement = document.createElement('div');
    timeElement.className = 'text-xs opacity-90';
    timeElement.textContent = `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
    
    eventElement.appendChild(titleElement);
    eventElement.appendChild(timeElement);
    
    if (height > 60 && event.location) {
        const locationElement = document.createElement('div');
        locationElement.className = 'text-xs opacity-80 mt-1';
        locationElement.textContent = event.location;
        eventElement.appendChild(locationElement);
    }
    
    // Add click event to edit
    eventElement.addEventListener('click', function() {
        openEditEventEditor(event.id);
    });
    
    // Add to the grid
    dayColumn.appendChild(eventElement);
}

// Format time for display (09:00 -> 9:00 AM)
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

// Calculate contrast color (black or white) based on background
function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Update JSON preview
function updateJsonPreview() {
    const jsonPreview = document.getElementById('jsonPreview');
    jsonPreview.textContent = JSON.stringify(timetableData, null, 2);
}

// Copy JSON to clipboard
function copyJsonToClipboard() {
    const jsonText = JSON.stringify(timetableData, null, 2);
    navigator.clipboard.writeText(jsonText).then(() => {
        showToast();
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Show toast message
function showToast() {
    const toast = document.getElementById('toastMessage');
    toast.classList.remove('translate-y-10', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 3000);
}

// Export timetable data
function exportTimetable() {
    const jsonData = JSON.stringify(timetableData, null, 2);
    
    // Create a textarea element to display the JSON
    const textArea = document.createElement('textarea');
    textArea.value = jsonData;
    textArea.style.width = '100%';
    textArea.style.height = '300px';
    textArea.readOnly = true;
    
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-11/12 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto';
    
    // Create modal header
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-gray-800 dark:text-white';
    title.textContent = 'Export Timetable Data';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
    closeBtn.onclick = function() {
        document.body.removeChild(backdrop);
    };
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // Create text container
    const textContainer = document.createElement('div');
    textContainer.className = 'bg-gray-100 dark:bg-gray-700 rounded-md p-4 mb-4';
    textContainer.appendChild(textArea);
    
    // Create instructions
    const instructions = document.createElement('div');
    instructions.className = 'text-sm text-gray-600 dark:text-gray-400 mb-4';
    instructions.innerHTML = '<p>1. Select all text (Ctrl+A or Cmd+A)<br>2. Copy to clipboard (Ctrl+C or Cmd+C)<br>3. Paste into a new file with a .json extension</p>';
    
    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-end space-x-2';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'px-4 py-2 bg-primary hover:bg-opacity-90 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200';
    copyBtn.textContent = 'Copy to Clipboard';
    copyBtn.onclick = function() {
        textArea.select();
        document.execCommand('copy');
        showToast();
    };
    
    const closeBtn2 = document.createElement('button');
    closeBtn2.className = 'px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200';
    closeBtn2.textContent = 'Close';
    closeBtn2.onclick = function() {
        document.body.removeChild(backdrop);
    };
    
    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(closeBtn2);
    
    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(textContainer);
    modal.appendChild(instructions);
    modal.appendChild(buttonContainer);
    
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    // Select all text
    textArea.select();
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data && data.events) {
                timetableData = data;
                renderTimetable();
                updateJsonPreview();
                
                // Show success message
                const uploadStatus = document.getElementById('uploadStatus');
                uploadStatus.innerHTML = '<span class="text-green-600 dark:text-green-400">File uploaded successfully!</span>';
                uploadStatus.classList.remove('hidden');
                
                // Hide the message after a few seconds
                setTimeout(() => {
                    uploadStatus.classList.add('hidden');
                }, 3000);
            } else {
                throw new Error('Invalid JSON structure. The file must contain an "events" array.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            
            // Show error message
            const uploadStatus = document.getElementById('uploadStatus');
            uploadStatus.innerHTML = `<span class="text-red-600 dark:text-red-400">Error: ${error.message}</span>`;
            uploadStatus.classList.remove('hidden');
        }
    };
    
    reader.readAsText(file);
}

// Load sample data
function loadSampleData() {
    timetableData = {
        events: [
            {
                id: 'event_1',
                title: 'Math Class',
                day: 'Monday',
                startTime: '09:00',
                endTime: '10:30',
                location: 'Room 101',
                description: 'Algebra fundamentals',
                color: '#4299E1'
            },
            {
                id: 'event_2',
                title: 'History Lecture',
                day: 'Monday',
                startTime: '13:00',
                endTime: '14:30',
                location: 'Main Hall',
                description: 'World War II',
                color: '#ED8936'
            },
            {
                id: 'event_3',
                title: 'Science Lab',
                day: 'Tuesday',
                startTime: '11:00',
                endTime: '12:30',
                location: 'Lab 3',
                description: 'Chemistry experiments',
                color: '#48BB78'
            },
            {
                id: 'event_4',
                title: 'English Literature',
                day: 'Wednesday',
                startTime: '09:00',
                endTime: '10:30',
                location: 'Room 205',
                description: 'Shakespeare analysis',
                color: '#9F7AEA'
            },
            {
                id: 'event_5',
                title: 'Lunch Break',
                day: 'Friday',
                startTime: '12:00',
                endTime: '13:00',
                location: 'Cafeteria',
                description: '',
                color: '#F56565'
            }
        ]
    };
    
    renderTimetable();
    updateJsonPreview();
    
    // Show success message
    const uploadStatus = document.getElementById('uploadStatus');
    uploadStatus.innerHTML = '<span class="text-green-600 dark:text-green-400">Sample data loaded!</span>';
    uploadStatus.classList.remove('hidden');
    
    // Hide the message after a few seconds
    setTimeout(() => {
        uploadStatus.classList.add('hidden');
    }, 3000);
}
