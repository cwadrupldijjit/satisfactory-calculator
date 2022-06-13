<template>
    <input class="input-heading" v-model="recipes[0].item" />
    
    <recipe-component
        v-for="(recipe, index) of recipes"
        :key="recipe.id"
        :recipe="recipe"
        :is-main="!index" />
    <button @click="reset">Reset</button>
    
    <calculations v-if="recipes.length > 1" :recipes="recipes" />
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import { uid } from 'uid';
import RecipeComponent from './components/Recipe.vue';
import Calculations from './components/Calculations.vue';
import type { Recipe } from './services/calculations';

const recipes = ref<Recipe[]>([]);
const uniqueItems = ref<Set<string>>(new Set());

reset();

provide('update-recipe-list', updateRecipeList);
provide('unique-items', uniqueItems);

function updateRecipeList() {
    uniqueItems.value = new Set(
        recipes.value.flatMap(r => r.ingredients)
            .filter(i => i.item && !i.isRaw)
            .map(i => i.item)
    );
    
    const lowercaseUniqueItems = Array.from(uniqueItems.value)
        .map(i => i.toLowerCase());
    const currentRecipeItemsLowercased = recipes.value.map(r => r.item.toLowerCase());
    
    recipes.value = [
        recipes.value[0],
        ...recipes.value.filter(r => lowercaseUniqueItems.includes(r.item.toLowerCase())),
        ...Array.from(uniqueItems.value)
            .filter(i => !currentRecipeItemsLowercased.some(r => r == i.toLowerCase()))
            .map(i => createRecipeObject(i)),
    ];
}

function reset() {
    recipes.value = [createRecipeObject()];
}
</script>

<script lang="ts">
function createRecipeObject(itemName = ''): Recipe {
    return {
        id: uid(15),
        item: itemName,
        ingredients: [],
        byproducts: [],
        yields: 1,
        minuteRate: 1,
        get multiplier() {
            return this.minuteRate / this.yields;
        }
    };
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
