// Global variables
let nutritionData = [];
let filteredData = [];
let currentSortField = 'Item';
let currentSortOrder = 'asc';
let ingredients = {
    breads: [],
    proteins: [],
    cheeses: [],
    vegetables: [],
    condiments: []
};
let selectedIngredients = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortBySelect = document.getElementById('sortBy');
const sortOrderButton = document.getElementById('sortOrder');
const menuGrid = document.getElementById('menuGrid');
const itemCount = document.getElementById('itemCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const dataDate = document.getElementById('dataDate');

// New elements for sandwich builder
const browseModeBtn = document.getElementById('browseMode');
const buildModeBtn = document.getElementById('buildMode');
const browseSection = document.getElementById('browseSection');
const buildSection = document.getElementById('buildSection');
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
        populateCategoryFilter();
        displayMenuItems();
        hideLoading();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to load nutrition data. Please try again later.');
    }
});

// Load nutrition data from JSON file
async function loadNutritionData() {
    try {
        const response = await fetch('subway_nutrition.json');
        if (!response.ok) {
            throw new Error('Failed to fetch nutrition data');
        }
        const data = await response.json();
        nutritionData = data.items;
        filteredData = [...nutritionData];
        
        // Set the data generation date
        if (data.generated) {
            dataDate.textContent = data.generated;
        }
        
        // Process ingredients for sandwich builder
        processIngredients();
    } catch (error) {
        throw new Error('Could not load nutrition data: ' + error.message);
    }
}

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    categoryFilter.addEventListener('change', handleCategoryFilter);
    sortBySelect.addEventListener('change', handleSort);
    sortOrderButton.addEventListener('click', toggleSortOrder);
    
    // Mode toggle listeners
    browseModeBtn.addEventListener('click', () => switchMode('browse'));
    buildModeBtn.addEventListener('click', () => switchMode('build'));
    clearAllBtn.addEventListener('click', clearAllIngredients);
    
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

// Populate category filter dropdown
function populateCategoryFilter() {
    const categories = [...new Set(nutritionData.map(item => item.Category))].sort();
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Handle search input
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    filterAndDisplay();
}

// Handle category filter
function handleCategoryFilter() {
    filterAndDisplay();
}

// Handle sorting
function handleSort() {
    currentSortField = sortBySelect.value;
    filterAndDisplay();
}

// Toggle sort order
function toggleSortOrder() {
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    sortOrderButton.textContent = currentSortOrder === 'asc' ? '↑ Asc' : '↓ Desc';
    filterAndDisplay();
}

