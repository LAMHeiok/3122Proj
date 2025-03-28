/**
    * ASCII Pet Shop - Combined shop for generate credits and general items
    */

// ===== DATA STRUCTURES =====

// Shop items for generate credits
const creditShopItems = [
    {
        id: 101,
        name: "Basic Credits Pack",
        description: "A starter pack of generate credits. Perfect for casual pet collectors who want to expand their collection.",
        credits: 10,
        price: 50,
        category: "credits",
        bestValue: false,
        type: "credit"
    },
    {
        id: 102,
        name: "Standard Credits Pack",
        description: "A balanced pack of generate credits. Great for regular pet collectors looking to add variety to their collection.",
        credits: 25,
        price: 100,
        category: "credits",
        bestValue: false,
        type: "credit"
    },
    {
        id: 103,
        name: "Premium Credits Pack",
        description: "A generous pack of generate credits at a discounted rate. Perfect for dedicated pet collectors who want to build a substantial collection.",
        credits: 60,
        price: 200,
        category: "credits",
        bestValue: true,
        type: "credit"
    },
    {
        id: 104,
        name: "Mega Credits Pack",
        description: "Our biggest pack of generate credits with the best value. For serious collectors who want to create an extensive pet collection.",
        credits: 150,
        price: 400,
        category: "credits",
        bestValue: true,
        type: "credit"
    },
    {
        id: 105,
        name: "Mini Credits Pack",
        description: "A small pack of generate credits to get started. Perfect for new users who want to try out the pet generator.",
        credits: 5,
        price: 30,
        category: "credits",
        bestValue: false,
        type: "credit"
    },
    {
        id: 106,
        name: "Ultimate Collector Pack",
        description: "An enormous pack of generate credits at our best rate. Unlocks the potential to create a truly impressive collection of ASCII pets.",
        credits: 300,
        price: 750,
        category: "credits",
        bestValue: true,
        type: "credit"
    }
];

// General shop items data
const generalShopItems = [
    {
        id: 1,
        name: "Premium Document Template",
        description: "Access to a premium template for professional documents. Includes multiple layouts, styling options, and pre-made sections that you can customize for your needs.",
        image: "template",
        price: 100,
        category: "templates",
        type: "general"
    },
    {
        id: 2,
        name: "Advanced Question Generation",
        description: "Unlock advanced question generation with deeper analysis, customized difficulty levels, and additional question types beyond multiple choice.",
        image: "question",
        price: 150,
        category: "features",
        type: "general"
    },
    {
        id: 3,
        name: "Data Visualization Pack",
        description: "A comprehensive set of visualization tools for your data. Includes advanced charts, graphs, and interactive elements to better represent your information.",
        image: "data",
        price: 200,
        category: "tools",
        type: "general"
    },
    {
        id: 4,
        name: "Academic Essay Template",
        description: "Professional template for academic essays with proper formatting, citation styles, and section layouts according to academic standards.",
        image: "academic",
        price: 80,
        category: "templates",
        type: "general"
    },
    {
        id: 5,
        name: "Research Paper Analyzer",
        description: "Advanced tool that analyzes research papers to extract key information, generate summaries, and identify important concepts.",
        image: "research",
        price: 250,
        category: "academic",
        type: "general"
    },
    {
        id: 6,
        name: "Extended Cloud Storage",
        description: "Increase your cloud storage limit by 5GB to store more documents, presentations, and educational materials.",
        image: "storage",
        price: 120,
        category: "features",
        type: "general"
    },
    {
        id: 7,
        name: "Scientific Diagram Creator",
        description: "Tool for creating professional scientific diagrams and illustrations for your presentations and documents.",
        image: "diagram",
        price: 180,
        category: "tools",
        type: "general"
    },
    {
        id: 8,
        name: "Citation Generator Pro",
        description: "Advanced citation tool with support for all major citation styles (APA, MLA, Chicago, IEEE, etc.) and automatic formatting.",
        image: "citation",
        price: 90,
        category: "academic",
        type: "general"
    },
    {
        id: 9,
        name: "Collaborative Workspace",
        description: "Create shared workspaces where you can collaborate with classmates or colleagues on documents and projects in real-time.",
        image: "workspace",
        price: 220,
        category: "features",
        type: "general"
    }
];

// User data - in a real app, this would come from a server
let userData = {
    points: 500,
    purchases: []
};

// Current active shop
let activeShop = 'credit'; // 'credit' or 'general'

// ===== INITIALIZATION =====

/**
    * Initialize the shop application
    */
