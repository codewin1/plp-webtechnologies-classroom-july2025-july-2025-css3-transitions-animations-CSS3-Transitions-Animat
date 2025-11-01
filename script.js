// Store reference to all language cards
const languageCards = document.querySelectorAll('.language-card');
const languagesGrid = document.getElementById('languagesGrid');

// Button references
const animateCardsBtn = document.getElementById('animateCardsBtn');
const sortByPopularityBtn = document.getElementById('sortByPopularity');
const sortBySatisfactionBtn = document.getElementById('sortBySatisfaction');
const resetBtn = document.getElementById('resetBtn');

// Search and view toggle
const searchInput = document.getElementById('searchInput');
const viewButtons = document.querySelectorAll('.view-btn');

// Global state to track original order
let originalCardOrder = [];
let isAnimating = false;

/**
 * Initialize the application on page load
 * Sets up event listeners and populates initial data
 */
function initializeApp() {
    console.log('🚀 Application initialized');
    
    // Store original card order for reset functionality
    storeOriginalCardOrder();
    
    // Animate stats counter on page load
    animateStatsCounter();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Log application state
    logApplicationState();
}

/**
 * Store the original order of cards
 * Demonstrates: Working with DOM elements and arrays
 */
function storeOriginalCardOrder() {
    originalCardOrder = Array.from(languageCards);
    console.log(`✅ Stored ${originalCardOrder.length} cards in original order`);
}

/**
 * Setup all event listeners for interactive elements
 * Demonstrates: Event delegation and multiple event types
 */
function setupEventListeners() {
    // Button click events
    animateCardsBtn.addEventListener('click', triggerSequentialAnimation);
    sortByPopularityBtn.addEventListener('click', () => sortCards('popularity'));
    sortBySatisfactionBtn.addEventListener('click', () => sortCards('satisfaction'));
    resetBtn.addEventListener('click', resetToOriginalOrder);
    
    // Search input event
    searchInput.addEventListener('input', handleSearch);
    
    // View toggle events
    viewButtons.forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });
    
    // Card interaction events
    languageCards.forEach(card => {
        setupCardEventListeners(card);
    });
    
    console.log('🎯 All event listeners attached');
}

/**
 * Setup event listeners for individual card
 * Parameters: card (DOM element)
 * Demonstrates: Function with parameters
 */
function setupCardEventListeners(card) {
    const detailsBtn = card.querySelector('.details-btn');
    const backBtn = card.querySelector('.back-btn');
    
    // Flip card on details button click
    detailsBtn.addEventListener('click', () => flipCard(card));
    
    // Flip back on back button click
    backBtn.addEventListener('click', () => flipCard(card));
    
    // Highlight card on hover
    card.addEventListener('mouseenter', () => highlightCard(card, true));
    card.addEventListener('mouseleave', () => highlightCard(card, false));
}

/**
 * Flip a language card to show back or front
 * Parameters: card (DOM element)
 * Demonstrates: Toggling CSS classes with JavaScript
 */
function flipCard(card) {
    card.classList.toggle('flipped');
    
    // Return the flip state (demonstrates return value)
    const isFlipped = card.classList.contains('flipped');
    console.log(`Card flipped: ${isFlipped}`);
    
    return isFlipped;
}

/**
 * Highlight a card with animation
 * Parameters: card (DOM element), shouldHighlight (boolean)
 * Demonstrates: Conditional logic and parameters
 */
function highlightCard(card, shouldHighlight) {
    if (shouldHighlight) {
        card.classList.add('highlight');
    } else {
        // Remove highlight after animation completes
        setTimeout(() => {
            card.classList.remove('highlight');
        }, 1000);
    }
}

/**
 * Get card data as an object
 * Parameters: card (DOM element)
 * Returns: Object with card data
 * Demonstrates: Return values and data extraction
 */
function getCardData(card) {
    // LOCAL SCOPE: These variables only exist within this function
    const rank = parseInt(card.dataset.rank);
    const popularity = parseFloat(card.dataset.popularity);
    const satisfaction = parseFloat(card.dataset.satisfaction);
    const name = card.querySelector('.language-name').textContent;
    
    // Return an object containing the data
    return {
        element: card,
        rank: rank,
        popularity: popularity,
        satisfaction: satisfaction,
        name: name
    };
}

