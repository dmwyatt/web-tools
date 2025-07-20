// Global variables
let nutritionData = [];
let ingredients = {
    breads: [],
    proteins: [],
    cheeses: [],
    vegetables: [],
    condiments: []
};
let selectedIngredients = [];

// DOM elements
const loadingSpinner = document.getElementById('loadingSpinner');
// Note: dataDate now handled by Alpine.js reactive binding

// New elements for sandwich builder
const buildSection = document.getElementById('buildSection');
const nutritionModal = document.getElementById('nutritionModal');
const modalItemName = document.getElementById('modalItemName');
const modalNutritionGrid = document.getElementById('modalNutritionGrid');
const closeModalBtn = document.getElementById('closeModal');
const breadOptions = document.getElementById('breadOptions');
const proteinOptions = document.getElementById('proteinOptions');
const cheeseOptions = document.getElementById('cheeseOptions');
const vegetableOptions = document.getElementById('vegetableOptions');
const condimentOptions = document.getElementById('condimentOptions');
const selectedIngredientsDiv = document.getElementById('selectedIngredients');
const totalNutritionDiv = document.getElementById('totalNutrition');
const clearAllBtn = document.getElementById('clearAll');
const ingredientSearchInput = document.getElementById('ingredientSearch');
const clearSearchBtn = document.getElementById('clearSearch');

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadNutritionData();
        setupEventListeners();
        // Note: Loading state now handled by Alpine.js store
    } catch (error) {
        console.error('Error initializing app:', error);
        // Note: Error display now handled by Alpine.js store
    }
});

// Load nutrition data from JSON file
async function loadNutritionData() {
    try {
        const response = await fetch('data/master-nutrition.json');
        if (!response.ok) {
            throw new Error('Failed to fetch nutrition data');
        }
        const data = await response.json();
        nutritionData = data;
        
        // Note: Data date now handled by Alpine.js reactive binding
        
        // Process ingredients for sandwich builder
        processIngredients();
    } catch (error) {
        throw new Error('Could not load nutrition data: ' + error.message);
    }
}

// Setup event listeners
function setupEventListeners() {
    
    // Modal listeners
    closeModalBtn.addEventListener('click', closeNutritionModal);
    nutritionModal.addEventListener('click', (e) => {
        if (e.target === nutritionModal) closeNutritionModal();
    });
    
    // Keyboard listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNutritionModal();
    });
    // Note: Clear all button now handled by Alpine.js @click directive
    
    // Search functionality - add null checks
    if (ingredientSearchInput) {
        ingredientSearchInput.addEventListener('input', debounce(handleIngredientSearch, 200));
        console.log('Added ingredient search event listener');
    } else {
        console.error('ingredientSearchInput element not found');
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearIngredientSearch);
        console.log('Added clear search event listener');
    } else {
        console.error('clearSearchBtn element not found');
    }
    
    // Event delegation for info buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('info-btn')) {
            const itemName = e.target.dataset.itemName;
            if (itemName) {
                showNutritionDetails(itemName);
            }
        }
    });
}

// Debounce function to limit search frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


// Format nutrition values
function formatNutritionValue(value) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }
    
    if (typeof value === 'number') {
        // Round to 1 decimal place and remove trailing zeros
        return parseFloat(value.toFixed(1)).toString();
    }
    
    return value.toString();
}

// Escape quotes for HTML attributes
function escapeQuotes(text) {
    return text.replace(/"/g, '&quot;');
}

// Note: Loading spinner and error display now handled by Alpine.js reactive system

// Add keyboard navigation support for ingredient search
document.addEventListener('keydown', (e) => {
    // Focus search on Ctrl+F or Cmd+F
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (ingredientSearchInput) {
            ingredientSearchInput.focus();
        }
    }
    
    // Clear filters on Escape
    if (e.key === 'Escape' && ingredientSearchInput) {
        clearIngredientSearch();
    }
});

// Add smooth scrolling for better UX
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Process ingredients from nutrition data
function processIngredients() {
    // Define category mappings based on the new data structure
    const categoryMappings = {
        breads: ['bread'],
        proteins: ['protein'],
        cheeses: ['cheese'],
        vegetables: ['veggies'],
        condiments: ['condiments', 'seasonings']
    };
    
    // Clear existing ingredients
    Object.keys(ingredients).forEach(key => {
        ingredients[key] = [];
    });
    
    // Process each nutrition item
    nutritionData.forEach(item => {
        // Skip items with null or empty Item names (header/metadata entries)
        if (!item.Item) {
            return;
        }
        
        // Categorize ingredients based on category mappings
        for (const [ingredientType, categories] of Object.entries(categoryMappings)) {
            if (categories.includes(item.category)) {
                ingredients[ingredientType].push(item);
                break;
            }
        }
    });
    
    // Note: Ingredient population now handled by Alpine.js templates
}