function initShop() {
    console.log('Initializing shop...');
    
    // Set up dark mode
    setupDarkMode();
    
    // Load saved data
    loadUserData();
    loadCurrentCredits();
    
    // Initialize shop tabs
    setupShopTabs();
    
    // Render items and update UI
    renderCreditShopItems('bestValue');
    renderGeneralShopItems('all');
    updatePointsDisplay();
    updatePurchaseHistory();
    
    // Set up all event listeners
    setupEventListeners();
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
 * Setup shop tabs
 */
function setupShopTabs() {
    document.getElementById('creditShopTab').addEventListener('click', function() {
        switchShop('credit');
    });
    
    document.getElementById('generalShopTab').addEventListener('click', function() {
        switchShop('general');
    });
}

/**
 * Switch between shops
 */
function switchShop(shop) {
    activeShop = shop;
    
    const creditShopTab = document.getElementById('creditShopTab');
    const generalShopTab = document.getElementById('generalShopTab');
    const creditShopSection = document.getElementById('creditShopSection');
    const generalShopSection = document.getElementById('generalShopSection');
    
    // Update tabs
    if (shop === 'credit') {
        creditShopTab.classList.add('active');
        generalShopTab.classList.remove('active');
        creditShopSection.classList.remove('hidden');
        generalShopSection.classList.add('hidden');
    } else {
        creditShopTab.classList.remove('active');
        generalShopTab.classList.add('active');
        creditShopSection.classList.add('hidden');
        generalShopSection.classList.remove('hidden');
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Filter buttons for credit shop
    document.getElementById('bestValueFilter').addEventListener('click', function() {
        toggleCreditFilter(this, 'bestValue');
    });
    
    document.getElementById('showAllFilter').addEventListener('click', function() {
        toggleCreditFilter(this, 'all');
    });
    
    // Category filter buttons for general shop
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Render items for selected category
            renderGeneralShopItems(this.getAttribute('data-category'));
        });
    });
    
    // Modal buttons
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelPurchaseBtn').addEventListener('click', closeModal);
    document.getElementById('confirmPurchaseBtn').addEventListener('click', purchaseItem);
    
    // Refresh credits button
    document.getElementById('refreshCreditsBtn').addEventListener('click', loadCurrentCredits);
    
    // Close modal when clicking outside
    document.getElementById('itemDetailModal').addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });
}

/**
 * Toggle between credit shop filters
 */
function toggleCreditFilter(button, filter) {
    // Update button styles
    document.querySelector('#bestValueFilter').classList.remove('bg-primary/10', 'text-primary');
    document.querySelector('#bestValueFilter').classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
    
    document.querySelector('#showAllFilter').classList.remove('bg-primary/10', 'text-primary');
    document.querySelector('#showAllFilter').classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
    
    button.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
    button.classList.add('bg-primary/10', 'text-primary');
    
    // Render items
    renderCreditShopItems(filter);
}

// ===== CREDIT SHOP ITEMS RENDERING =====

/**
 * Render credit shop items based on filter
 * @param {string} filter - Filter to apply ('all' or 'bestValue')
 */
function renderCreditShopItems(filter) {
    const shopItemsGrid = document.getElementById('creditShopItemsGrid');
    shopItemsGrid.innerHTML = '';
    
    // Filter items
    const filteredItems = filter === 'bestValue' 
        ? creditShopItems.filter(item => item.bestValue)
        : creditShopItems;
    
    // Sort items by value (credits per point)
    filteredItems.sort((a, b) => (b.credits / b.price) - (a.credits / a.price));
    
    // Create item cards
    filteredItems.forEach(item => {
        const card = createCreditItemCard(item);
        shopItemsGrid.appendChild(card);
    });
}

/**
 * Create a credit item card
 * @param {Object} item - Item data
 * @returns {HTMLElement} Card element
 */
function createCreditItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden';
    
    // Calculate value
    const valueRatio = item.credits / item.price;
    const isHighValue = valueRatio >= 0.3; // Threshold for "good deal"
    
    // Create card content
    card.innerHTML = `
        <div class="p-5">
            <div class="flex items-start justify-between">
                <div class="w-12 h-12 bg-primary/20 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium text-gray-700 dark:text-gray-300">${item.price}</span>
                </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-4">${item.name}</h3>
            <div class="mt-2 flex items-center">
                <span class="text-lg font-bold text-primary">${item.credits}</span>
                <span class="ml-1 text-gray-600 dark:text-gray-400">Generate Credits</span>
                ${item.bestValue ? `
                    <span class="ml-auto px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">
                        Best Value
                    </span>
                ` : ''}
            </div>
            <p class="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-2">${item.description}</p>
            <button class="mt-4 w-full py-2 bg-primary hover:bg-opacity-90 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200 view-credit-btn" data-item-id="${item.id}">
                View Details
            </button>
        </div>
    `;
    
    // Add click event to view details button
    const viewDetailsBtn = card.querySelector('.view-credit-btn');
    viewDetailsBtn.addEventListener('click', function() {
        openItemDetails(item.id, 'credit');
    });
    
    return card;
}

