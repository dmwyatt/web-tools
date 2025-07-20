// Legacy global variables - now handled by Alpine.js store

// Note: App initialization now handled by Alpine.js store init() method

// Note: Debounce function no longer needed - Alpine.js reactivity is instant
// Note: formatNutritionValue now handled by Alpine.js store method
// Note: escapeQuotes no longer needed - Alpine.js handles HTML safety

// Add keyboard navigation support for ingredient search
document.addEventListener('keydown', (e) => {
    // Focus search on Ctrl+F or Cmd+F
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('ingredientSearch');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Clear filters on Escape if modal is not open - now uses Alpine store
    if (e.key === 'Escape') {
        if (Alpine && Alpine.store('nutritionApp')) {
            const store = Alpine.store('nutritionApp');
            if (store.modalOpen) {
                store.closeNutritionModal();
            } else {
                store.clearSearch();
            }
        }
    }
});

// Note: scrollToTop function unused and removed
// Note: processIngredients now handled by Alpine.js store method

// Note: Ingredient selection logic now handled by Alpine.js store methods

// Note: Nutrition calculation now handled by Alpine.js reactive computed properties

// Note: Modal functionality now handled by Alpine.js reactive system

// Note: Search functionality now handled by Alpine.js reactive computed properties

// Note: Export object removed - Alpine.js store provides all functionality