import { Byproduct, calculateFromRecipes, Ingredient, Recipe } from '../calculations';

describe('calculateFromRecipes', () => {
    test('if all of the ingredients are "raw" (no recipe) and the count per minute is 1, the quantity for all ingredients stay the same', () => {
        const expected = {
            'iron ore': 3,
            'crystal oscillator': 5,
            'uranium ore': 1,
        };
        
        const recipe = createTestRecipe();
        
        recipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'crystal oscillator', quantity: 5 } as Ingredient,
            { item: 'uranium ore', quantity: 1 } as Ingredient,
        );
        
        const result = calculateFromRecipes([ recipe ]);
        
        expect(result).toEqual(expected);
    });
    
    test('if all of the ingredients are raw and the count per minute is 2, the quantity for all ingredients double', () => {
        const expected = {
            'iron ore': 6,
            'crystal oscillator': 10,
            'uranium ore': 2,
        };
        
        const recipe = createTestRecipe();
        
        recipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'crystal oscillator', quantity: 5 } as Ingredient,
            { item: 'uranium ore', quantity: 1 } as Ingredient,
        );
        
        recipe.minuteRate = 2;
        
        const result = calculateFromRecipes([ recipe ]);
        
        expect(result).toEqual(expected);
    });
    
    test('if two recipes are specified, the first having one item per minute but the second one is two, the ingredient quantities for the second recipe should be double that of the derivative ingredient in the first', () => {
        const expected = {
            'iron ore': 3,
            'crystal oscillator': 5,
            'uranium ore': 10,
        };
        
        const mainRecipe = createTestRecipe();
        
        mainRecipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'crystal oscillator', quantity: 5 } as Ingredient,
        );
        
        
        const secondaryRecipe = createTestRecipe();
        secondaryRecipe.item = 'crystal oscillator';
        secondaryRecipe.ingredients.push(
            { item: 'uranium ore', quantity: 1 } as Ingredient,
        );
        secondaryRecipe.minuteRate = 2;
        
        const result = calculateFromRecipes([ mainRecipe, secondaryRecipe ]);
        
        expect(result).toEqual(expected);
    });
    
    test('if two recipes are specified, both having 2 items per minute, the ingredient quantities for the first should double and for the second recipe should quadruple', () => {
        const expected = {
            'iron ore': 6,
            'crystal oscillator': 10,
            'uranium ore': 20,
        };
        
        const mainRecipe = createTestRecipe();
        
        mainRecipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'crystal oscillator', quantity: 5 } as Ingredient,
        );
        
        mainRecipe.minuteRate = 2;
        
        const secondaryRecipe = createTestRecipe();
        secondaryRecipe.item = 'crystal oscillator';
        secondaryRecipe.ingredients.push(
            { item: 'uranium ore', quantity: 1 } as Ingredient,
        );
        secondaryRecipe.minuteRate = 2;
        
        const result = calculateFromRecipes([ mainRecipe, secondaryRecipe ]);
        
        expect(result).toEqual(expected);
    });
    
    test('if two recipes are specified with one item per minute, both specifying one common ingredient, the common ingredient should have a total for both combined', () => {
        const expected = {
            'iron ore': 4,
            'crystal oscillator': 1,
        };
        
        const mainRecipe = createTestRecipe();
        
        mainRecipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'crystal oscillator', quantity: 1 } as Ingredient,
        );
        
        const secondaryRecipe = createTestRecipe();
        secondaryRecipe.item = 'crystal oscillator';
        secondaryRecipe.ingredients.push(
            { item: 'iron ore', quantity: 1 } as Ingredient,
        );
        
        const result = calculateFromRecipes([ mainRecipe, secondaryRecipe ]);
        
        expect(result).toEqual(expected);
    });
    
    test('if two recipes are specified, the first with two items per minute and the second with one and has a number greater than 1 on the first recipe, the ingredients for the second should increase by that many', () => {
        const expected = {
            'iron ore': 3,
            'crystal oscillator': 2,
            'quartz crystal': 4
        };
        
        const mainRecipe = createTestRecipe();
        
        mainRecipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'crystal oscillator', quantity: 2 } as Ingredient,
        );
        
        const secondaryRecipe = createTestRecipe();
        secondaryRecipe.item = 'crystal oscillator';
        secondaryRecipe.ingredients.push(
            { item: 'quartz crystal', quantity: 2 } as Ingredient,
        );
        
        const result = calculateFromRecipes([ mainRecipe, secondaryRecipe ]);
        
        expect(result).toEqual(expected);
    });
    
    test('if the recipe is by itself and byproducts are specified, the byproducts will appear in the totals as negative', () => {
        const expected = {
            'iron ore': 3,
            'crystal oscillator': 5,
            'uranium ore': 1,
            'water': -1,
        };
        
        const recipe = createTestRecipe();
        
        recipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'crystal oscillator', quantity: 5 } as Ingredient,
            { item: 'uranium ore', quantity: 1 } as Ingredient,
        );
        
        recipe.byproducts.push(
            { item: 'water', quantity: 1 } as Byproduct,
        );
        
        const result = calculateFromRecipes([ recipe ]);
        
        expect(result).toEqual(expected);
    });
    
    test('if a sub recipe has a byproduct that is an ingredient for another recipe, the byproduct quantities will decrease the resource demands by the appropriate amount', () => {
        const expected = {
            'iron ore': 3,
            'heavy oil residue': 5,
            'crude oil': 5,
            'water': 0,
        };
        
        const mainRecipe = createTestRecipe();
        
        mainRecipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'heavy oil residue', quantity: 5 } as Ingredient,
            { item: 'water', quantity: 5 } as Ingredient,
        );
        
        const secondaryRecipe = createTestRecipe();
        
        secondaryRecipe.item = 'heavy oil residue';
        
        secondaryRecipe.ingredients.push(
            { item: 'crude oil', quantity: 1 } as Ingredient,
        )
        
        secondaryRecipe.byproducts.push(
            { item: 'water', quantity: 1 } as Byproduct,
        );
        
        const result = calculateFromRecipes([ mainRecipe, secondaryRecipe ]);
        
        expect(result).toEqual(expected);
    });
    
    test('if two recipes are specified with one item per minute, both specifying one common ingredient with different casings, the result will still put them together', () => {
        const expected = {
            'iron ore': 4,
            'crystal oscillator': 1,
            'water': -1,
        };
        
        const mainRecipe = createTestRecipe();
        
        mainRecipe.ingredients.push(
            { item: 'iron ore', quantity: 3 } as Ingredient,
            { item: 'Crystal oscillator', quantity: 1 } as Ingredient,
        );
        
        mainRecipe.byproducts.push(
            { item: 'Water', quantity: 1 } as Byproduct,
        );
        
        const secondaryRecipe = createTestRecipe();
        secondaryRecipe.item = 'crystal oscillator';
        secondaryRecipe.ingredients.push(
            { item: 'Iron Ore', quantity: 1 } as Ingredient,
        );
        
        const result = calculateFromRecipes([ mainRecipe, secondaryRecipe ]);
        
        expect(result).toEqual(expected);
    });
});

function createTestRecipe(): Recipe {
    return {
        ingredients: [],
        id: '',
        item: 'Test Obj',
        byproducts: [],
        yields: 1,
        minuteRate: 1,
        get multiplier() {
            return this.minuteRate / this.yields;
        }
    };
}