// Filter and display menu items
function filterAndDisplay() {
    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    let filtered = nutritionData.filter(item => 
        item.Item.toLowerCase().includes(searchTerm) ||
        item.Category.toLowerCase().includes(searchTerm)
    );

    // Apply category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory) {
        filtered = filtered.filter(item => item.Category === selectedCategory);
    }

    // Sort the data
    filtered.sort((a, b) => {
        let aValue = a[currentSortField];
        let bValue = b[currentSortField];

        // Handle string sorting
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        // Handle number sorting
        if (typeof aValue === 'number') {
            return currentSortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Handle string sorting
        if (currentSortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    filteredData = filtered;
    displayMenuItems();
}

// Display menu items
function displayMenuItems() {
    menuGrid.innerHTML = '';
    
    // Update item count
    itemCount.textContent = `Showing ${filteredData.length} of ${nutritionData.length} items`;

    // Create menu item cards
    filteredData.forEach((item, index) => {
        const menuItemElement = createMenuItemElement(item, index);
        menuGrid.appendChild(menuItemElement);
    });
}

// Create individual menu item element
function createMenuItemElement(item, index) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.style.animationDelay = `${index * 0.05}s`;

    // Key nutrition facts to highlight
    const keyNutrition = [
        { key: 'Calories', label: 'Calories', class: 'calories' },
        { key: 'Total Fat (g)', label: 'Fat (g)', class: 'fat' },
        { key: 'Sodium (mg)', label: 'Sodium (mg)', class: 'sodium' },
        { key: 'Carbohydrates (g)', label: 'Carbs (g)', class: 'carbs' },
        { key: 'Protein (g)', label: 'Protein (g)', class: 'protein' }
    ];

    // Additional nutrition facts
    const additionalNutrition = [
        { key: 'Saturated Fat (g)', label: 'Sat Fat (g)' },
        { key: 'Cholesterol (mg)', label: 'Cholesterol (mg)' },
        { key: 'Dietary Fiber (g)', label: 'Fiber (g)' },
        { key: 'Total Sugars (g)', label: 'Sugars (g)' },
        { key: 'Vitamin D (%DV)', label: 'Vit D (%DV)' },
        { key: 'Calcium (%DV)', label: 'Calcium (%DV)' },
        { key: 'Iron (%DV)', label: 'Iron (%DV)' },
        { key: 'Potassium (%DV)', label: 'Potassium (%DV)' }
    ];

    menuItem.innerHTML = `
        <h3>${item.Item}</h3>
        <div class="category-badge">${item.Category}</div>
        
        <div class="nutrition-grid">
            ${keyNutrition.map(nutrient => `
                <div class="nutrition-item ${nutrient.class}">
                    <span class="nutrition-value">${formatNutritionValue(item[nutrient.key])}</span>
                    <div class="nutrition-label">${nutrient.label}</div>
                </div>
            `).join('')}
        </div>
        
        <details style="margin-top: 1rem;">
            <summary style="cursor: pointer; font-weight: 600; color: #00873b;">More Nutrition Info</summary>
            <div class="nutrition-grid" style="margin-top: 0.75rem;">
                <div class="nutrition-item">
                    <span class="nutrition-value">${formatNutritionValue(item['Serving Size (g)'])}</span>
                    <div class="nutrition-label">Serving (g)</div>
                </div>
                ${additionalNutrition.map(nutrient => `
                    <div class="nutrition-item">
                        <span class="nutrition-value">${formatNutritionValue(item[nutrient.key])}</span>
                        <div class="nutrition-label">${nutrient.label}</div>
                    </div>
                `).join('')}
            </div>
        </details>
    `;

    return menuItem;
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

// Hide loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Show error message
function showError(message) {
    loadingSpinner.innerHTML = `<div style="color: #dc3545; font-weight: 600;">❌ ${message}</div>`;
}

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Focus search on Ctrl+F or Cmd+F
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Clear filters on Escape
    if (e.key === 'Escape') {
        searchInput.value = '';
        categoryFilter.value = '';
        filterAndDisplay();
    }
});

// Add smooth scrolling for better UX
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Process ingredients from nutrition data
function processIngredients() {
    // Define category mappings based on the categories file
    const categoryMappings = {
        breads: ['Breads', 'Bread'],
        proteins: [
            'Individual Proteins',
            'Chicken',
            'Amount on 6" sandwich or Wrap'
        ],
        cheeses: ['Cheese'],
        vegetables: ['Vegetables'],
        condiments: [
            'Seasonings and Spices',
            'Amount on 6" sandwich or Wrap. Double values for footlong nutrition information (one footlong=two 6" servings). Double Sandwich Condiments and Toppings sauce values for salad dressing portion'
        ]
    };
    
    // Clear existing ingredients
    Object.keys(ingredients).forEach(key => {
        ingredients[key] = [];
    });
    
    // Process each nutrition item
    nutritionData.forEach(item => {
        // Categorize ingredients based on category mappings
        for (const [ingredientType, categories] of Object.entries(categoryMappings)) {
            if (categories.some(category => 
                item.Category.toLowerCase().includes(category.toLowerCase()) ||
                category.toLowerCase().includes(item.Category.toLowerCase())
            )) {
                ingredients[ingredientType].push(item);
                break;
            }
        }
    });
    
    // Populate ingredient options
    populateIngredientOptions();
}

// Populate ingredient options in the UI
function populateIngredientOptions() {
    populateCategory('bread', ingredients.breads, breadOptions);
    populateCategory('protein', ingredients.proteins, proteinOptions);
    populateCategory('cheese', ingredients.cheeses, cheeseOptions);
    populateCategory('vegetable', ingredients.vegetables, vegetableOptions);
    populateCategory('condiment', ingredients.condiments, condimentOptions);
}

// Populate a specific ingredient category
function populateCategory(type, items, container) {
    container.innerHTML = '';
    
    items.forEach(item => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'ingredient-option';
        optionDiv.dataset.type = type;
        optionDiv.dataset.item = JSON.stringify(item);
        
        optionDiv.innerHTML = `
            <div class="ingredient-info">
                <div class="ingredient-name">${item.Item}</div>
                <div class="ingredient-nutrition">
                    ${formatNutritionValue(item.Calories)} cal, 
                    ${formatNutritionValue(item['Total Fat (g)'])}g fat, 
                    ${formatNutritionValue(item['Sodium (mg)'])}mg sodium
                </div>
            </div>
            <button class="add-btn" onclick="toggleIngredient(this)"></button>
        `;
        
        container.appendChild(optionDiv);
    });
}