/**
 * Extract all card data into an array
 * Returns: Array of card data objects
 * Demonstrates: Array methods and return values
 */
function getAllCardData() {
    // LOCAL SCOPE: cardsData only exists in this function
    const cardsData = Array.from(languageCards).map(card => getCardData(card));
    
    console.log('📊 Extracted data from all cards:', cardsData);
    return cardsData;
}

/**
 * Sort cards by specified criteria
 * Parameters: sortBy (string) - 'popularity' or 'satisfaction'
 * Demonstrates: Function parameters and conditional logic
 */
function sortCards(sortBy) {
    if (isAnimating) {
        console.log('⏳ Animation in progress, please wait');
        return;
    }
    
    console.log(`🔄 Sorting by ${sortBy}`);
    
    // Get all card data
    const cardsData = getAllCardData();
    
    // Sort based on criteria (LOCAL SCOPE)
    let sortedData;
    if (sortBy === 'popularity') {
        sortedData = sortByPopularity(cardsData);
    } else if (sortBy === 'satisfaction') {
        sortedData = sortBySatisfaction(cardsData);
    } else {
        console.error('❌ Invalid sort criteria');
        return;
    }
    
    // Rearrange cards with animation
    rearrangeCards(sortedData);
}

/**
 * Sort card data by popularity (descending)
 * Parameters: cardsData (array)
 * Returns: Sorted array
 * Demonstrates: Array sorting and return values
 */
function sortByPopularity(cardsData) {
    // LOCAL SCOPE: sorted array only exists here
    const sorted = [...cardsData].sort((a, b) => b.popularity - a.popularity);
    
    console.log('📈 Sorted by popularity:', sorted.map(c => c.name));
    return sorted;
}

/**
 * Sort card data by satisfaction (descending)
 * Parameters: cardsData (array)
 * Returns: Sorted array
 * Demonstrates: Arrow functions and array methods
 */
function sortBySatisfaction(cardsData) {
    const sorted = [...cardsData].sort((a, b) => b.satisfaction - a.satisfaction);
    
    console.log('❤️ Sorted by satisfaction:', sorted.map(c => c.name));
    return sorted;
}

/**
 * Rearrange cards in the DOM
 * Parameters: sortedData (array of card objects)
 * Demonstrates: DOM manipulation and array methods
 */
function rearrangeCards(sortedData) {
    isAnimating = true;
    
    // Fade out cards
    languageCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
    });
    
    // Wait for fade out, then rearrange
    setTimeout(() => {
        // Remove all cards from grid
        sortedData.forEach(data => {
            languagesGrid.removeChild(data.element);
        });
        
        // Re-append in sorted order
        sortedData.forEach((data, index) => {
            // Update rank badge
            const rankBadge = data.element.querySelector('.rank-badge');
            rankBadge.textContent = index + 1;
            
            // Append to grid
            languagesGrid.appendChild(data.element);
            
            // Fade in with delay
            setTimeout(() => {
                data.element.style.opacity = '1';
                data.element.style.transform = 'scale(1)';
            }, index * 100);
        });
        
        isAnimating = false;
        console.log('✅ Cards rearranged successfully');
    }, 400);
}

// ========================================
// ANIMATION FUNCTIONS
// Demonstrates: Timing, delays, and sequential animations
// ========================================

/**
 * Trigger sequential animation for all cards
 * Demonstrates: Loops, delays, and animation timing
 */
function triggerSequentialAnimation() {
    if (isAnimating) {
        console.log('⏳ Animation already in progress');
        return;
    }
    
    isAnimating = true;
    console.log('✨ Starting sequential animation');
    
    // Animate each card with a delay
    languageCards.forEach((card, index) => {
        setTimeout(() => {
            animateCard(card, index);
        }, index * 200);
    });
    
    // Reset animation flag after all animations complete
    setTimeout(() => {
        isAnimating = false;
        console.log('✅ Sequential animation complete');
    }, languageCards.length * 200 + 1000);
}

/**
 * Animate a single card with multiple effects
 * Parameters: card (DOM element), index (number)
 * Demonstrates: Multiple animation effects
 */