// Note: Ingredient selection logic now handled by Alpine.js store methods

// Note: Nutrition calculation now handled by Alpine.js reactive computed properties

// Show nutrition details modal
function showNutritionDetails(itemName) {
    const item = nutritionData.find(data => data.Item === itemName);
    if (!item) return;
    
    modalItemName.textContent = item.Item;
    
    // Create nutrition grid
    const nutritionFields = [
        { key: 'Serving Size (g)', label: 'Serving (g)' },
        { key: 'Calories', label: 'Calories' },
        { key: 'Total Fat (g)', label: 'Fat (g)' },
        { key: 'Sat. Fat (g)', label: 'Sat Fat (g)' },
        { key: 'Trans Fat (g)*', label: 'Trans Fat (g)' },
        { key: 'Chol. (mg)', label: 'Cholesterol (mg)' },
        { key: 'Sodium (mg)', label: 'Sodium (mg)' },
        { key: 'Carbohydrate (g)', label: 'Carbs (g)' },
        { key: 'Dietary Fiber (g)', label: 'Fiber (g)' },
        { key: 'Sugars (g)', label: 'Sugars (g)' },
        { key: 'Added Sugars (g)', label: 'Added Sugars (g)' },
        { key: 'Protein (g)', label: 'Protein (g)' },
        { key: 'Vitamin A % DV', label: 'Vit A (%DV)' },
        { key: 'Vitamin C % DV', label: 'Vit C (%DV)' },
        { key: 'Calcium % DV', label: 'Calcium (%DV)' },
        { key: 'Iron % DV', label: 'Iron (%DV)' }
    ];
    
    modalNutritionGrid.innerHTML = nutritionFields.map(field => {
        const value = item[field.key] || 0;
        return `
            <div class="modal-nutrition-item">
                <span class="modal-nutrition-value">${formatNutritionValue(value)}</span>
                <div class="modal-nutrition-label">${field.label}</div>
            </div>
        `;
    }).join('');
    
    nutritionModal.classList.add('show');
}

// Close nutrition details modal
function closeNutritionModal() {
    nutritionModal.classList.remove('show');
}

// Handle ingredient search
function handleIngredientSearch() {
    console.log('handleIngredientSearch called');
    const searchTerm = ingredientSearchInput.value.toLowerCase().trim();
    console.log('Search term:', searchTerm);
    
    // Show/hide clear button
    if (searchTerm) {
        clearSearchBtn.classList.add('visible');
    } else {
        clearSearchBtn.classList.remove('visible');
    }
    
    filterIngredients(searchTerm);
}

// Filter ingredients based on search term
function filterIngredients(searchTerm) {
    console.log('filterIngredients called with term:', searchTerm);
    const allCategories = document.querySelectorAll('.ingredient-category');
    console.log('Found categories:', allCategories.length);
    
    allCategories.forEach(category => {
        const options = category.querySelectorAll('.ingredient-option');
        console.log('Category has options:', options.length);
        let hasVisibleOptions = false;
        
        options.forEach(option => {
            const itemData = JSON.parse(option.dataset.item);
            const itemName = itemData.Item ? itemData.Item.toLowerCase() : '';
            
            // Check if search term matches item name
            const isMatch = !searchTerm || itemName.includes(searchTerm);
            
            if (isMatch) {
                option.classList.remove('hidden');
                hasVisibleOptions = true;
            } else {
                option.classList.add('hidden');
            }
        });
        
        // Hide category if no visible options
        if (!hasVisibleOptions && searchTerm) {
            category.classList.add('hidden');
        } else {
            category.classList.remove('hidden');
        }
    });
}

// Clear ingredient search
function clearIngredientSearch() {
    ingredientSearchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    filterIngredients('');
    ingredientSearchInput.focus();
}

// Export functions for potential future use
window.SubwayNutritionApp = {
    loadNutritionData,
    showNutritionDetails,
    closeNutritionModal,
    clearIngredientSearch
};