// ===== GENERAL SHOP ITEMS RENDERING =====

/**
 * Render general shop items based on category
 * @param {string} category - Category to filter by ('all' or specific category)
 */
function renderGeneralShopItems(category) {
    const shopItemsGrid = document.getElementById('generalShopItemsGrid');
    shopItemsGrid.innerHTML = '';
    
    // Filter items by category
    const filteredItems = category === 'all' 
        ? generalShopItems 
        : generalShopItems.filter(item => item.category === category);
    
    // If no items found
    if (filteredItems.length === 0) {
        shopItemsGrid.innerHTML = `
            <div class="col-span-full py-8 text-center text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No items found in this category</p>
            </div>
        `;
        return;
    }
    
    // Create item cards
    filteredItems.forEach(item => {
        // Check if user already purchased this item
        const isPurchased = userData.purchases.some(purchase => purchase.itemId === item.id && purchase.type === 'general');
        
        // Create card
        const card = createGeneralItemCard(item, isPurchased);
        shopItemsGrid.appendChild(card);
    });
}

/**
 * Create a general shop item card
 * @param {Object} item - Item data
 * @param {boolean} isPurchased - Whether the item is already purchased
 * @returns {HTMLElement} Card element
 */
function createGeneralItemCard(item, isPurchased) {
    const card = document.createElement('div');
    card.className = 'item-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden';
    
    // Create card content
    card.innerHTML = `
        <div class="p-5">
            <div class="flex items-start justify-between">
                <div class="w-12 h-12 bg-primary/20 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        ${getIconPath(item.image)}
                    </svg>
                </div>
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium text-gray-700 dark:text-gray-300">${item.price}</span>
                </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-4">${item.name}</h3>
            <p class="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">${item.description}</p>
            ${isPurchased ? 
                `<div class="mt-4 flex items-center text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Purchased
                </div>` : 
                `<button class="mt-4 w-full py-2 bg-primary hover:bg-opacity-90 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-200 view-general-btn" data-item-id="${item.id}">
                    View Details
                </button>`
            }
        </div>
    `;
    
    // Add click event to view details button if not purchased
    if (!isPurchased) {
        const viewDetailsBtn = card.querySelector('.view-general-btn');
        viewDetailsBtn.addEventListener('click', function() {
            openItemDetails(item.id, 'general');
        });
    }
    
    return card;
}

// ===== ITEM DETAIL MODAL =====

/**
 * Open item details modal
 * @param {number} itemId - ID of the item to display
 * @param {string} type - Type of item ('credit' or 'general')
 */
function openItemDetails(itemId, type) {
    // Get the appropriate item based on type
    const item = type === 'credit' 
        ? creditShopItems.find(item => item.id === itemId)
        : generalShopItems.find(item => item.id === itemId);
        
    if (!item) return;
    
    // Set modal content
    document.getElementById('modalItemName').textContent = item.name;
    document.getElementById('modalItemPrice').textContent = `${item.price} points`;
    document.getElementById('modalItemDescription').textContent = item.description;
    document.getElementById('modalItemId').value = itemId;
    document.getElementById('modalItemType').value = type;
    
    // Update modal image icon
    const modalItemImage = document.getElementById('modalItemImage');
    if (type === 'credit') {
        modalItemImage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        `;
        
        // Show credits amount
        document.getElementById('creditsAmountDisplay').classList.remove('hidden');
        document.getElementById('modalItemCredits').textContent = item.credits;
    } else {
        modalItemImage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                ${getIconPath(item.image)}
            </svg>
        `;
        
        // Hide credits amount
        document.getElementById('creditsAmountDisplay').classList.add('hidden');
    }
    
    // Reset purchase notifications
    document.getElementById('purchaseConfirmation').classList.add('hidden');
    document.getElementById('insufficientFunds').classList.add('hidden');
    document.getElementById('confirmPurchaseBtn').classList.remove('hidden');
    document.getElementById('cancelPurchaseBtn').textContent = 'Cancel';
    
    // Show modal
    document.getElementById('itemDetailModal').classList.remove('hidden');
}

/**
 * Close item details modal
 */
function closeModal() {
    document.getElementById('itemDetailModal').classList.add('hidden');
}

// ===== PURCHASE FUNCTIONALITY =====

/**
 * Purchase an item
 */
