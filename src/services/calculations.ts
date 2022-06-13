export function calculateFromRecipes(recipes: Recipe[]) {
    const mainRecipe = recipes[0];
    const resourcesWithRecipies = recipes.slice(1)
        .reduce((map, r) => {
            map[r.item.toLowerCase()] = r;
            return map;
        }, {} as Record<string, Recipe>);
    
    const perMinuteTotals = Object.fromEntries(
        Object.keys(resourcesWithRecipies)
            .map(key => [
                key,
                0,
            ]),
    );
    
    addUpIngredients(mainRecipe, 1);
    
    return perMinuteTotals;
    
    function addUpIngredients(recipe: Recipe, accumulatedMultiplier: number) {
        for (const ingredient of recipe.ingredients) {
            const lowerItemName = ingredient.item.toLowerCase();
            // this includes raw resources, which aren't included in the "resourcesWithRecipes" object above
            if (!(lowerItemName in perMinuteTotals)) {
                perMinuteTotals[lowerItemName] = 0;
            }
            
            const itemQuantity = (ingredient.quantity * recipe.multiplier) * accumulatedMultiplier;
            
            perMinuteTotals[lowerItemName] += itemQuantity;
            
            // only recurse if there are recipes registered for the resource
            if (lowerItemName in resourcesWithRecipies) {
                addUpIngredients(resourcesWithRecipies[lowerItemName], itemQuantity);
            }
        }
        
        for (const byproduct of recipe.byproducts) {
            const lowerItemName = byproduct.item.toLowerCase();
            
            if (!(lowerItemName in perMinuteTotals)) {
                perMinuteTotals[lowerItemName] = 0;
            }
            
            perMinuteTotals[lowerItemName] -= (byproduct.quantity * recipe.multiplier) * accumulatedMultiplier;
        }
    }
}


export interface Recipe {
    id: string;
    item: string;
    ingredients: Ingredient[];
    byproducts: Byproduct[];
    yields: number;
    minuteRate: number;
    multiplier: number;
}

export interface Ingredient {
    id: string;
    item: string;
    quantity: number;
    isRaw: boolean;
}

export interface Byproduct {
    id: string;
    item: string;
    quantity: number;
}
