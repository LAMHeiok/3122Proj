/**
 * ASCII Pet Trading Center - Main JavaScript functionality
 * This file contains all the functionality for the pet trading system
 */

// Use an IIFE to create a module and avoid polluting the global namespace
const PetTrading = (function() {
    // Constants
    const CURRENT_USER = 'You';
    const CURRENT_USER_ID = 'user_001';
    
    // Global state
    let myPets = [];
    let marketPets = [];
    let trades = [];
    let activeSections = {
        mainSection: 'myCollection',
        tradeSection: 'incoming'
    };
    
    // Sample data for other users
    const otherUsers = [
        { id: 'user_002', name: 'PetLover42' },
        { id: 'user_003', name: 'AsciiArtist' },
        { id: 'user_004', name: 'CodeWizard' },
        { id: 'user_005', name: 'PixelMaster' }
    ];
    
    /**
     * Main initialization function - sets up all page elements
     */
    function init() {
        console.log('Initializing Pet Trading Center');
        
        // Set up dark mode
        setupDarkMode();
        
        // Load data
        loadMyPets();
        loadMarketPets();
        loadTrades();
        
        // Set up event listeners
        setupMainTabs();
        setupTradeTabs();
        setupModalEvents();
        setupFilterEvents();
        
        // Initialize UI
        updateMainSections();
        updateTradeSections();
        updateStats();
        populateUserFilterOptions();
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
     * Set up main navigation tabs
     */
    function setupMainTabs() {
        const tabs = {
            'myCollectionTab': 'myCollection',
            'tradeMarketTab': 'tradeMarket',
            'myTradesTab': 'myTrades'
        };
        
        Object.entries(tabs).forEach(([tabId, sectionName]) => {
            document.getElementById(tabId).addEventListener('click', function() {
                activeSections.mainSection = sectionName;
                updateMainSections();
            });
        });
    }
    
    /**
     * Set up trade section tabs
     */
    function setupTradeTabs() {
        const tabs = {
            'incomingTradesTab': 'incoming',
            'outgoingTradesTab': 'outgoing',
            'completedTradesTab': 'completed'
        };
        
        Object.entries(tabs).forEach(([tabId, sectionName]) => {
            document.getElementById(tabId).addEventListener('click', function() {
                activeSections.tradeSection = sectionName;
                updateTradeSections();
            });
        });
    }
    
    /**
     * Set up event listeners for modals
     */
    function setupModalEvents() {
        // Pet detail modal
        document.getElementById('closePetModalBtn').addEventListener('click', function() {
            document.getElementById('petDetailModal').classList.add('hidden');
        });
        
        // Trade offer modal
        document.getElementById('closeTradeModalBtn').addEventListener('click', function() {
            document.getElementById('tradeOfferModal').classList.add('hidden');
        });
        
        document.getElementById('cancelTradeBtn').addEventListener('click', function() {
            document.getElementById('tradeOfferModal').classList.add('hidden');
        });
        
        document.getElementById('submitTradeBtn').addEventListener('click', function() {
            submitTradeOffer();
        });
        
        document.getElementById('yourPetSelect').addEventListener('change', function() {
            updateTradeOfferPreview();
        });
        
        // Trade confirmation modal
        document.getElementById('closeConfirmModalBtn').addEventListener('click', function() {
            document.getElementById('tradeConfirmationModal').classList.add('hidden');
        });
        
        document.getElementById('cancelConfirmBtn').addEventListener('click', function() {
            document.getElementById('tradeConfirmationModal').classList.add('hidden');
        });
        
        document.getElementById('acceptTradeBtn').addEventListener('click', function() {
            confirmTrade('accept');
        });
        
        document.getElementById('rejectTradeBtn').addEventListener('click', function() {
            confirmTrade('reject');
        });
        
        // Market refresh button
        document.getElementById('refreshMarketBtn').addEventListener('click', function() {
            refreshMarket();
        });
    }
    
    /**
     * Set up filter event listeners
     */
    function setupFilterEvents() {
        document.getElementById('collectionFilterType').addEventListener('change', function() {
            renderMyPets();
        });
        
        document.getElementById('collectionFilterStatus').addEventListener('change', function() {
            renderMyPets();
        });
        
        document.getElementById('marketFilterType').addEventListener('change', function() {
            renderMarketPets();
        });
        
        document.getElementById('marketFilterUser').addEventListener('change', function() {
            renderMarketPets();
        });
    }
    
    /**
     * Update main section visibility based on active tab
     */
    function updateMainSections() {
        // Update tab styles
        document.querySelectorAll('#myCollectionTab, #tradeMarketTab, #myTradesTab')
            .forEach(tab => tab.classList.remove('active'));
        
        const activeTabId = {
            'myCollection': 'myCollectionTab',
            'tradeMarket': 'tradeMarketTab',
            'myTrades': 'myTradesTab'
        }[activeSections.mainSection];
        
        document.getElementById(activeTabId).classList.add('active');
        
        // Update section visibility
        document.querySelectorAll('#myCollectionSection, #tradeMarketSection, #myTradesSection')
            .forEach(section => section.classList.add('hidden'));
        
        const activeSectionId = {
            'myCollection': 'myCollectionSection',
            'tradeMarket': 'tradeMarketSection',
            'myTrades': 'myTradesSection'
        }[activeSections.mainSection];
        
        document.getElementById(activeSectionId).classList.remove('hidden');
    }
    
    /**
     * Update trade subsection visibility based on active tab
     */
    function updateTradeSections() {
        // Update tab styles
        document.querySelectorAll('#incomingTradesTab, #outgoingTradesTab, #completedTradesTab')
            .forEach(tab => tab.classList.remove('active'));
        
        const activeTabId = {
            'incoming': 'incomingTradesTab',
            'outgoing': 'outgoingTradesTab',
            'completed': 'completedTradesTab'
        }[activeSections.tradeSection];
        
        document.getElementById(activeTabId).classList.add('active');
        
        // Update section visibility
        document.querySelectorAll('#incomingTradesSection, #outgoingTradesSection, #completedTradesSection')
            .forEach(section => section.classList.add('hidden'));
        
        const activeSectionId = {
            'incoming': 'incomingTradesSection',
            'outgoing': 'outgoingTradesSection',
            'completed': 'completedTradesSection'
        }[activeSections.tradeSection];
        
        document.getElementById(activeSectionId).classList.remove('hidden');
    }
    
    /**
     * Load user's pets from localStorage
     */
    function loadMyPets() {
        try {
            // Get pets from ASCII Pet Generator's storage
            const saved = localStorage.getItem('asciiPetCollection');
            if (saved) {
                const importedPets = JSON.parse(saved);
                
                // Map to our format with trading status
                myPets = importedPets.map(pet => ({
                    ...pet,
                    ownerId: CURRENT_USER_ID,
                    owner: CURRENT_USER,
                    trading: false
                }));
                
                console.log(`Loaded ${myPets.length} pets from collection`);
                renderMyPets();
            } else {
                console.log('No saved pets found');
                myPets = [];
            }
        } catch (e) {
            console.error('Error loading pets:', e);
            myPets = [];
        }
    }
    
    /**
     * Load or generate market pets
     */
    function loadMarketPets() {
        try {
            // Try to load from localStorage first
            const saved = localStorage.getItem('asciiPetMarket');
            if (saved) {
                marketPets = JSON.parse(saved);
                console.log(`Loaded ${marketPets.length} market pets from storage`);
            } else {
                // Generate sample market pets
                marketPets = generateSampleMarketPets();
                saveMarketPets();
                console.log(`Generated ${marketPets.length} sample market pets`);
            }
            
            renderMarketPets();
        } catch (e) {
            console.error('Error loading market pets:', e);
            marketPets = [];
        }
    }
    
    /**
     * Load or initialize trade data
     */
    function loadTrades() {
        try {
            // Try to load from localStorage first
            const saved = localStorage.getItem('asciiPetTrades');
            if (saved) {
                trades = JSON.parse(saved);
                console.log(`Loaded ${trades.length} trades from storage`);
            } else {
                // Initialize empty trades array
                trades = [];
                saveTrades();
            }
            
            renderTrades();
            updateStats();
        } catch (e) {
            console.error('Error loading trades:', e);
            trades = [];
        }
    }
    
    /**
     * Save market pets to localStorage
     */
    function saveMarketPets() {
        try {
            localStorage.setItem('asciiPetMarket', JSON.stringify(marketPets));
        } catch (e) {
            console.error('Error saving market pets:', e);
        }
    }
    
    /**
     * Save trades to localStorage
     */
    function saveTrades() {
        try {
            localStorage.setItem('asciiPetTrades', JSON.stringify(trades));
        } catch (e) {
            console.error('Error saving trades:', e);
        }
    }
    
    /**
     * Generate sample market pets for other users
     */
    function generateSampleMarketPets() {
        const samplePets = [];
        const types = ['cat', 'dog', 'rabbit', 'bird', 'fish', 'alien'];
        const names = ['Pixel', 'Byte', 'Dot', 'Blinky', 'Glitch', 'Binary', 'Ascii', 'Vector', 'Bitmap', 'Cursor'];
        
        // Generate 1-3 pets for each user
        otherUsers.forEach(user => {
            const numPets = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < numPets; i++) {
                const type = types[Math.floor(Math.random() * types.length)];
                const name = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
                
                samplePets.push({
                    id: `pet_${user.id}_${i}`,
                    name: name,
                    type: type,
                    pattern: generateSimplePattern(type),
                    size: Math.floor(Math.random() * 3) + 1,
                    complexity: Math.floor(Math.random() * 3) + 1,
                    adopted: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
                    ownerId: user.id,
                    owner: user.name,
                    trading: true,
                    charSet: 'mixed'
                });
            }
        });
        
        return samplePets;
    }
    
    /**
     * Generate a simple ASCII pattern for sample pets
     */
    function generateSimplePattern(type) {
        let pattern = '';
        switch (type) {
            case 'cat':
                pattern = ' /\\_/\\ \n( o.o )\n > ^ < \n';
                break;
            case 'dog':
                pattern = '  /^\\___/^\\\n( >^.^< )\n  \\_____/  \n';
                break;
            case 'rabbit':
                pattern = ' /\\   /\\\n( o   o )\n(   \"   )\n(   -   )\n';
                break;
            case 'bird':
                pattern = '   /\\\n  /  \\\n |    >\n /____\\\n';
                break;
            case 'fish':
                pattern = '   ><)))°>\n';
                break;
            case 'alien':
                pattern = '  .--.\n /    \\\n| o  o |\n|  /\\  |\n \\____/\n';
                break;
            default:
                pattern = ' /^\\ \n|   |\n \\-/ \n';
        }
        return pattern;
    }
    
    /**
     * Populate the user filter dropdown
     */
    function populateUserFilterOptions() {
        const userSelect = document.getElementById('marketFilterUser');
        
        // Clear existing options (except 'All Users')
        while (userSelect.options.length > 1) {
            userSelect.remove(1);
        }
        
        // Get unique user IDs from market pets
        const uniqueUsers = [...new Set(marketPets.map(pet => pet.ownerId))];
        
        // Add option for each user
        uniqueUsers.forEach(userId => {
            const user = otherUsers.find(u => u.id === userId);
            if (user) {
                const option = document.createElement('option');
                option.value = userId;
                option.textContent = user.name;
                userSelect.appendChild(option);
            }
        });
    }
    
    /**
     * Render the user's pets in the collection
     */
    function renderMyPets() {
        const typeFilter = document.getElementById('collectionFilterType').value;
        const statusFilter = document.getElementById('collectionFilterStatus').value;
        
        // Apply filters
        let filteredPets = myPets;
        
        if (typeFilter !== 'all') {
            filteredPets = filteredPets.filter(pet => pet.type === typeFilter);
        }
        
        if (statusFilter === 'available') {
            filteredPets = filteredPets.filter(pet => !pet.trading);
        } else if (statusFilter === 'trading') {
            filteredPets = filteredPets.filter(pet => pet.trading);
        }
        
        // Update UI
        const emptyCollection = document.getElementById('emptyCollection');
        const myPetsGrid = document.getElementById('myPetsGrid');
        
        if (myPets.length === 0) {
            // No pets at all
            emptyCollection.classList.remove('hidden');
            myPetsGrid.classList.add('hidden');
            return;
        } else if (filteredPets.length === 0) {
            // Has pets but none match the filter
            emptyCollection.classList.remove('hidden');
            document.querySelector('#emptyCollection h3').textContent = 'No Pets Match Filters';
            document.querySelector('#emptyCollection p').textContent = 'Try changing your filter settings to see more pets.';
            myPetsGrid.classList.add('hidden');
            return;
        }
        
        // Show pets grid and hide empty state
        emptyCollection.classList.add('hidden');
        myPetsGrid.classList.remove('hidden');
        
        // Clear and rebuild grid
        myPetsGrid.innerHTML = '';
        
        // Add each pet
        filteredPets.forEach(pet => {
            const card = createPetCard(pet, 'collection');
            myPetsGrid.appendChild(card);
        });
        
        console.log(`Rendered ${filteredPets.length} of ${myPets.length} pets in collection`);
    }
    
    /**
     * Render pets available for trade in the market
     */
    function renderMarketPets() {
        const typeFilter = document.getElementById('marketFilterType').value;
        const userFilter = document.getElementById('marketFilterUser').value;
        
        // Apply filters
        let filteredPets = marketPets.filter(pet => pet.trading);
        
        if (typeFilter !== 'all') {
            filteredPets = filteredPets.filter(pet => pet.type === typeFilter);
        }
        
        if (userFilter !== 'all') {
            filteredPets = filteredPets.filter(pet => pet.ownerId === userFilter);
        }
        
        // Update UI
        const emptyMarket = document.getElementById('emptyMarket');
        const marketPetsGrid = document.getElementById('marketPetsGrid');
        
        if (marketPets.filter(pet => pet.trading).length === 0) {
            // No pets trading at all
            emptyMarket.classList.remove('hidden');
            marketPetsGrid.classList.add('hidden');
            return;
        } else if (filteredPets.length === 0) {
            // Has trading pets but none match the filter
            emptyMarket.classList.remove('hidden');
            document.querySelector('#emptyMarket h3').textContent = 'No Pets Match Filters';
            document.querySelector('#emptyMarket p').textContent = 'Try changing your filter settings to see more available pets.';
            marketPetsGrid.classList.add('hidden');
            return;
        }
        
        // Show pets grid and hide empty state
        emptyMarket.classList.add('hidden');
        marketPetsGrid.classList.remove('hidden');
        
        // Clear and rebuild grid
        marketPetsGrid.innerHTML = '';
        
        // Add each pet
        filteredPets.forEach(pet => {
            const card = createPetCard(pet, 'market');
            marketPetsGrid.appendChild(card);
        });
        
        console.log(`Rendered ${filteredPets.length} pets in market`);
    }
    
    /**
     * Render trades in the appropriate sections
     */
    function renderTrades() {
        // Split trades by type
        const incomingTrades = trades.filter(trade => 
            trade.status === 'pending' && trade.receiverId === CURRENT_USER_ID);
        
        const outgoingTrades = trades.filter(trade => 
            trade.status === 'pending' && trade.senderId === CURRENT_USER_ID);
        
        const completedTrades = trades.filter(trade => 
            trade.status === 'accepted' || trade.status === 'rejected');
        
        // Render each section
        renderTradeSection('incoming', incomingTrades);
        renderTradeSection('outgoing', outgoingTrades);
        renderTradeSection('completed', completedTrades);
        
        // Update badges
        updateTradeBadges(incomingTrades.length);
    }
    
    /**
     * Render a specific trade section
     */
    function renderTradeSection(section, tradesList) {
        const sectionElement = document.getElementById(`${section}TradesSection`);
        const emptyElement = document.getElementById(`empty${section.charAt(0).toUpperCase() + section.slice(1)}`);
        const listElement = document.getElementById(`${section}TradesList`);
        
        if (tradesList.length === 0) {
            // No trades in this section
            emptyElement.classList.remove('hidden');
            listElement.classList.add('hidden');
            return;
        }
        
        // Show trades and hide empty state
        emptyElement.classList.add('hidden');
        listElement.classList.remove('hidden');
        
        // Clear and rebuild list
        listElement.innerHTML = '';
        
        // Add each trade
        tradesList.forEach(trade => {
            const card = createTradeCard(trade, section);
            listElement.appendChild(card);
        });
    }
    
    /**
     * Create a pet card
     * @param {Object} pet - The pet data
     * @param {string} context - The context ('collection' or 'market')
     * @returns {HTMLElement} The pet card element
     */
    function createPetCard(pet, context) {
        const card = document.createElement('div');
        card.className = 'pet-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
        
        // Determine trading status badge and button
        let statusBadge = '';
        let actionButton = '';
        
        if (context === 'collection') {
            if (pet.trading) {
                statusBadge = `<span class="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium rounded-full">Trading</span>`;
                actionButton = `<button class="remove-trade-btn w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none transition-colors duration-200" data-pet-id="${pet.id}">
                    Remove from Trading
                </button>`;
            } else {
                actionButton = `<button class="add-trade-btn w-full py-2 bg-primary hover:bg-opacity-90 text-white font-medium rounded-md focus:outline-none transition-colors duration-200" data-pet-id="${pet.id}">
                    Put up for Trade
                </button>`;
            }
        } else if (context === 'market') {
            // Check if there's an outgoing trade for this pet
            const hasPendingOffer = trades.some(trade => 
                trade.status === 'pending' && 
                trade.senderId === CURRENT_USER_ID && 
                trade.receiverPetId === pet.id
            );
            
            if (hasPendingOffer) {
                actionButton = `<button class="w-full py-2 bg-yellow-500 cursor-not-allowed text-white font-medium rounded-md opacity-70" disabled>
                    Offer Pending
                </button>`;
            } else {
                actionButton = `<button class="offer-trade-btn w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none transition-colors duration-200" data-pet-id="${pet.id}" data-owner-id="${pet.ownerId}">
                    Offer Trade
                </button>`;
            }
        }
        
        // Create colored background based on pet type
        const bgColor = getPetTypeBgColor(pet.type);
        
        card.innerHTML = `
            <div class="relative">
                <div class="pt-2 pb-1 px-2 ${bgColor} flex justify-between items-center">
                    <h3 class="font-bold text-white">${pet.name}</h3>
                    <span class="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                        ${capitalizeFirstLetter(pet.type)}
                    </span>
                </div>
                ${statusBadge}
            </div>
            <div class="p-4">
                <div class="ascii-pet text-sm mb-4 overflow-auto max-h-[150px] min-h-[100px] flex items-center justify-center">
                    ${pet.pattern}
                </div>
                <div class="flex justify-between items-center mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Owner: ${pet.owner || 'You'}</span>
                    <span>Generated: ${formatDate(pet.adopted)}</span>
                </div>
                
                <div class="flex space-x-2">
                    <button class="view-pet-btn flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md focus:outline-none transition-colors duration-200" data-pet-id="${pet.id}">
                        View
                    </button>
                    ${actionButton}
                </div>
            </div>
        `;
        
        // Add event listeners
        const viewBtn = card.querySelector('.view-pet-btn');
        viewBtn.addEventListener('click', () => {
            openPetDetail(pet.id, context);
        });
        
        if (context === 'collection') {
            const tradeBtn = pet.trading 
                ? card.querySelector('.remove-trade-btn') 
                : card.querySelector('.add-trade-btn');
            
            tradeBtn.addEventListener('click', () => {
                togglePetTrading(pet.id);
            });
        } else if (context === 'market') {
            const offerBtn = card.querySelector('.offer-trade-btn');
            if (offerBtn) {
                offerBtn.addEventListener('click', () => {
                    openTradeOffer(pet.id, pet.ownerId);
                });
            }
        }
        
        return card;
    }
    
    /**
     * Create a trade card
     * @param {Object} trade - The trade data
     * @param {string} section - The section ('incoming', 'outgoing', or 'completed')
     * @returns {HTMLElement} The trade card element
     */
    function createTradeCard(trade, section) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
        
        // Find the pets involved in the trade
        const senderPet = findPetById(trade.senderPetId);
        const receiverPet = findPetById(trade.receiverPetId);
        
        if (!senderPet || !receiverPet) {
            console.error('Missing pet data for trade', trade);
            return card; // Return empty card if pet data is missing
        }
        
        let statusBadge = '';
        let actionButtons = '';
        
        // Determine status badge and actions based on trade status and section
        if (trade.status === 'pending') {
            statusBadge = `<span class="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full">Pending</span>`;
            
            if (section === 'incoming') {
                actionButtons = `
                    <div class="flex space-x-2">
                        <button class="accept-trade-btn flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none transition-colors duration-200" data-trade-id="${trade.id}">
                            Accept
                        </button>
                        <button class="reject-trade-btn flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md focus:outline-none transition-colors duration-200" data-trade-id="${trade.id}">
                            Reject
                        </button>
                    </div>
                `;
            } else if (section === 'outgoing') {
                actionButtons = `
                    <button class="cancel-trade-btn w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md focus:outline-none transition-colors duration-200" data-trade-id="${trade.id}">
                        Cancel Offer
                    </button>
                `;
            }
        } else if (trade.status === 'accepted') {
            statusBadge = `<span class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">Completed</span>`;
        } else if (trade.status === 'rejected') {
            statusBadge = `<span class="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">Rejected</span>`;
        } else if (trade.status === 'cancelled') {
            statusBadge = `<span class="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 text-xs font-medium rounded-full">Cancelled</span>`;
        }
        
        // Find user names
        const senderName = trade.senderId === CURRENT_USER_ID ? 'You' : (otherUsers.find(u => u.id === trade.senderId)?.name || 'Unknown');
        const receiverName = trade.receiverId === CURRENT_USER_ID ? 'You' : (otherUsers.find(u => u.id === trade.receiverId)?.name || 'Unknown');
        
        // Format trade date
        const tradeDate = formatDate(trade.createdAt);
        
        // Create card content
        card.innerHTML = `
            <div class="p-4">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-medium text-gray-800 dark:text-white">Trade Offer</h3>
                    ${statusBadge}
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <!-- Sender Pet -->
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs text-gray-500 dark:text-gray-400">From: ${senderName}</span>
                            <span class="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                ${capitalizeFirstLetter(senderPet.type)}
                            </span>
                        </div>
                        <h4 class="font-medium text-gray-800 dark:text-white mb-2">${senderPet.name}</h4>
                        <div class="ascii-pet text-xs mb-2 overflow-auto max-h-[100px] text-center">
                            ${senderPet.pattern}
                        </div>
                    </div>
                    
                    <!-- Receiver Pet -->
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs text-gray-500 dark:text-gray-400">To: ${receiverName}</span>
                            <span class="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                ${capitalizeFirstLetter(receiverPet.type)}
                            </span>
                        </div>
                        <h4 class="font-medium text-gray-800 dark:text-white mb-2">${receiverPet.name}</h4>
                        <div class="ascii-pet text-xs mb-2 overflow-auto max-h-[100px] text-center">
                            ${receiverPet.pattern}
                        </div>
                    </div>
                </div>
                
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Offer created: ${tradeDate}
                </div>
                
                ${actionButtons}
            </div>
        `;
        
        // Add event listeners
        if (section === 'incoming') {
            const acceptBtn = card.querySelector('.accept-trade-btn');
            const rejectBtn = card.querySelector('.reject-trade-btn');
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    openTradeConfirmation(trade.id, 'accept');
                });
            }
            
            if (rejectBtn) {
                rejectBtn.addEventListener('click', () => {
                    openTradeConfirmation(trade.id, 'reject');
                });
            }
        } else if (section === 'outgoing') {
            const cancelBtn = card.querySelector('.cancel-trade-btn');
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    cancelTradeOffer(trade.id);
                });
            }
        }
        
        return card;
    }
    
    /**
     * Find a pet by ID in either myPets or marketPets
     */
    function findPetById(petId) {
        // Check in myPets first
        let pet = myPets.find(p => p.id === petId);
        
        // If not found, check in marketPets
        if (!pet) {
            pet = marketPets.find(p => p.id === petId);
        }
        
        return pet;
    }
    
    /**
     * Open pet detail modal
     */
    function openPetDetail(petId, context) {
        // Find the pet
        const pet = findPetById(petId);
        if (!pet) {
            console.error('Pet not found:', petId);
            return;
        }
        
        // Set modal content
        document.getElementById('petModalName').textContent = pet.name;
        document.getElementById('petModalType').textContent = capitalizeFirstLetter(pet.type);
        document.getElementById('petModalOwner').textContent = pet.owner || 'You';
        document.getElementById('petModalAscii').textContent = pet.pattern;
        document.getElementById('petModalDate').textContent = formatDate(pet.adopted);
        document.getElementById('petModalId').value = petId;
        document.getElementById('petModalActionType').value = context;
        
        // Update pet type icon
        updatePetTypeIcon(pet.type);
        
        // Set appropriate action buttons
        const actionsContainer = document.getElementById('petModalActions');
        actionsContainer.innerHTML = '';
        
        if (context === 'collection') {
            // My pet options
            if (pet.trading) {
                actionsContainer.innerHTML = `
                    <button id="petModalRemoveTrade" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none transition-colors duration-200">
                        Remove from Trading
                    </button>
                `;
                
                document.getElementById('petModalRemoveTrade').addEventListener('click', function() {
                    togglePetTrading(petId);
                    document.getElementById('petDetailModal').classList.add('hidden');
                });
            } else {
                actionsContainer.innerHTML = `
                    <button id="petModalAddTrade" class="px-4 py-2 bg-primary hover:bg-opacity-90 text-white font-medium rounded-md focus:outline-none transition-colors duration-200">
                        Put up for Trade
                    </button>
                `;
                
                document.getElementById('petModalAddTrade').addEventListener('click', function() {
                    togglePetTrading(petId);
                    document.getElementById('petDetailModal').classList.add('hidden');
                });
            }
        } else if (context === 'market') {
            // Market pet options
            const hasPendingOffer = trades.some(trade => 
                trade.status === 'pending' && 
                trade.senderId === CURRENT_USER_ID && 
                trade.receiverPetId === petId
            );
            
            if (hasPendingOffer) {
                actionsContainer.innerHTML = `
                    <button class="px-4 py-2 bg-yellow-500 cursor-not-allowed text-white font-medium rounded-md opacity-70" disabled>
                        Offer Pending
                    </button>
                `;
            } else {
                actionsContainer.innerHTML = `
                    <button id="petModalOfferTrade" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none transition-colors duration-200">
                        Offer Trade
                    </button>
                `;
                
                document.getElementById('petModalOfferTrade').addEventListener('click', function() {
                    openTradeOffer(petId, pet.ownerId);
                    document.getElementById('petDetailModal').classList.add('hidden');
                });
            }
        }
        
        // Add close button
        actionsContainer.innerHTML += `
            <button id="petModalClose" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md focus:outline-none transition-colors duration-200">
                Close
            </button>
        `;
        
        document.getElementById('petModalClose').addEventListener('click', function() {
            document.getElementById('petDetailModal').classList.add('hidden');
        });
        
        // Show modal
        document.getElementById('petDetailModal').classList.remove('hidden');
    }
    
    /**
     * Update pet type icon in modal
     */
    function updatePetTypeIcon(type) {
        const iconPath = getPetTypeIconPath(type);
        document.getElementById('petTypeIcon').innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}" />
        `;
    }
    
    /**
     * Toggle pet trading status
     */
    function togglePetTrading(petId) {
        // Find the pet in myPets
        const petIndex = myPets.findIndex(p => p.id === petId);
        if (petIndex === -1) {
            console.error('Pet not found:', petId);
            return;
        }
        
        // Toggle trading status
        myPets[petIndex].trading = !myPets[petIndex].trading;
        
        // If now trading, add to market pets
        if (myPets[petIndex].trading) {
            // Clone the pet to avoid reference issues
            const marketPet = {...myPets[petIndex]};
            
            // Check if already in market
            const existingIndex = marketPets.findIndex(p => p.id === petId);
            if (existingIndex === -1) {
                marketPets.push(marketPet);
            } else {
                marketPets[existingIndex] = marketPet;
            }
        } else {
            // If no longer trading, update market pet or remove from market
            const existingIndex = marketPets.findIndex(p => p.id === petId);
            if (existingIndex !== -1) {
                marketPets[existingIndex].trading = false;
            }
            
            // Cancel any pending trades for this pet
            cancelTradesForPet(petId);
        }
        
        // Save changes
        saveMarketPets();
        
        // Update UI
        renderMyPets();
        renderMarketPets();
        renderTrades();
        updateStats();
    }
    
    /**
     * Cancel any pending trades for a specific pet
     */
    function cancelTradesForPet(petId) {
        let updated = false;
        
        trades.forEach(trade => {
            if ((trade.senderPetId === petId || trade.receiverPetId === petId) && trade.status === 'pending') {
                trade.status = 'cancelled';
                trade.completedAt = new Date().toISOString();
                updated = true;
            }
        });
        
        if (updated) {
            saveTrades();
        }
    }
    
    /**
     * Open trade offer modal
     */
    function openTradeOffer(petId, ownerId) {
        // Find the pet
        const pet = findPetById(petId);
        if (!pet) {
            console.error('Pet not found:', petId);
            return;
        }
        
        // Set their pet details
        document.getElementById('theirPetName').textContent = pet.name;
        document.getElementById('theirPetType').textContent = capitalizeFirstLetter(pet.type);
        document.getElementById('theirPetOwner').textContent = pet.owner;
        document.getElementById('theirPetAscii').textContent = pet.pattern;
        document.getElementById('tradeTheirPetId').value = petId;
        document.getElementById('tradeTheirPetOwnerId').value = ownerId;
        
        // Clear your pet selection
        document.getElementById('yourPetSelect').selectedIndex = 0;
        document.getElementById('yourOfferPetPreview').classList.add('hidden');
        
        // Hide status messages
        document.getElementById('tradeOfferError').classList.add('hidden');
        document.getElementById('tradeOfferSuccess').classList.add('hidden');
        
        // Reset button state
        document.getElementById('submitTradeBtn').disabled = false;
        document.getElementById('submitTradeBtn').innerText = 'Send Trade Offer';
        
        // Populate pet selection dropdown
        populateOfferPetDropdown();
        
        // Show modal
        document.getElementById('tradeOfferModal').classList.remove('hidden');
    }
    
    /**
     * Update the trade offer preview when a pet is selected
     */
    function updateTradeOfferPreview() {
        const petSelect = document.getElementById('yourPetSelect');
        const previewContainer = document.getElementById('yourOfferPetPreview');
        
        if (petSelect.value) {
            // Find selected pet
            const selectedPet = myPets.find(p => p.id === petSelect.value);
            if (selectedPet) {
                // Update preview
                document.getElementById('yourOfferPetName').textContent = selectedPet.name;
                document.getElementById('yourOfferPetType').textContent = capitalizeFirstLetter(selectedPet.type);
                document.getElementById('yourOfferPetAscii').textContent = selectedPet.pattern;
                
                // Show preview
                previewContainer.classList.remove('hidden');
                return;
            }
        }
        
        // Hide preview if no valid pet selected
        previewContainer.classList.add('hidden');
    }
    
    /**
     * Populate the pet dropdown in the trade offer modal
     */
    function populateOfferPetDropdown() {
        const petSelect = document.getElementById('yourPetSelect');
        const receiverPetId = document.getElementById('tradeTheirPetId').value;
        
        // Clear existing options (except the default)
        while (petSelect.options.length > 1) {
            petSelect.remove(1);
        }
        
        // Get pets that are available for trading (not already in trade)
        const availablePets = myPets.filter(pet => !pet.trading);
        
        // Add each pet as an option
        availablePets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = `${pet.name} (${capitalizeFirstLetter(pet.type)})`;
            petSelect.appendChild(option);
        });
        
        // If no pets available, add a disabled option
        if (availablePets.length === 0) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "No pets available to trade";
            option.disabled = true;
            petSelect.appendChild(option);
        }
    }
    
    /**
     * Submit a trade offer
     */
    function submitTradeOffer() {
        const yourPetId = document.getElementById('yourPetSelect').value;
        const theirPetId = document.getElementById('tradeTheirPetId').value;
        const ownerId = document.getElementById('tradeTheirPetOwnerId').value;
        
        // Validate selection
        if (!yourPetId) {
            document.getElementById('tradeOfferError').classList.remove('hidden');
            return;
        }
        
        // Hide error if shown
        document.getElementById('tradeOfferError').classList.add('hidden');
        
        // Create trade object
        const trade = {
            id: `trade_${Date.now()}`,
            senderId: CURRENT_USER_ID,
            receiverId: ownerId,
            senderPetId: yourPetId,
            receiverPetId: theirPetId,
            status: 'pending',
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        // Add to trades array
        trades.push(trade);
        saveTrades();
        
        // Mark your pet as trading
        const petIndex = myPets.findIndex(p => p.id === yourPetId);
        if (petIndex !== -1) {
            myPets[petIndex].trading = true;
            
            // Also add to market (or update if already there)
            const marketIndex = marketPets.findIndex(p => p.id === yourPetId);
            if (marketIndex !== -1) {
                marketPets[marketIndex] = {...myPets[petIndex]};
            } else {
                marketPets.push({...myPets[petIndex]});
            }
            
            saveMarketPets();
        }
        
        // Update UI
        renderMyPets();
        renderMarketPets();
        renderTrades();
        updateStats();
        
        // Show success message
        document.getElementById('tradeOfferSuccess').classList.remove('hidden');
        document.getElementById('submitTradeBtn').disabled = true;
        document.getElementById('submitTradeBtn').innerText = 'Offer Sent';
        
        // Close modal after delay
        setTimeout(() => {
            document.getElementById('tradeOfferModal').classList.add('hidden');
        }, 2000);
    }
    
    /**
     * Open trade confirmation modal
     */
    function openTradeConfirmation(tradeId, action) {
        // Find the trade
        const trade = trades.find(t => t.id === tradeId);
        if (!trade) {
            console.error('Trade not found:', tradeId);
            return;
        }
        
        // Find pets involved
        const yourPet = findPetById(trade.receiverPetId); // for incoming trades, receiver is you
        const theirPet = findPetById(trade.senderPetId);
        
        if (!yourPet || !theirPet) {
            console.error('Pets not found for trade:', trade);
            return;
        }
        
        // Set confirmation action text
        document.getElementById('tradeConfirmAction').textContent = action === 'accept' ? 'accept' : 'reject';
        
        // Set pet details
        document.getElementById('confirmYourPetName').textContent = yourPet.name;
        document.getElementById('confirmYourPetType').textContent = capitalizeFirstLetter(yourPet.type);
        document.getElementById('confirmYourPetAscii').textContent = yourPet.pattern;
        
        document.getElementById('confirmTheirPetName').textContent = theirPet.name;
        document.getElementById('confirmTheirPetType').textContent = capitalizeFirstLetter(theirPet.type);
        document.getElementById('confirmTheirPetAscii').textContent = theirPet.pattern;
        document.getElementById('confirmTheirPetOwner').textContent = theirPet.owner;
        
        // Set trade ID and action
        document.getElementById('confirmTradeId').value = tradeId;
        document.getElementById('confirmTradeAction').value = action;
        
        // Hide confirmation messages
        document.getElementById('tradeConfirmSuccess').classList.add('hidden');
        document.getElementById('tradeRejectSuccess').classList.add('hidden');
        
        // Show appropriate buttons
        document.getElementById('acceptTradeBtn').classList.toggle('hidden', action !== 'accept');
        document.getElementById('rejectTradeBtn').classList.toggle('hidden', action !== 'reject');
        document.getElementById('cancelConfirmBtn').classList.remove('hidden');
        
        // Show modal
        document.getElementById('tradeConfirmationModal').classList.remove('hidden');
    }
    
    /**
     * Confirm a trade (accept or reject)
     */
    function confirmTrade(action) {
        const tradeId = document.getElementById('confirmTradeId').value;
        
        // Find the trade
        const tradeIndex = trades.findIndex(t => t.id === tradeId);
        if (tradeIndex === -1) {
            console.error('Trade not found:', tradeId);
            return;
        }
        
        // Update trade status
        trades[tradeIndex].status = action === 'accept' ? 'accepted' : 'rejected';
        trades[tradeIndex].completedAt = new Date().toISOString();
        
        // If accepting, swap pet ownership
        if (action === 'accept') {
            const senderPetId = trades[tradeIndex].senderPetId;
            const receiverPetId = trades[tradeIndex].receiverPetId;
            
            // Swap ownership in myPets
            const myReceiverPetIndex = myPets.findIndex(p => p.id === receiverPetId);
            if (myReceiverPetIndex !== -1) {
                // Remove from your collection
                const receiverPet = myPets.splice(myReceiverPetIndex, 1)[0];
                receiverPet.trading = false; // No longer trading
                
                // Update in marketPets too
                const marketReceiverIndex = marketPets.findIndex(p => p.id === receiverPetId);
                if (marketReceiverIndex !== -1) {
                    marketPets.splice(marketReceiverIndex, 1);
                }
                
                // TODO: In a real app, this would update the other user's collection
            }
            
            // Add the sender's pet to your collection
            const marketSenderIndex = marketPets.findIndex(p => p.id === senderPetId);
            if (marketSenderIndex !== -1) {
                const senderPet = {...marketPets[marketSenderIndex]};
                senderPet.ownerId = CURRENT_USER_ID;
                senderPet.owner = CURRENT_USER;
                senderPet.trading = false; // No longer trading
                
                // Add to your collection
                myPets.push(senderPet);
                
                // Remove from market
                marketPets.splice(marketSenderIndex, 1);
                
                // TODO: In a real app, update the other user's collection
            }
            
            // Cancel any other pending trades for these pets
            cancelTradesForPet(senderPetId);
            cancelTradesForPet(receiverPetId);
        }
        
        // Save changes
        saveTrades();
        saveMarketPets();
        
        // Update localStorage for ASCII Pet Generator
        localStorage.setItem('asciiPetCollection', JSON.stringify(myPets));
        
        // Update UI
        renderMyPets();
        renderMarketPets();
        renderTrades();
        updateStats();
        
        // Show success message
        if (action === 'accept') {
            document.getElementById('tradeConfirmSuccess').classList.remove('hidden');
        } else {
            document.getElementById('tradeRejectSuccess').classList.remove('hidden');
        }
        
        // Hide buttons
        document.getElementById('acceptTradeBtn').classList.add('hidden');
        document.getElementById('rejectTradeBtn').classList.add('hidden');
        document.getElementById('cancelConfirmBtn').classList.add('hidden');
        
        // Change close text
        document.getElementById('closeConfirmModalBtn').ariaLabel = 'Close';
        
        // Close modal after delay
        setTimeout(() => {
            document.getElementById('tradeConfirmationModal').classList.add('hidden');
        }, 2000);
    }
    
    /**
     * Cancel a trade offer
     */
    function cancelTradeOffer(tradeId) {
        // Find the trade
        const tradeIndex = trades.findIndex(t => t.id === tradeId);
        if (tradeIndex === -1) {
            console.error('Trade not found:', tradeId);
            return;
        }
        
        // Update trade status
        trades[tradeIndex].status = 'cancelled';
        trades[tradeIndex].completedAt = new Date().toISOString();
        
        // Get the sender pet (your pet for outgoing trades)
        const senderPetId = trades[tradeIndex].senderPetId;
        
        // Update my pet if no other active trades
        const hasOtherTrades = trades.some(t => 
            t.id !== tradeId && 
            t.status === 'pending' && 
            (t.senderPetId === senderPetId || t.receiverPetId === senderPetId)
        );
        
        if (!hasOtherTrades) {
            // Update in myPets
            const myPetIndex = myPets.findIndex(p => p.id === senderPetId);
            if (myPetIndex !== -1) {
                myPets[myPetIndex].trading = false;
            }
            
            // Update in marketPets
            const marketPetIndex = marketPets.findIndex(p => p.id === senderPetId);
            if (marketPetIndex !== -1) {
                marketPets[marketPetIndex].trading = false;
            }
        }
        
        // Save changes
        saveTrades();
        saveMarketPets();
        
        // Update UI
        renderMyPets();
        renderMarketPets();
        renderTrades();
        updateStats();
    }
    
    /**
     * Refresh the market with new random pets
     */
    function refreshMarket() {
        // Remove non-trading pets
        marketPets = marketPets.filter(pet => pet.trading);
        
        // Get trading pets from my collection
        const myTradingPets = myPets.filter(pet => pet.trading);
        
        // Add my trading pets to the market
        myTradingPets.forEach(pet => {
            const existingIndex = marketPets.findIndex(p => p.id === pet.id);
            if (existingIndex === -1) {
                marketPets.push({...pet});
            } else {
                marketPets[existingIndex] = {...pet};
            }
        });
        
        // Generate some new random pets
        const newPets = generateSampleMarketPets();
        newPets.forEach(pet => {
            const existingIndex = marketPets.findIndex(p => p.id === pet.id);
            if (existingIndex === -1) {
                marketPets.push(pet);
            }
        });
        
        // Save and update UI
        saveMarketPets();
        renderMarketPets();
        populateUserFilterOptions();
    }
    
    /**
     * Update various stats and badges
     */
    function updateStats() {
        // Update collection count
        document.getElementById('myPetCount').textContent = myPets.length;
        
        // Count active and pending trades
        const activeTrades = trades.filter(t => t.status === 'pending').length;
        const incomingTrades = trades.filter(t => t.status === 'pending' && t.receiverId === CURRENT_USER_ID).length;
        const completedTrades = trades.filter(t => t.status === 'accepted').length;
        
        // Update stats
        document.getElementById('activeTradeCount').textContent = activeTrades;
        document.getElementById('completedTradeCount').textContent = completedTrades;
        
        // Update pending badge
        const pendingBadge = document.getElementById('pendingBadge');
        if (incomingTrades > 0) {
            document.getElementById('pendingTradeCount').textContent = incomingTrades;
            pendingBadge.classList.remove('hidden');
        } else {
            pendingBadge.classList.add('hidden');
        }
        
        // Update incoming badge
        updateTradeBadges(incomingTrades);
    }
    
    /**
     * Update the incoming trades badge
     */
    function updateTradeBadges(count) {
        const incomingBadge = document.getElementById('incomingBadge');
        
        if (count > 0) {
            document.getElementById('incomingCount').textContent = count;
            incomingBadge.classList.remove('hidden');
        } else {
            incomingBadge.classList.add('hidden');
        }
    }
    
    // ===== HELPER FUNCTIONS =====
    
    /**
     * Format a date string to a readable format
     */
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Unknown date';
        }
    }
    
    /**
     * Capitalize the first letter of a string
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /**
     * Get a color class for a pet type
     */
    function getPetTypeBgColor(type) {
        const colors = {
            cat: 'bg-blue-600',
            dog: 'bg-green-600',
            rabbit: 'bg-purple-600',
            bird: 'bg-yellow-600',
            fish: 'bg-cyan-600',
            alien: 'bg-indigo-600'
        };
        
        return colors[type] || 'bg-gray-600';
    }
    
    /**
     * Get SVG path for a pet type icon
     */
    function getPetTypeIconPath(type) {
        const paths = {
            cat: 'M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm3.555-14c.695.034 1.594.903 1.594 1.5 0 .823-1.182 1.5-2.639 1.5-.513 0-.978-.094-1.359-.256.059-.188.103-.384.103-.594 0-.828-.56-1.526-1.318-1.744.283-.181.612-.279.964-.279 1.677 0 2.559.786 2.655.873zm-7.108 0C9.542 6.034 10.441 6.903 10.441 7.5c0 .823-1.182 1.5-2.639 1.5-.513 0-.978-.094-1.359-.256.059-.188.103-.384.103-.594 0-.828-.56-1.526-1.318-1.744.283-.181.612-.279.964-.279 1.677 0 2.559.786 2.655.873zM16 16c0 1.105-1.791 2-4 2s-4-.895-4-2',
            dog: 'M9.04 21.8c.17-.18.29-.38.36-.61.13.15.27.29.45.42C10.35 21.87 10.85 22 11.42 22c.54 0 1.02-.17 1.37-.46.35.35.78.53 1.32.53.66 0 1.14-.33 1.5-.7.15.15.32.29.53.42.71.43 1.62.24 2.21-.34.78-.78.78-2.05 0-2.83l-7.1-7.1c-.49-.49-1.27-.5-1.77 0l-1.13 1.13h-.89v2.67h1.94l.97.97v3.89c0 .8.38 1.53 1.06 1.98-.08-.11-.14-.23-.19-.36zM5 16V8c0-1.1.9-2 2-2h6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2h-1zM4 3h1a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2z',
            rabbit: 'M14 16.94V12.94c1.65-0.49 2.8-2.04 2.93-3.82 0.28-0.29 0.47-0.67 0.54-1.08 0.1-0.55-0.04-1.08-0.32-1.54 0.03-1.84-1.13-3.55-2.9-4.26C13.63 1.48 12.84 1 12 1C11.37 1 10.78 1.19 10.25 1.5 10.25 1.5 7.25 1 5.53 3.59 5.37 4.07 5.55 4.63 5.5 5.13 5.43 5.83 5.89 6.41 6.13 7.13 6.38 7.84 6.16 8.64 5.56 9.06 6.17 9.04 6.92 9.33 6.92 9.33 6.92 9.33 6.22 10.15 5.53 10.31 4.84 10.46 4.75 10.47 4.75 10.47 4.91 10.58 5.23 10.94 5.22 11.22 5.22 11.5 5.23 11.62 4.92 11.72 4.67 11.77 4.11 11.38 3.72 11.16 3.72 11.16 3.33 10.48 4.12 9.92 4.12 9.92 4.03 9.97 3.72 9.97 3.41 9.97 3.05 9.29 3.05 9.29L2.27 10.25C2.07 10.34 2 10.37 2 10.58V15.94C2 16.13 2.13 16.39 2.3 16.48L4.07 17.53C4.24 17.62 4.54 17.7 4.73 17.7S5.2 17.62 5.37 17.53L5.53 17.44V14.93C5.53 14.93 6.03 16.53 8.53 16.53 9.12 16.53 10.11 16.4 11 15.94L11.03 19.94H13.03L13 15.94C13.42 15.78 13.79 15.58 14 15.38Z',
            bird: 'M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm.83-3.4l-3.47-3.5a1 1 0 0 0-1.42 0L13 4.93 21.23 13l2.28-2.3a1 1 0 0 0 0-1.42l-3.47-3.5z',
            fish: 'M6 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6-18c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 19.075 1 13 5.925 2 12 2zm0 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm3.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
            alien: 'M12 2a5 5 0 1 0 5 5c0-1.1-.35-2.15-1-3 .6-.55 1-1.34 1-2.23 0-1.66-1.34-3-3-3-1.54 0-2.8 1.16-2.96 2.65A4.981 4.981 0 0 0 12 2zm2.76 4.57c.76.1 1.45.67 1.67 1.45.26.91-.22 1.92-1.1 2.33l-1.34.6v7.22c0 .55-.45 1-1 1s-1-.45-1-1V10.9l-1.37-.66c-.8-.4-1.25-1.32-1.07-2.2.17-.8.79-1.45 1.54-1.58C12.24 6.4 13 5.44 13 4c0-.19.05-.36.14-.52.37.86.86 1.7 1.45 2.5.15.2.28.38.39.55-.07.02-.12.04-.22.04z'
        };
        
        return paths[type] || paths.cat;
    }
    
    // Expose public methods and properties
    return {
        init
    };
})();

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    PetTrading.init();
});