function purchaseItem() {
    const itemId = parseInt(document.getElementById('modalItemId').value);
    const itemType = document.getElementById('modalItemType').value;
    
    // Get the appropriate item based on type
    const item = itemType === 'credit' 
        ? creditShopItems.find(item => item.id === itemId)
        : generalShopItems.find(item => item.id === itemId);
        
    if (!item) return;
    
    // Check if user has enough points
    if (userData.points < item.price) {
        document.getElementById('insufficientFunds').classList.remove('hidden');
        return;
    }
    
    // Process purchase
    processPurchase(item, itemType);
    
    // Update UI based on item type
    if (itemType === 'credit') {
        showCreditPurchaseConfirmation(item.credits);
    } else {
        showGeneralPurchaseConfirmation();
    }
    
    updateShopView(itemType);
}

/**
 * Process purchase - update user data
 * @param {Object} item - The item being purchased
 * @param {string} type - Type of item ('credit' or 'general')
 */
function processPurchase(item, type) {
    // Deduct points
    userData.points -= item.price;
    
    // Add to purchase history
    const purchase = {
        id: userData.purchases.length + 1,
        itemId: item.id,
        type: type,
        date: new Date().toISOString().split('T')[0],
        price: item.price
    };
    
    // Add credits info if it's a credit purchase
    if (type === 'credit') {
        purchase.credits = item.credits;
        
        // Add credits to pet generator
        addCreditsToPetGenerator(item.credits);
    }
    
    userData.purchases.push(purchase);
    
    // Save user data
    saveUserData();
}

/**
 * Add credits to the pet generator
 * @param {number} creditsToAdd - Amount of credits to add
 */
function addCreditsToPetGenerator(creditsToAdd) {
    try {
        // Get current credits
        let currentCredits = 0;
        try {
            const savedCredits = localStorage.getItem('asciiPetCredits');
            if (savedCredits) {
                currentCredits = parseInt(savedCredits, 10);
            }
        } catch (e) {
            console.error('Error reading credits:', e);
            currentCredits = 0;
        }
        
        // Add new credits
        const newTotalCredits = currentCredits + creditsToAdd;
        
        // Save back to localStorage
        localStorage.setItem('asciiPetCredits', newTotalCredits.toString());
        
        // Update the display
        document.getElementById('currentCredits').textContent = newTotalCredits;
        
        console.log(`Added ${creditsToAdd} credits. New total: ${newTotalCredits}`);
        
        // If AsciiPetApp is available, update it directly
        if (window.AsciiPetApp && typeof window.AsciiPetApp.addCredits === 'function') {
            window.AsciiPetApp.addCredits(creditsToAdd);
        }
        
        return newTotalCredits;
    } catch (e) {
        console.error('Error adding credits:', e);
        return 0;
    }
}

/**
 * Show credit purchase confirmation in the modal
 * @param {number} credits - Number of credits added
 */
function showCreditPurchaseConfirmation(credits) {
    document.getElementById('purchaseConfirmationText').textContent = `${credits} credits have been added to your account.`;
    document.getElementById('purchaseConfirmation').classList.remove('hidden');
    document.getElementById('confirmPurchaseBtn').classList.add('hidden');
    document.getElementById('cancelPurchaseBtn').textContent = 'Close';
}

/**
 * Show general purchase confirmation in the modal
 */
function showGeneralPurchaseConfirmation() {
    document.getElementById('purchaseConfirmationText').textContent = 'The item has been added to your account.';
    document.getElementById('purchaseConfirmation').classList.remove('hidden');
    document.getElementById('confirmPurchaseBtn').classList.add('hidden');
    document.getElementById('cancelPurchaseBtn').textContent = 'Close';
}

/**
 * Update all UI elements after purchase
 * @param {string} type - Type of item purchased ('credit' or 'general')
 */
function updateShopView(type) {
    // Update points with animation
    updatePointsDisplay(true);
    
    // Update purchase history
    updatePurchaseHistory();
    
    // Update shop items
    if (type === 'credit') {
        // Update current credits display
        loadCurrentCredits();
        
        // Re-render credit shop
        const activeFilter = document.querySelector('#bestValueFilter').classList.contains('active') ? 'bestValue' : 'all';
        renderCreditShopItems(activeFilter);
    } else {
        // Re-render general shop
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        renderGeneralShopItems(activeCategory);
    }
}

// ===== UI UPDATES =====

/**
 * Update points display
 * @param {boolean} animate - Whether to animate the update
 */
function updatePointsDisplay(animate = false) {
    const pointsBalance = document.getElementById('pointsBalance');
    pointsBalance.textContent = userData.points;
    
    if (animate) {
        const userPoints = document.getElementById('userPoints');
        userPoints.classList.add('points-update');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            userPoints.classList.remove('points-update');
        }, 500);
    }
}