function animateCard(card, index) {
    // Add highlight effect
    card.classList.add('highlight');
    
    // Pulse animation
    card.style.transform = 'scale(1.1) rotate(2deg)';
    
    // Reset after animation
    setTimeout(() => {
        card.style.transform = 'scale(1) rotate(0deg)';
        card.classList.remove('highlight');
    }, 500);
}

/**
 * Animate stats counter with counting effect
 * Demonstrates: Animation loops and number formatting
 */
function animateStatsCounter() {
    const totalDevsElement = document.getElementById('totalDevelopers');
    const avgSatElement = document.getElementById('avgSatisfaction');
    
    // Target values
    const targetDevs = 89547;
    const targetSat = 67.2;
    
    // Animate developers count
    animateNumber(totalDevsElement, 0, targetDevs, 2000, (num) => num.toLocaleString());
    
    // Animate satisfaction percentage
    animateNumber(avgSatElement, 0, targetSat, 2000, (num) => num.toFixed(1) + '%');
}

/**
 * Animate a number from start to end
 * Parameters: element, start, end, duration, formatter function
 * Returns: Animation completion status
 * Demonstrates: Function parameters including callback functions
 */
function animateNumber(element, start, end, duration, formatter) {
    // LOCAL SCOPE: These variables only exist in this function
    const startTime = Date.now();
    const range = end - start;
    
    /**
     * Inner function for animation frame
     * Demonstrates: Closures and nested functions
     */
    function updateNumber() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeProgress = easeOutQuad(progress);
        const currentValue = start + (range * easeProgress);
        
        // Update element with formatted value
        element.textContent = formatter(currentValue);
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    // Start the animation
    requestAnimationFrame(updateNumber);
    
    return true; // Return success
}

/**
 * Easing function for smooth animations
 * Parameters: t (progress from 0 to 1)
 * Returns: Eased value
 * Demonstrates: Mathematical functions and return values
 */
function easeOutQuad(t) {
    return t * (2 - t);
}


// SEARCH AND FILTER FUNCTIONS
// Demonstrates: String methods and filtering

/**
 * Handle search input
 * Demonstrates: Event handling and filtering
 */