// Toggle ingredient selection
function toggleIngredient(button) {
    const optionDiv = button.parentElement;
    const isSelected = optionDiv.classList.contains('selected');
    const itemData = JSON.parse(optionDiv.dataset.item);
    
    if (isSelected) {
        // Remove ingredient
        optionDiv.classList.remove('selected');
        selectedIngredients = selectedIngredients.filter(ingredient => 
            ingredient.Item !== itemData.Item
        );
    } else {
        // Add ingredient
        optionDiv.classList.add('selected');
        selectedIngredients.push(itemData);
    }
    
    updateSelectedIngredients();
    updateTotalNutrition();
}

// Update selected ingredients display
function updateSelectedIngredients() {
    if (selectedIngredients.length === 0) {
        selectedIngredientsDiv.innerHTML = '<p class="placeholder">Select ingredients to build your sandwich</p>';
        return;
    }
    
    selectedIngredientsDiv.innerHTML = selectedIngredients.map(ingredient => `
        <div class="selected-ingredient">
            <span class="selected-ingredient-name">${ingredient.Item}</span>
            <button class="remove-ingredient" onclick="removeIngredient('${ingredient.Item}')" title="Remove ingredient">×</button>
        </div>
    `).join('');
}

// Remove specific ingredient
function removeIngredient(itemName) {
    // Remove from selected ingredients
    selectedIngredients = selectedIngredients.filter(ingredient => ingredient.Item !== itemName);
    
    // Update UI
    const ingredientOptions = document.querySelectorAll('.ingredient-option');
    ingredientOptions.forEach(option => {
        const itemData = JSON.parse(option.dataset.item);
        if (itemData.Item === itemName) {
            option.classList.remove('selected');
        }
    });
    
    updateSelectedIngredients();
    updateTotalNutrition();
}

// Clear all selected ingredients
function clearAllIngredients() {
    selectedIngredients = [];
    
    // Remove selected class from all options
    const ingredientOptions = document.querySelectorAll('.ingredient-option');
    ingredientOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    updateSelectedIngredients();
    updateTotalNutrition();
}

// Update total nutrition display
function updateTotalNutrition() {
    const totals = {
        'Calories': 0,
        'Total Fat (g)': 0,
        'Sodium (mg)': 0,
        'Carbohydrates (g)': 0,
        'Protein (g)': 0
    };
    
    selectedIngredients.forEach(ingredient => {
        Object.keys(totals).forEach(nutrient => {
            const value = parseFloat(ingredient[nutrient]) || 0;
            totals[nutrient] += value;
        });
    });
    
    // Update the display
    const nutritionItems = totalNutritionDiv.querySelectorAll('.nutrition-item');
    const labels = ['Calories', 'Fat (g)', 'Sodium (mg)', 'Carbs (g)', 'Protein (g)'];
    const keys = ['Calories', 'Total Fat (g)', 'Sodium (mg)', 'Carbohydrates (g)', 'Protein (g)'];
    
    nutritionItems.forEach((item, index) => {
        const valueSpan = item.querySelector('.nutrition-value');
        valueSpan.textContent = formatNutritionValue(totals[keys[index]]);
    });
}

// Switch between browse and build modes
function switchMode(mode) {
    if (mode === 'browse') {
        browseModeBtn.classList.add('active');
        buildModeBtn.classList.remove('active');
        browseSection.classList.add('active');
        buildSection.classList.remove('active');
    } else {
        buildModeBtn.classList.add('active');
        browseModeBtn.classList.remove('active');
        buildSection.classList.add('active');
        browseSection.classList.remove('active');
    }
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
            const itemName = itemData.Item.toLowerCase();
            
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
    filterAndDisplay,
    scrollToTop,
    toggleIngredient,
    removeIngredient,
    clearAllIngredients,
    switchMode,
    clearIngredientSearch
};