/**
 * Load current credits from localStorage
 */
function loadCurrentCredits() {
    try {
        const creditsElement = document.getElementById('currentCredits');
        let credits = 0;
        
        try {
            const savedCredits = localStorage.getItem('asciiPetCredits');
            if (savedCredits) {
                credits = parseInt(savedCredits, 10);
            }
        } catch (e) {
            console.error('Error loading credits:', e);
            credits = 0;
        }
        
        creditsElement.textContent = credits;
        
        // Animate the update
        creditsElement.classList.add('points-update');
        setTimeout(() => {
            creditsElement.classList.remove('points-update');
        }, 500);
        
        return credits;
    } catch (e) {
        console.error('Error updating credits display:', e);
        return 0;
    }
}

/**
 * Update purchase history display
 */
function updatePurchaseHistory() {
    const emptyHistory = document.getElementById('emptyHistory');
    const purchaseHistory = document.getElementById('purchaseHistory');
    const purchaseHistoryBody = document.getElementById('purchaseHistoryBody');
    
    // Show/hide appropriate sections
    if (userData.purchases.length === 0) {
        emptyHistory.classList.remove('hidden');
        purchaseHistory.classList.add('hidden');
        return;
    }
    
    // Show purchase history and hide empty message
    emptyHistory.classList.add('hidden');
    purchaseHistory.classList.remove('hidden');
    
    // Clear current history
    purchaseHistoryBody.innerHTML = '';
    
    // Add purchases to the table (newest first)
    const sortedPurchases = [...userData.purchases].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedPurchases.forEach(purchase => {
        // Find the item
        let item;
        if (purchase.type === 'credit') {
            item = creditShopItems.find(item => item.id === purchase.itemId);
        } else {
            item = generalShopItems.find(item => item.id === purchase.itemId);
        }
        
        if (!item) return;
        
        const row = createPurchaseHistoryRow(item, purchase);
        purchaseHistoryBody.appendChild(row);
    });
}

/**
 * Create a purchase history row
 * @param {Object} item - Item data
 * @param {Object} purchase - Purchase data
 * @returns {HTMLElement} Row element
 */
function createPurchaseHistoryRow(item, purchase) {
    const row = document.createElement('tr');
    
    const getTypeIcon = () => {
        if (purchase.type === 'credit') {
            return `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            `;
        } else {
            return `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    ${getIconPath(item.image)}
                </svg>
            `;
        }
    };
    
    row.innerHTML = `
        <td class="px-4 py-3 whitespace-nowrap">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                    ${getTypeIcon()}
                </div>
                <div class="text-sm font-medium text-gray-800 dark:text-white">${item.name}</div>
            </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
            <span class="px-2 py-1 text-xs rounded-full ${purchase.type === 'credit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'}">
                ${purchase.type === 'credit' ? 'Generate Credits' : 'General Item'}
            </span>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
            <div class="text-sm text-gray-600 dark:text-gray-300">${purchase.date}</div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${purchase.price}
            </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
            ${purchase.type === 'credit' ? `
                <div class="flex items-center text-sm font-medium text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    ${purchase.credits}
                </div>
            ` : `
                <div class="text-sm text-gray-500 dark:text-gray-500">-</div>
            `}
        </td>
    `;
    
    return row;
}

// ===== DATA PERSISTENCE =====

/**
 * Save user data to localStorage
 */
function saveUserData() {
    try {
        localStorage.setItem('shopUserData', JSON.stringify(userData));
        console.log('User data saved');
    } catch (e) {
        console.error('Error saving user data:', e);
    }
}

/**
 * Load user data from localStorage
 */
function loadUserData() {
    try {
        const saved = localStorage.getItem('shopUserData');
        if (saved) {
            userData = JSON.parse(saved);
            console.log('User data loaded');
        }
    } catch (e) {
        console.error('Error loading user data:', e);
        userData = {
            points: 500,
            purchases: []
        };
    }
}

// ===== HELPER FUNCTIONS =====

/**
 * Get SVG path for item icon
 * @param {string} type - Icon type
 * @returns {string} SVG path element
 */
function getIconPath(type) {
    const iconPaths = {
        template: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />',
        question: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
        data: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />',
        academic: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />',
        research: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />',
        storage: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />',
        diagram: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />',
        citation: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />',
        workspace: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />'
    };
    
    return iconPaths[type] || iconPaths.template;
}

// Initialize the shop when the DOM is loaded
document.addEventListener('DOMContentLoaded', initShop);
