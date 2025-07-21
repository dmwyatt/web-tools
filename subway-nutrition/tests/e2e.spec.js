const { test, expect } = require('@playwright/test');

test.describe('Subway Nutrition Guide', () => {
  test.beforeEach(async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'https://dmwyatt.github.io/web-tools/subway-nutrition/';
    await page.goto(baseUrl);
    // Wait for the loading spinner to disappear (indicating data has loaded)
    await page.waitForSelector('#loadingSpinner', { state: 'hidden', timeout: 10000 });
    // Wait for the build section to be visible
    await page.waitForSelector('#buildSection', { state: 'visible' });
  });

  test('should load the app and display main components', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('Subway Nutrition Guide');
    
    // Check that ingredient categories are visible
    await expect(page.locator('h3:has-text("Bread")')).toBeVisible();
    await expect(page.locator('h3:has-text("Protein")')).toBeVisible();
    await expect(page.locator('h3:has-text("Cheese")')).toBeVisible();
    await expect(page.locator('h3:has-text("Vegetables")')).toBeVisible();
    await expect(page.locator('h3:has-text("Condiments")')).toBeVisible();
    
    // Check nutrition summary section
    await expect(page.locator('h3:has-text("Your Custom Sandwich")')).toBeVisible();
    await expect(page.locator('h4:has-text("Total Nutrition")')).toBeVisible();
  });

  test('should allow ingredient selection and update nutrition totals', async ({ page }) => {
    // Select a bread
    const breadButton = page.locator('#breadOptions .add-btn').first();
    await breadButton.click();
    
    // Verify bread appears in selected ingredients
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(1);
    
    // Select a protein
    const proteinButton = page.locator('#proteinOptions .add-btn').first();
    await proteinButton.click();
    
    // Verify both ingredients appear
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(2);
    
    // Check that nutrition totals are no longer zero
    const caloriesValue = page.locator('#totalNutrition .nutrition-value').first();
    await expect(caloriesValue).not.toHaveText('0');
  });

  test('should allow ingredient removal', async ({ page }) => {
    // Select an ingredient
    const breadButton = page.locator('#breadOptions .add-btn').first();
    await breadButton.click();
    
    // Verify ingredient is selected
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(1);
    
    // Remove the ingredient
    const removeButton = page.locator('#selectedIngredients .remove-ingredient').first();
    await removeButton.click();
    
    // Verify ingredient is removed
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(0);
    await expect(page.locator('#selectedIngredients .placeholder')).toBeVisible();
    
    // Verify nutrition totals reset to zero
    const caloriesValue = page.locator('#totalNutrition .nutrition-value').first();
    await expect(caloriesValue).toHaveText('0');
  });

  test('should clear all ingredients', async ({ page }) => {
    // Select multiple ingredients
    await page.locator('#breadOptions .add-btn').first().click();
    await page.locator('#proteinOptions .add-btn').first().click();
    await page.locator('#cheeseOptions .add-btn').first().click();
    
    // Verify multiple ingredients selected
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(3);
    
    // Clear all
    await page.locator('#clearAll').click();
    
    // Verify all ingredients removed
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(0);
    await expect(page.locator('#selectedIngredients .placeholder')).toBeVisible();
    
    // Verify nutrition totals reset
    const caloriesValue = page.locator('#totalNutrition .nutrition-value').first();
    await expect(caloriesValue).toHaveText('0');
  });

  test('should open and close nutrition modal', async ({ page }) => {
    // Click info button on first bread item
    const infoButton = page.locator('#breadOptions .info-btn').first();
    await infoButton.click();
    
    // Verify modal opens
    await expect(page.locator('#nutritionModal')).toHaveClass(/show/);
    await expect(page.locator('#modalItemName')).not.toBeEmpty();
    
    // Verify modal has nutrition data (should have at least some items)
    const nutritionItemCount = await page.locator('#modalNutritionGrid .modal-nutrition-item').count();
    expect(nutritionItemCount).toBeGreaterThan(0);
    
    // Close modal using close button
    await page.locator('#closeModal').click();
    
    // Verify modal closes
    await expect(page.locator('#nutritionModal')).not.toHaveClass(/show/);
  });

  test('should close modal with escape key', async ({ page }) => {
    // Open modal
    await page.locator('#breadOptions .info-btn').first().click();
    await expect(page.locator('#nutritionModal')).toHaveClass(/show/);
    
    // Close with escape key
    await page.keyboard.press('Escape');
    
    // Verify modal closes
    await expect(page.locator('#nutritionModal')).not.toHaveClass(/show/);
  });

  test('should filter ingredients with search', async ({ page }) => {
    // Get initial count of visible bread options
    const initialBreadCount = await page.locator('#breadOptions .ingredient-option').count();
    
    // Search for specific ingredient
    await page.locator('#ingredientSearch').fill('italian');
    
    // Wait for filter to apply
    await page.waitForTimeout(300); // Allow for debounce
    
    // Verify filtered results (should be fewer than initial)
    const filteredBreadCount = await page.locator('#breadOptions .ingredient-option:not(.hidden)').count();
    expect(filteredBreadCount).toBeLessThan(initialBreadCount);
    
    // Clear search
    await page.locator('#clearSearch').click();
    
    // Verify all options visible again
    const finalBreadCount = await page.locator('#breadOptions .ingredient-option:not(.hidden)').count();
    expect(finalBreadCount).toBe(initialBreadCount);
  });

  test('should calculate nutrition totals correctly', async ({ page }) => {
    // Select ingredients with known values
    await page.locator('#breadOptions .add-btn').first().click();
    await page.locator('#proteinOptions .add-btn').first().click();
    
    // Get individual ingredient nutrition values from their display text
    const breadNutrition = await page.locator('#breadOptions .ingredient-option.selected .ingredient-nutrition').textContent();
    const proteinNutrition = await page.locator('#proteinOptions .ingredient-option.selected .ingredient-nutrition').textContent();
    
    // Parse calories from the nutrition text (format: "XXX cal, ...")
    const breadCalories = parseInt(breadNutrition.match(/(\d+)\s*cal/)[1]);
    const proteinCalories = parseInt(proteinNutrition.match(/(\d+)\s*cal/)[1]);
    
    const expectedTotal = breadCalories + proteinCalories;
    
    // Verify total matches expected sum
    const totalCalories = await page.locator('#totalNutrition .nutrition-value').first().textContent();
    expect(parseInt(totalCalories)).toBe(expectedTotal);
  });

  test('should display additional nutrition details', async ({ page }) => {
    // Select an ingredient to get some nutrition values
    await page.locator('#breadOptions .add-btn').first().click();
    
    // Verify main nutrition is visible
    await expect(page.locator('#totalNutrition .nutrition-value').first()).not.toHaveText('0');
    
    // Open additional nutrition details
    await page.locator('details summary').click();
    
    // Verify additional nutrition section is visible
    await expect(page.locator('#additionalNutrition')).toBeVisible();
    
    // Verify additional nutrition has values
    const servingSize = page.locator('#additionalNutrition .nutrition-value').first();
    await expect(servingSize).not.toHaveText('0');
  });

  test('should handle empty search gracefully', async ({ page }) => {
    // Search for something that doesn't exist
    await page.locator('#ingredientSearch').fill('nonexistentingredient');
    await page.waitForTimeout(300);
    
    // Verify categories are hidden when no matches
    const visibleCategories = await page.locator('.ingredient-category:not(.hidden)').count();
    expect(visibleCategories).toBe(0);
    
    // Clear search
    await page.locator('#ingredientSearch').fill('');
    await page.waitForTimeout(300);
    
    // Verify categories are visible again
    const categoriesAfterClear = await page.locator('.ingredient-category:not(.hidden)').count();
    expect(categoriesAfterClear).toBeGreaterThan(0);
  });

  test('should prevent multiple bread selections', async ({ page }) => {
    // Get the first three bread options
    const firstBread = page.locator('#breadOptions .add-btn').first();
    const secondBread = page.locator('#breadOptions .add-btn').nth(1);
    const thirdBread = page.locator('#breadOptions .add-btn').nth(2);
    
    // Select first bread
    await firstBread.click();
    
    // Verify first bread is selected
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(1);
    
    // Select second bread
    await secondBread.click();
    
    // Verify only one bread is selected (second bread should replace first)
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(1);
    
    // Verify that the first bread is no longer selected in the UI
    const firstBreadOption = page.locator('#breadOptions .ingredient-option').first();
    await expect(firstBreadOption).not.toHaveClass(/selected/);
    
    // Verify that the second bread is selected in the UI
    const secondBreadOption = page.locator('#breadOptions .ingredient-option').nth(1);
    await expect(secondBreadOption).toHaveClass(/selected/);
    
    // Select third bread - should replace second bread
    await thirdBread.click();
    
    // Still should only have 1 bread selected
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(1);
    
    // Verify second bread is no longer selected, third bread is selected
    await expect(secondBreadOption).not.toHaveClass(/selected/);
    const thirdBreadOption = page.locator('#breadOptions .ingredient-option').nth(2);
    await expect(thirdBreadOption).toHaveClass(/selected/);
    
    // Click on the currently selected (third) bread - should deselect it
    await thirdBread.click();
    
    // Should have no breads selected
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(0);
    await expect(thirdBreadOption).not.toHaveClass(/selected/);
    
    // Test with non-bread ingredients to ensure they still allow multiple selections
    await page.locator('#proteinOptions .add-btn').first().click();
    await page.locator('#proteinOptions .add-btn').nth(1).click();
    
    // Should now have 2 proteins = 2 total
    await expect(page.locator('#selectedIngredients .selected-ingredient')).toHaveCount(2);
  });
});