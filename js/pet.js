/**
 * ASCII Pet Generator and Collection Manager
 * Creates unique text-pattern pets using various characters
 * Random generation with credits system
 */

// Use window properties to prevent redeclaration errors
window.AsciiPetApp = window.AsciiPetApp || (function() {
    // Private variables
    let currentPet = null;
    let petCollection = [];
    let generateCredits = 5; // Default starting credits

    // Constants for pet generation
    const PET_TYPES = ['cat', 'dog', 'rabbit', 'bird', 'fish', 'alien'];
    const CHAR_SETS = {
        basic: ['/', '\\', '|', '-', '_', '.', ',', ':', ';', '(', ')', '[', ']', '{', '}', '<', '>', '*', '+', '='],
        numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        symbols: ['!', '@', '#', '$', '%', '^', '&', '*', '?', '~', '`', '"', "'"],
        emoji: ['♥', '♦', '♣', '♠', '•', '◘', '○', '♪', '☺', '☻', '♂', '♀', '☼', '►', '◄', '▲', '▼'],
        mixed: [] // Will be populated with all characters
    };

    // Color themes
    const COLOR_THEMES = {
        blue: ['#1E40AF', '#3B82F6', '#93C5FD', '#DBEAFE'],
        green: ['#065F46', '#10B981', '#6EE7B7', '#D1FAE5'],
        purple: ['#7E22CE', '#A855F7', '#D8B4FE', '#F3E8FF'],
        orange: ['#C2410C', '#F97316', '#FDBA74', '#FFF7ED'],
        pink: ['#BE185D', '#EC4899', '#F9A8D4', '#FCE7F3'],
        monochrome: ['#111827', '#4B5563', '#9CA3AF', '#F3F4F6']
    };

    // Initialize the application
    function initialize() {
        console.log('Initializing ASCII Pet Generator...');
        
        // Populate mixed character set
        CHAR_SETS.mixed = [
            ...CHAR_SETS.basic,
            ...CHAR_SETS.numbers,
            ...CHAR_SETS.symbols
        ];
        
        // Set up dark mode
        setupDarkMode();
        
        // Load saved data
        loadCollection();
        loadCredits();
        
        // Set up event listeners
        const generateBtn = document.getElementById('generateBtn');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', generateRandomPet);
            console.log('Generate button listener set up');
        } else {
            console.error('Generate button not found!');
        }
        
        // Update UI
        updateCollectionDisplay();
        updateCreditsDisplay();
    }

    /**
     * Set up dark mode detection
     */
    function setupDarkMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
    }

    /**
     * Generate a random pet
     */
    function generateRandomPet() {
        console.log('Generating random pet...');
        
        // Check if user has credits
        if (generateCredits <= 0) {
            console.log('No credits left!');
            document.getElementById('noCreditsMessage').classList.remove('hidden');
            return;
        }
        
        // Hide no credits message if visible
        document.getElementById('noCreditsMessage').classList.add('hidden');
        
        // Generate all settings randomly
        const type = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)];
        const size = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        const complexity = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        const charSetKeys = Object.keys(CHAR_SETS);
        const charSetType = charSetKeys[Math.floor(Math.random() * charSetKeys.length)];
        const colorThemeKeys = Object.keys(COLOR_THEMES);
        const colorTheme = colorThemeKeys[Math.floor(Math.random() * colorThemeKeys.length)];
        
        console.log('Random settings:', { type, size, complexity, charSetType, colorTheme });
        
        // Generate pet pattern
        const petPattern = createAsciiPet(type, size, complexity, charSetType);
        
        // Save current pet
        currentPet = {
            type,
            pattern: petPattern,
            size,
            complexity,
            charSet: charSetType,
            colorTheme
        };
        
        // Display the pet
        displayGeneratedPet(petPattern, colorTheme);
        
        // Automatically add to collection
        saveToCollection();
        
        // Reduce credits
        generateCredits--;
        saveCredits();
        updateCreditsDisplay();
    }

    /**
     * Update the credits display
     */
    function updateCreditsDisplay() {
        const creditsCount = document.getElementById('creditsCount');
        if (creditsCount) {
            creditsCount.textContent = generateCredits;
        }
        
        // Update generate button state
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            if (generateCredits <= 0) {
                generateBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    /**
     * Display the generated pet in the UI
     * @param {string} petPattern - The ASCII pet pattern
     * @param {string} colorTheme - The color theme to use
     */
    function displayGeneratedPet(petPattern, colorTheme) {
        const petContainer = document.getElementById('generatedPet');
        const emptyState = document.getElementById('emptyState');
        const asciiPetElement = document.getElementById('asciiPetDisplay');
        
        if (!petContainer || !emptyState || !asciiPetElement) {
            console.error('Display elements not found!', {
                petContainer: !!petContainer,
                emptyState: !!emptyState,
                asciiPetElement: !!asciiPetElement
            });
            return;
        }
        
        // Hide empty state and show pet
        emptyState.classList.add('hidden');
        petContainer.classList.remove('hidden');
        
        // Apply color styling to the pattern
        const styledPattern = applyColorToPattern(petPattern, colorTheme);
        
        // Set the pet pattern
        asciiPetElement.innerHTML = styledPattern;
        
        // Animation
        asciiPetElement.classList.remove('pet-generate');
        void asciiPetElement.offsetWidth; // Trigger reflow
        asciiPetElement.classList.add('pet-generate');
    }

    /**
     * Apply color styling to the pet pattern
     * @param {string} pattern - The ASCII pet pattern
     * @param {string} theme - The color theme to use
     * @returns {string} HTML with color styling
     */
    function applyColorToPattern(pattern, theme) {
        const colors = COLOR_THEMES[theme];
        if (!colors) {
            console.error('Theme not found:', theme);
            return pattern; // Return unstyled pattern if theme not found
        }
        
        const lines = pattern.split('\n');
        let result = '';
        
        lines.forEach(line => {
            let coloredLine = '';
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char.trim() === '') {
                    coloredLine += char;
                } else {
                    // Pick a color from the theme based on character code
                    const colorIndex = char.charCodeAt(0) % colors.length;
                    const color = colors[colorIndex];
                    coloredLine += `<span style="color:${color}">${char}</span>`;
                }
            }
            result += coloredLine + '\n';
        });
        
        return result;
    }
    
    /**
     * Save current pet to collection
     */
    function saveToCollection() {
        if (!currentPet) {
            console.error('No pet to save!');
            return;
        }
        
        // Get the name
        const nameInput = document.getElementById('petName');
        if (!nameInput) {
            console.error('Name input not found!');
            return;
        }
        
        const name = nameInput.value.trim() || `Pet #${petCollection.length + 1}`;
        
        // Create pet entry
        const pet = {
            id: Date.now(), // Unique ID using timestamp
            name,
            ...currentPet,
            adopted: new Date().toISOString()
        };
        
        // Add to collection
        petCollection.push(pet);
        
        // Update UI
        updateCollectionDisplay();
        
        // Save collection
        saveCollection();
        
        // Reset name input
        nameInput.value = '';
        
        console.log('Pet saved to collection:', pet.name);
    }

    /**
     * Update the collection display
     */
    function updateCollectionDisplay() {
        const collectionGrid = document.getElementById('petCollection');
        const emptyCollection = document.getElementById('emptyCollection');
        const collectionCount = document.getElementById('collectionCount');
        
        if (!collectionGrid || !emptyCollection || !collectionCount) {
            console.error('Collection elements not found!');
            return;
        }
        
        // Update count
        collectionCount.textContent = petCollection.length;
        
        // Show empty state if needed
        if (petCollection.length === 0) {
            emptyCollection.classList.remove('hidden');
            collectionGrid.classList.add('hidden');
            return;
        }
        
        // Hide empty state and show collection
        emptyCollection.classList.add('hidden');
        collectionGrid.classList.remove('hidden');
        
        // Clear current collection display
        collectionGrid.innerHTML = '';
        
        // Add each pet to the grid (newest first)
        const sortedPets = [...petCollection].sort((a, b) => 
            new Date(b.adopted) - new Date(a.adopted)
        );
        
        sortedPets.forEach(pet => {
            const petCard = createPetCard(pet);
            collectionGrid.appendChild(petCard);
        });
    }

    /**
     * Create a pet card for the collection
     * @param {Object} pet - The pet object
     * @returns {HTMLElement} The pet card element
     */
    function createPetCard(pet) {
        const card = document.createElement('div');
        card.className = 'collection-item bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700';
        
        // Create pet display
        const styledPattern = applyColorToPattern(pet.pattern, pet.colorTheme);
        
        // Format adoption date
        const adoptedDate = new Date(pet.adopted);
        const formattedDate = adoptedDate.toLocaleDateString();
        
        // Create card content
        card.innerHTML = `
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium text-gray-800 dark:text-white">${pet.name}</h3>
                    <span class="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">${capitalizeFirstLetter(pet.type)}</span>
                </div>
                <div class="bg-gray-100 dark:bg-gray-700 rounded p-3 mb-3 overflow-auto max-h-[150px] font-mono text-sm ascii-pet">
                    ${styledPattern}
                </div>
                <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>Generated: ${formattedDate}</span>
                    <button class="delete-pet-btn text-red-500 hover:text-red-700" data-pet-id="${pet.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Add delete event listener
        const deleteBtn = card.querySelector('.delete-pet-btn');
        deleteBtn.addEventListener('click', () => deletePet(pet.id));
        
        return card;
    }

    /**
     * Delete a pet from the collection
     * @param {number} petId - The ID of the pet to delete
     */
    function deletePet(petId) {
        if (confirm('Are you sure you want to remove this pet from your collection?')) {
            // Remove from array
            petCollection = petCollection.filter(pet => pet.id !== petId);
            
            // Update UI
            updateCollectionDisplay();
            
            // Save changes
            saveCollection();
        }
    }

    /**
     * Save the collection to localStorage
     */
    function saveCollection() {
        try {
            localStorage.setItem('asciiPetCollection', JSON.stringify(petCollection));
            console.log('Collection saved, size:', petCollection.length);
        } catch (e) {
            console.error('Error saving collection:', e);
        }
    }

    /**
     * Load the collection from localStorage
     */
    function loadCollection() {
        try {
            const saved = localStorage.getItem('asciiPetCollection');
            if (saved) {
                petCollection = JSON.parse(saved);
                console.log('Collection loaded, size:', petCollection.length);
            }
        } catch (e) {
            console.error('Error loading pet collection:', e);
            petCollection = [];
        }
    }
    
    /**
     * Save credits to localStorage
     */
    function saveCredits() {
        try {
            localStorage.setItem('asciiPetCredits', generateCredits.toString());
            console.log('Credits saved:', generateCredits);
        } catch (e) {
            console.error('Error saving credits:', e);
        }
    }
    
    /**
     * Load credits from localStorage
     */
    function loadCredits() {
        try {
            const saved = localStorage.getItem('asciiPetCredits');
            if (saved) {
                generateCredits = parseInt(saved, 10);
                console.log('Credits loaded:', generateCredits);
            }
        } catch (e) {
            console.error('Error loading credits:', e);
            generateCredits = 5; // Default
        }
    }

    /**
     * Create an ASCII pet pattern
     * @param {string} type - Type of pet to create
     * @param {number} size - Size factor (1-3)
     * @param {number} complexity - Complexity factor (1-3)
     * @param {string} charSetType - Character set to use
     * @returns {string} ASCII pet pattern
     */
    function createAsciiPet(type, size, complexity, charSetType) {
        // Get the character set
        const chars = CHAR_SETS[charSetType] || CHAR_SETS.mixed;
        
        // Choose generation function based on type
        switch (type) {
            case 'cat':
                return generateCat(size, complexity, chars);
            case 'dog':
                return generateDog(size, complexity, chars);
            case 'rabbit':
                return generateRabbit(size, complexity, chars);
            case 'bird':
                return generateBird(size, complexity, chars);
            case 'fish':
                return generateFish(size, complexity, chars);
            case 'alien':
                return generateAlien(size, complexity, chars);
            default:
                return generateRandomCreature(size, complexity, chars);
        }
    }

    /**
     * Generate a cat ASCII pattern
     */
    function generateCat(size, complexity, chars) {
        const width = 10 + (size * 5);
        const height = 4 + (size * 3);
        
        let result = '';
        
        // Basic cat shape
        const earLeft = randomChar(chars);
        const earRight = randomChar(chars);
        const eye = randomChar(chars);
        const nose = randomChar(chars);
        const mouth = randomChar(chars);
        const whisker = randomChar(chars);
        const body = randomChar(chars);
        
        // Head
        result += ' '.repeat(Math.floor(width/4)) + earLeft + ' '.repeat(Math.floor(width/2) - 2) + earRight + '\n';
        result += ' '.repeat(Math.floor(width/4) - 1) + earLeft + earLeft + ' '.repeat(Math.floor(width/2) - 2) + earRight + earRight + '\n';
        
        // Face
        result += ' '.repeat(Math.floor(width/4) - 2) + '/' + ' '.repeat(Math.floor(width/2)) + '\\' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 2) + '|' + ' ' + eye + ' '.repeat(Math.floor(width/4) - 2) + eye + ' ' + '|' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 2) + '|' + ' '.repeat(Math.floor(width/4) - 1) + nose + ' '.repeat(Math.floor(width/4) - 1) + '|' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 2) + '\\' + ' '.repeat(Math.floor(width/4) - 1) + mouth + ' '.repeat(Math.floor(width/4) - 1) + '/' + '\n';
        
        // Add whiskers if complexity > 1
        if (complexity > 1) {
            result += ' '.repeat(Math.floor(width/4) - 3) + whisker + whisker + whisker + ' '.repeat(Math.floor(width/4)) + whisker + whisker + whisker + '\n';
        }
        
        // Body
        const bodyWidth = Math.floor(width/2);
        const bodyHeight = Math.floor(height/2);
        
        for (let i = 0; i < bodyHeight; i++) {
            let line = ' '.repeat(Math.floor(width/4) - 1);
            line += body.repeat(bodyWidth);
            result += line + '\n';
        }
        
        // Tail if complexity > 1
        if (complexity > 1) {
            const tailChar = randomChar(chars);
            result += ' '.repeat(Math.floor(width/4) - 1 + bodyWidth - 3) + tailChar.repeat(3) + '\n';
            result += ' '.repeat(Math.floor(width/4) - 1 + bodyWidth - 1) + tailChar.repeat(2) + '\n';
        }
        
        return result;
    }

    // [All the other pet generation functions from before remain the same]
    // generateDog, generateRabbit, generateBird, generateFish, generateAlien, generateRandomCreature
    
    function generateDog(size, complexity, chars) {
        const width = 12 + (size * 5);
        const height = 5 + (size * 3);
        
        let result = '';
        
        // Basic dog shape
        const ear = randomChar(chars);
        const eye = randomChar(chars);
        const nose = randomChar(chars);
        const mouth = randomChar(chars);
        const body = randomChar(chars);
        const leg = randomChar(chars);
        
        // Head with ears
        result += ' '.repeat(Math.floor(width/4)) + ear.repeat(2) + ' '.repeat(Math.floor(width/4)) + ear.repeat(2) + '\n';
        
        // Face
        result += ' '.repeat(Math.floor(width/4) - 2) + '/' + '-'.repeat(Math.floor(width/4)) + '\\' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 2) + '|' + ' ' + eye + ' '.repeat(Math.floor(width/4) - 2) + eye + ' ' + '|' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 2) + '|' + ' '.repeat(Math.floor(width/4) - 1) + nose + nose + ' '.repeat(Math.floor(width/4) - 2) + '|' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 2) + '\\' + '_'.repeat(Math.floor(width/4) - 2) + mouth + mouth + '_'.repeat(Math.floor(width/4) - 2) + '/' + '\n';
        
        // Body
        const bodyWidth = Math.floor(width/2) + 2;
        const bodyHeight = Math.floor(height/2);
        
        for (let i = 0; i < bodyHeight; i++) {
            let line = ' '.repeat(Math.floor(width/5));
            line += body.repeat(bodyWidth);
            result += line + '\n';
        }
        
        // Legs
        if (complexity > 1) {
            result += ' '.repeat(Math.floor(width/5)) + leg + leg + ' '.repeat(bodyWidth - 4) + leg + leg + '\n';
        }
        
        // Tail if complexity > 2
        if (complexity > 2) {
            const tailChar = randomChar(chars);
            result += ' '.repeat(Math.floor(width/5) + bodyWidth) + tailChar.repeat(3) + '\n';
        }
        
        return result;
    }
    
    function generateRabbit(size, complexity, chars) {
        const width = 10 + (size * 4);
        const height = 6 + (size * 2);
        
        let result = '';
        
        // Basic rabbit shape
        const ear = randomChar(chars);
        const eye = randomChar(chars);
        const nose = randomChar(chars);
        const mouth = randomChar(chars);
        const body = randomChar(chars);
        
        // Ears
        result += ' '.repeat(Math.floor(width/4)) + ear + ' '.repeat(Math.floor(width/6)) + ear + '\n';
        result += ' '.repeat(Math.floor(width/4)) + ear + ear + ' '.repeat(Math.floor(width/6) - 2) + ear + ear + '\n';
        result += ' '.repeat(Math.floor(width/4)) + ear + ear + ' '.repeat(Math.floor(width/6) - 2) + ear + ear + '\n';
        
        // Head
        result += ' '.repeat(Math.floor(width/4) - 1) + '/' + '-'.repeat(Math.floor(width/4)) + '\\' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 1) + '|' + ' ' + eye + ' '.repeat(Math.floor(width/6)) + eye + ' ' + '|' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 1) + '|' + ' '.repeat(Math.floor(width/6) + 1) + nose + ' '.repeat(Math.floor(width/6)) + '|' + '\n';
        result += ' '.repeat(Math.floor(width/4) - 1) + '\\' + ' '.repeat(Math.floor(width/6)) + mouth + ' '.repeat(Math.floor(width/6)) + '/' + '\n';
        
        // Body
        const bodyWidth = Math.floor(width/2);
        const bodyHeight = Math.floor(height/2);
        
        for (let i = 0; i < bodyHeight; i++) {
            let line = ' '.repeat(Math.floor(width/5));
            line += body.repeat(bodyWidth);
            result += line + '\n';
        }
        
        // Feet if complexity > 1
        if (complexity > 1) {
            const foot = randomChar(chars);
            result += ' '.repeat(Math.floor(width/5)) + foot + foot + ' '.repeat(bodyWidth - 4) + foot + foot + '\n';
        }
        
        return result;
    }
    
    function generateBird(size, complexity, chars) {
        const width = 12 + (size * 4);
        const height = 5 + (size * 2);
        
        let result = '';
        
        // Basic bird shape
        const head = randomChar(chars);
        const beak = randomChar(chars);
        const eye = randomChar(chars);
        const wing = randomChar(chars);
        const body = randomChar(chars);
        const tail = randomChar(chars);
        
        // Head and beak
        result += ' '.repeat(Math.floor(width/4)) + head.repeat(3) + '\n';
        result += ' '.repeat(Math.floor(width/4) - 1) + head.repeat(4) + beak + '\n';
        result += ' '.repeat(Math.floor(width/4) - 1) + head + eye + head.repeat(2) + beak + beak + '\n';
        result += ' '.repeat(Math.floor(width/4)) + head.repeat(3) + '\n';
        
        // Body with wings
        const bodyWidth = Math.floor(width/3);
        
        for (let i = 0; i < height - 4; i++) {
            let line = ' '.repeat(Math.floor(width/5));
            
            // Add wings based on complexity
            if (complexity > 1 && i === 1) {
                line += wing.repeat(bodyWidth + 2);
            } else {
                line += body.repeat(bodyWidth);
            }
            
            result += line + '\n';
        }
        
        // Tail if complexity > 2
        if (complexity > 2) {
            result += ' '.repeat(Math.floor(width/5) + bodyWidth - 1) + tail.repeat(3) + '\n';
        }
        
        return result;
    }
    
    function generateFish(size, complexity, chars) {
        const width = 15 + (size * 5);
        const height = 6 + (size * 2);
        
        let result = '';
        
        // Basic fish shape
        const body = randomChar(chars);
        const eye = randomChar(chars);
        const fin = randomChar(chars);
        const tail = randomChar(chars);
        const bubble = randomChar(chars);
        
        // Top fin if complexity > 1
        if (complexity > 1) {
            result += ' '.repeat(Math.floor(width/3)) + fin.repeat(3) + '\n';
            result += ' '.repeat(Math.floor(width/3) - 1) + fin.repeat(4) + '\n';
        }
        
        // Body with eye
        const bodyWidth = Math.floor(width/2);
        const bodyHeight = Math.floor(height/2);
        
        // First line with eye
        result += ' '.repeat(Math.floor(width/4)) + body.repeat(Math.floor(bodyWidth/3)) + eye + body.repeat(bodyWidth - Math.floor(bodyWidth/3) - 1) + '\n';
        
        // Rest of the body
        for (let i = 1; i < bodyHeight; i++) {
            let line = ' '.repeat(Math.floor(width/4));
            line += body.repeat(bodyWidth);
            result += line + '\n';
        }
        
        // Bottom fin if complexity > 1
        if (complexity > 1) {
            result += ' '.repeat(Math.floor(width/3)) + fin.repeat(4) + '\n';
            result += ' '.repeat(Math.floor(width/3) + 1) + fin.repeat(3) + '\n';
        }
        
        // Tail
        result += ' '.repeat(Math.floor(width/4) + bodyWidth) + tail.repeat(3) + '\n';
        
        // Bubbles if complexity > 2
        if (complexity > 2) {
            result += bubble + ' ' + bubble + bubble + ' '.repeat(Math.floor(width/4) - 5) + '\n';
        }
        
        return result;
    }
    
    function generateAlien(size, complexity, chars) {
        const width = 12 + (size * 6);
        const height = 8 + (size * 3);
        
        let result = '';
        
        // Basic alien shape
        const head = randomChar(chars);
        const eye = randomChar(chars);
        const antenna = randomChar(chars);
        const body = randomChar(chars);
        const limb = randomChar(chars);
        
        // Antennas if complexity > 1
        if (complexity > 1) {
            result += ' '.repeat(Math.floor(width/4)) + antenna + ' '.repeat(Math.floor(width/6)) + antenna + '\n';
            result += ' '.repeat(Math.floor(width/4) - 1) + antenna + antenna + ' '.repeat(Math.floor(width/6) - 2) + antenna + antenna + '\n';
        }
        
        // Head
        const headWidth = Math.floor(width/3);
        result += ' '.repeat(Math.floor(width/4) - 2) + '//' + head.repeat(headWidth) + '\\\\' + '\n';
        
        // Eyes - multiple if complexity is higher
        if (complexity === 3) {
            result += ' '.repeat(Math.floor(width/4) - 2) + '||' + ' ' + eye + ' ' + eye + ' ' + eye + ' '.repeat(headWidth - 7) + '||' + '\n';
        } else if (complexity === 2) {
            result += ' '.repeat(Math.floor(width/4) - 2) + '||' + ' ' + eye + ' '.repeat(2) + eye + ' '.repeat(headWidth - 5) + '||' + '\n';
        } else {
            result += ' '.repeat(Math.floor(width/4) - 2) + '||' + ' '.repeat(Math.floor(headWidth/2) - 1) + eye + ' '.repeat(Math.floor(headWidth/2)) + '||' + '\n';
        }
        
        // Finish head
        result += ' '.repeat(Math.floor(width/4) - 2) + '\\\\' + '_'.repeat(headWidth) + '//' + '\n';
        
        // Body
        const bodyWidth = Math.floor(width/2);
        const bodyHeight = Math.floor(height/2);
        
        for (let i = 0; i < bodyHeight; i++) {
            // Add limbs on some lines based on complexity
            if ((complexity > 1 && i === 1) || (complexity > 2 && i === 3)) {
                result += ' '.repeat(Math.floor(width/5) - 2) + limb + limb + body.repeat(bodyWidth) + limb + limb + '\n';
            } else {
                result += ' '.repeat(Math.floor(width/5)) + body.repeat(bodyWidth) + '\n';
            }
        }
        
        // Feet/tentacles
        if (complexity > 1) {
            const foot = randomChar(chars);
            result += ' '.repeat(Math.floor(width/5)) + foot + foot + ' '.repeat(bodyWidth - 4) + foot + foot + '\n';
            
            if (complexity > 2) {
                result += ' '.repeat(Math.floor(width/5) + 1) + foot + ' '.repeat(bodyWidth - 3) + foot + '\n';
            }
        }
        
        return result;
    }
    
    function generateRandomCreature(size, complexity, chars) {
        const width = 10 + (size * 6);
        const height = 6 + (size * 3);
        
        let result = '';
        const numLines = height;
        
        // Generate completely random pattern
        for (let i = 0; i < numLines; i++) {
            let line = '';
            const lineLength = Math.floor(Math.random() * width) + 5;
            
            for (let j = 0; j < width; j++) {
                // Higher probability of space to form actual patterns
                if (Math.random() < 0.7) {
                    line += ' ';
                } else {
                    line += randomChar(chars);
                }
            }
            
            result += line + '\n';
        }
        
        return result;
    }

    /**
     * Get a random character from the character set
     * @param {Array} chars - Array of characters to choose from
     * @returns {string} A random character
     */
    function randomChar(chars) {
        return chars[Math.floor(Math.random() * chars.length)];
    }

    /**
     * Capitalize the first letter of a string
     * @param {string} text - Input text
     * @returns {string} Text with first letter capitalized
     */
    function capitalizeFirstLetter(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    /**
     * Add credits (would be called from shop)
     * @param {number} amount - Number of credits to add
     */
    function addCredits(amount) {
        generateCredits += amount;
        saveCredits();
        updateCreditsDisplay();
        
        return generateCredits;
    }

    // Expose public methods
    return {
        initialize: initialize,
        generatePet: generateRandomPet,
        addCredits: addCredits
    };
})();

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing ASCII Pet Generator...');
    window.AsciiPetApp.initialize();
});