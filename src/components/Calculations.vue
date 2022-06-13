<template>
<h2>Calculations</h2>
<p>In order to have {{ props.recipes[0].minuteRate }} items per minute, you will end up</p>

<h3>Needing:</h3>
<table>
    <thead>
        <tr>
            <th>Item</th>
            <th>#/min</th>
            <th>Machines needed</th>
            <th>Machines needed (overclocked)</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="ingredient of requirements" :key="ingredient">
            <td>{{ getPresentableItemName(ingredient) }}</td>
            <td>{{ counts[ingredient] }}</td>
            <td>{{ hasARecipe(ingredient) ? Math.ceil(counts[ingredient] / getRecipe(ingredient).minuteRate) : '-' }}</td>
            <td>{{ hasARecipe(ingredient) ? Math.ceil(counts[ingredient] / (getRecipe(ingredient).minuteRate * 2.5)) : '-' }}</td>
        </tr>
    </tbody>
</table>

<template v-if="byproducts.length">
    <h3>With byproducts:</h3>
    <table>
        <thead>
            <tr class="item-headers">
                <th>Item</th>
                <th>#/min</th>
            </tr>
        </thead>
        <tbody>
            <tr class="item" v-for="byproduct of byproducts" :key="byproduct">
                <td>{{ getPresentableItemName(byproduct) }}</td>
                <td>{{ Math.abs(counts[byproduct]) }}</td>
            </tr>
        </tbody>
    </table>
</template>

<template v-if="recursiveItems.length">
    <h3>Creating and fully consuming:</h3>
    <ul>
        <li class="item" v-for="item of recursiveItems" :key="item">
            {{ getPresentableItemName(item) }}
        </li>
    </ul>
</template>

<pre style="text-align: left">{{ JSON.stringify(counts, null, 4) }}</pre>
</template>


<script setup lang="ts">
import { Recipe, calculateFromRecipes } from '../services/calculations';
import { computed, toRefs, watchPostEffect } from 'vue';

const props = defineProps<CalculationsProps>();

const presentableNames = computed(() => Array.from(new Set(
    props.recipes.flatMap(r => {
        return [
            r.item,
            ...r.ingredients.map(i => i.item),
            ...r.byproducts.map(b => b.item),
        ];
    }),
)));

const counts = computed(() => calculateFromRecipes(props.recipes));

const { requirements, byproducts, recursiveItems } = toRefs({ requirements: [], byproducts: [], recursiveItems: [] });

watchPostEffect(() => {
    requirements.value = [];
    byproducts.value = [];
    recursiveItems.value = [];
    
    for (const [ item = 'Unnamed', count ] of Object.entries(counts.value)) {
        if (count > 0) {
            requirements.value.push(item);
        }
        else if (count < 0) {
            byproducts.value.push(item);
        }
        else {
            recursiveItems.value.push(item);
        }
    }
});

/**
 * @param item the lowercase version of a recipe item
 */
function hasARecipe(item: string) {
    return props.recipes.some(r => r.item.toLowerCase() == item);
}

/**
 * @param item the lowercase version of a recipe item
 */
function getRecipe(item: string) {
    return props.recipes.find(r => r.item.toLowerCase() == item);
}

/**
 * @param item the lowercase version of a recipe item
 */
function getPresentableItemName(item: string) {
    return presentableNames.value.find(n => n.toLowerCase() == item) ?? item;
}

interface CalculationsProps {
    recipes: Recipe[];
}
</script>


<style scoped lang="scss">

</style>
