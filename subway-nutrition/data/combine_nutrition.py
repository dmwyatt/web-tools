#!/usr/bin/env python3
import json
import glob
import os

def combine_nutrition_data():
    # Load the nutrition labels
    with open('nutrition-labels.json', 'r') as f:
        labels = json.load(f)
    
    # Initialize the master data list
    master_data = []
    
    # Find all *-nutrition.json files (excluding nutrition-labels.json)
    nutrition_files = glob.glob('*-nutrition.json')
    
    for filename in nutrition_files:
        # Extract category from filename (remove -nutrition.json suffix)
        category = filename.replace('-nutrition.json', '')
        
        print(f"Processing {filename} (category: {category})")
        
        # Load the nutrition data from the file
        with open(filename, 'r') as f:
            items = json.load(f)
        
        # Process each item in the file
        for item in items:
            # Create the new item structure
            new_item = {
                'Item': item['Item'],
                'category': category
            }
            
            # Map each nutrition value to its corresponding label
            nutrition_values = item['Nutrition']
            for i, value in enumerate(nutrition_values):
                if i < len(labels):  # Safety check
                    new_item[labels[i]] = value
            
            master_data.append(new_item)
    
    # Write the master data to a new file
    output_filename = 'master-nutrition.json'
    with open(output_filename, 'w') as f:
        json.dump(master_data, f, indent=2)
    
    print(f"\nSuccessfully created {output_filename} with {len(master_data)} items")
    
    # Print summary by category
    category_counts = {}
    for item in master_data:
        category = item['category']
        category_counts[category] = category_counts.get(category, 0) + 1
    
    print("\nItems per category:")
    for category, count in sorted(category_counts.items()):
        print(f"  {category}: {count} items")

if __name__ == "__main__":
    combine_nutrition_data()
