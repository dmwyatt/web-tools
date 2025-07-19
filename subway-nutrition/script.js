// Global variables
let nutritionData = [];
let filteredData = [];
let currentSortField = 'Item';
let currentSortOrder = 'asc';

// DOM elements
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortBySelect = document.getElementById('sortBy');
const sortOrderButton = document.getElementById('sortOrder');
const menuGrid = document.getElementById('menuGrid');
const itemCount = document.getElementById('itemCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const dataDate = document.getElementById('dataDate');

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

// Export functions for potential future use
window.SubwayNutritionApp = {
    loadNutritionData,
    filterAndDisplay,
    scrollToTop
};