function handleSearch() {
    // LOCAL SCOPE: searchTerm only exists in this function
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    console.log(`🔍 Searching for: "${searchTerm}"`);
    
    // Filter cards based on search term
    languageCards.forEach(card => {
        const languageName = card.querySelector('.language-name').textContent.toLowerCase();
        const matches = languageName.includes(searchTerm);
        
        // Show or hide card based on match
        if (matches) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
    
    // Count visible cards
    const visibleCount = countVisibleCards();
    console.log(`📊 Visible cards: ${visibleCount}`);
}

/**
 * Count visible (non-hidden) cards
 * Returns: Number of visible cards
 * Demonstrates: Array filtering and return values
 */
function countVisibleCards() {
    const visibleCards = Array.from(languageCards).filter(card => {
        return !card.classList.contains('hidden');
    });
    
    return visibleCards.length;
}

// ========================================
// VIEW TOGGLE FUNCTIONS
// Demonstrates: Class manipulation and event handling
// ========================================

/**
 * Handle view toggle between grid and list
 * Parameters: event object
 * Demonstrates: Event object and data attributes
 */
function handleViewToggle(event) {
    const clickedBtn = event.target;
    const viewType = clickedBtn.dataset.view;
    
    console.log(`👁️ Switching to ${viewType} view`);
    
    // Update active button
    viewButtons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    // Apply view to grid
    if (viewType === 'list') {
        languagesGrid.classList.add('list-view');
    } else {
        languagesGrid.classList.remove('list-view');
    }
}

// ========================================
// RESET FUNCTION
// Demonstrates: Restoring original state
// ========================================

/**
 * Reset cards to original order
 * Demonstrates: Array manipulation and DOM operations
 */
function resetToOriginalOrder() {
    console.log('🔄 Resetting to original order');
    
    isAnimating = true;
    
    // Fade out effect
    languageCards.forEach(card => {
        card.style.opacity = '0';
    });
    
    setTimeout(() => {
        // Clear grid
        while (languagesGrid.firstChild) {
            languagesGrid.removeChild(languagesGrid.firstChild);
        }
        
        // Re-append in original order
        originalCardOrder.forEach((card, index) => {
            // Reset rank badge
            const rankBadge = card.querySelector('.rank-badge');
            rankBadge.textContent = index + 1;
            
            // Remove flipped class
            card.classList.remove('flipped');
            
            // Append to grid
            languagesGrid.appendChild(card);
            
            // Fade in
            setTimeout(() => {
                card.style.opacity = '1';
            }, index * 100);
        });
        
        // Clear search
        searchInput.value = '';
        handleSearch();
        
        isAnimating = false;
        console.log('✅ Reset complete');
    }, 400);
}

// ========================================
// UTILITY FUNCTIONS
// Demonstrates: Helper functions with specific purposes
// ========================================

/**
 * Calculate average satisfaction across all languages
 * Returns: Average satisfaction percentage
 * Demonstrates: Array reduce method and calculations
 */
function calculateAverageSatisfaction() {
    const cardsData = getAllCardData();
    
    // Use reduce to sum all satisfaction values
    const totalSatisfaction = cardsData.reduce((sum, card) => {
        return sum + card.satisfaction;
    }, 0);
    
    const average = totalSatisfaction / cardsData.length;
    
    console.log(`📊 Average satisfaction: ${average.toFixed(1)}%`);
    return average;
}

/**
 * Get top N languages by criteria
 * Parameters: count (number), criteria (string)
 * Returns: Array of top languages
 * Demonstrates: Function with multiple parameters and return value
 */
function getTopLanguages(count, criteria) {
    const cardsData = getAllCardData();
    
    // Sort by criteria
    let sorted;
    if (criteria === 'popularity') {
        sorted = sortByPopularity(cardsData);
    } else {
        sorted = sortBySatisfaction(cardsData);
    }
    
    // Get top N
    const topLanguages = sorted.slice(0, count);
    
    console.log(`🏆 Top ${count} by ${criteria}:`, topLanguages.map(c => c.name));
    return topLanguages;
}

/**
 * Log application state for debugging
 * Demonstrates: Debugging and logging
 */
function logApplicationState() {
    console.log('=== APPLICATION STATE ===');
    console.log(`Total cards: ${languageCards.length}`);
    console.log(`Visible cards: ${countVisibleCards()}`);
    console.log(`Average satisfaction: ${calculateAverageSatisfaction().toFixed(1)}%`);
    console.log(`Is animating: ${isAnimating}`);
    console.log('========================');
}

// ========================================
// BONUS: ADVANCED FUNCTIONS
// Demonstrates: More complex JavaScript concepts
// ========================================

/**
 * Create a card comparison function
 * Parameters: card1, card2, criteria
 * Returns: Comparison result (-1, 0, 1)
 * Demonstrates: Comparator functions
 */
function compareCards(card1, card2, criteria) {
    const data1 = getCardData(card1);
    const data2 = getCardData(card2);
    
    if (data1[criteria] > data2[criteria]) return -1;
    if (data1[criteria] < data2[criteria]) return 1;
    return 0;
}

/**
 * Get language statistics summary
 * Returns: Object with summary statistics
 * Demonstrates: Object creation and complex data processing
 */
function getLanguageStatistics() {
    const cardsData = getAllCardData();
    
    const stats = {
        totalLanguages: cardsData.length,
        averagePopularity: cardsData.reduce((sum, c) => sum + c.popularity, 0) / cardsData.length,
        averageSatisfaction: cardsData.reduce((sum, c) => sum + c.satisfaction, 0) / cardsData.length,
        mostPopular: cardsData.reduce((max, c) => c.popularity > max.popularity ? c : max),
        mostSatisfying: cardsData.reduce((max, c) => c.satisfaction > max.satisfaction ? c : max)
    };
    
    console.log('📈 Language Statistics:', stats);
    return stats;
}


// INITIALIZE APPLICATION ON 
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM Content Loaded');
    initializeApp();
    
    // Display statistics in console
    setTimeout(() => {
        getLanguageStatistics();
        getTopLanguages(3, 'popularity');
        getTopLanguages(3, 'satisfaction');
    }, 3000);
});

