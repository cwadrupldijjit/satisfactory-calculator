<template>
    <div class="recipe-card">
        <div class="recipe-header">
            <h3 v-if="!isMain">{{ recipeFor || '(name needed)' }}</h3>
            <label>Yield: <input v-model="yields" /></label>
            <label>Per minute: <input v-model="minuteRate" /></label>
            <label>Multiplier: {{ multiplier }}</label>
        </div>
        
        <div class="ingredients-list">
            <h4>Ingredients:</h4>
            <ul>
                <ingredient-component
                    v-for="ingredient of ingredients"
                    :key="ingredient.id"
                    :multiplier="multiplier"
                    :ingredient="ingredient"
                    :only-item="ingredients.length < 2"
                    @delete="removeIngredient(ingredient)" />
                <li class="add-ingredient"><button @click="addIngredient">+ Add ingredient</button></li>
            </ul>
            
            <h4 v-if="byproducts.length">Byproducts:</h4>
            <ul>
                <byproduct-component
                    v-for="byproduct of byproducts"
                    :key="byproduct.id"
                    :multiplier="multiplier"
                    :byproduct="byproduct"
                    @delete="removeByproduct(byproduct)" />
                <li v-if="!byproducts.length" class="add-ingredient">
                    <button @click="addByproduct">+ Add byproduct</button>
                </li>
            </ul>
        </div>
    </div>
</template>


<script setup lang="ts">
import { uid } from 'uid';
import { computed, toRef, toRefs } from 'vue';
import ByproductComponent from './Byproduct.vue';
import IngredientComponent from './Ingredient.vue';
import type { Recipe, Ingredient, Byproduct } from '../services/calculations';

const props = defineProps<RecipeProps>();

const isMain = toRef(props, 'isMain');
const { item: recipeFor, ingredients, byproducts, minuteRate, yields } = toRefs(props.recipe);
const multiplier = computed(() => minuteRate.value / yields.value);

if (!ingredients.value.length) {
    addIngredient();
}

function addIngredient() {
    ingredients.value.push({ id: uid(15), item: '', quantity: 1, isRaw: false });
}

function addByproduct() {
    byproducts.value.push({ id: uid(15), item: '', quantity: 1 });
}

function removeIngredient(ingredient: Ingredient) {
    if (!ingredients.value.includes(ingredient)) return;
    
    ingredients.value.splice(ingredients.value.indexOf(ingredient), 1);
}

function removeByproduct(byproduct: Byproduct) {
    if (!byproducts.value.includes(byproduct)) return;
    
    byproducts.value.splice(byproducts.value.indexOf(byproduct), 1);
}

interface RecipeProps {
    recipe: Recipe;
    isMain?: boolean;
}
</script>


<style lang="scss" scoped>

</style>
