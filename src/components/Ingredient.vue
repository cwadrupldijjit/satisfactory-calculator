<template>
    <li class="ingredient">
        <label>Ingredient Name: <input v-model="ingredient.item" @blur="sendRecipeUpdate" ref="inputRef" autofocus /></label>
        <label>Quantity: <input v-model="ingredient.quantity" /></label>
        <label>Rate: {{ ingredient.quantity * multiplier }}</label>
        <label><input type="checkbox" v-model="ingredient.isRaw" @change="updateRecipeList" /> Raw?</label>
        <button
            v-if="!onlyItem"
            :aria-label="`Delete ${ingredient.item ? '' : 'blank'} Ingredient ${ingredient.item || ''}`"
            @click="emit('delete')"
        >
            ❌
        </button>
    </li>
</template>


<script setup lang="ts">
import { inject, Ref, ref, toRefs } from 'vue';
import type { Ingredient } from '../services/calculations';

const props = defineProps<IngredientProps>();
const emit = defineEmits<{
    (event: 'delete'): void;
}>();

const { ingredient, multiplier, onlyItem } = toRefs(props);

const inputRef = ref<HTMLElement>();
const uniqueItems = inject<Ref<Set<string>>>('unique-items');
const updateRecipeList = inject<() => void>('update-recipe-list');
const previousItemName = ref(ingredient.value.item);

function sendRecipeUpdate() {
    if (
        previousItemName.value.toLowerCase() == ingredient.value.item.toLowerCase() ||
        Array.from(uniqueItems.value)
            .map(i => i.toLowerCase())
            .includes(ingredient.value.item.toLowerCase())
    ) {
        return;
    }
    
    previousItemName.value = ingredient.value.item;
    
    updateRecipeList();
}

interface IngredientProps {
    ingredient: Ingredient;
    multiplier: number;
    onlyItem?: boolean;
}
</script>


<style lang="scss" scoped>

</style>
