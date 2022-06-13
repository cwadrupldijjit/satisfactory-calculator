<template>
    <li class="byproduct">
        <label>Item Name: <input v-model="byproduct.item" @blur="sendByproductUpdate" ref="inputRef" autofocus /></label>
        <label>Quantity: <input v-model="byproduct.quantity" /></label>
        <label>Rate: {{ byproduct.quantity * multiplier }}</label>
        <button :aria-label="'Delete Byproduct ' + byproduct.item" @click="emit('delete')">❌</button>
    </li>
</template>


<script setup lang="ts">
import { inject, Ref, ref, toRefs } from 'vue';
import { Byproduct } from '../services/calculations';

const props = defineProps<ByproductProps>();
const emit = defineEmits<{
    (event: 'delete'): void;
}>();

let { multiplier, byproduct } = toRefs(props);

const inputRef = ref<HTMLElement>();
const uniqueItems = inject<Ref<Set<string>>>('unique-items');
const updateRecipeList = inject<() => void>('update-recipe-list');
const previousItemName = ref(byproduct.value.item);

function sendByproductUpdate() {
    if (
        previousItemName.value.toLowerCase() == byproduct.value.item.toLowerCase() ||
        Array.from(uniqueItems.value)
            .map(i => i.toLowerCase())
            .includes(byproduct.value.item.toLowerCase())
    ) {
        return;
    }
    
    previousItemName.value = byproduct.value.item;
    
    updateRecipeList();
}

interface ByproductProps {
    byproduct: Byproduct;
    multiplier: number;
}
</script>


<style lang="scss" scoped>

</style>
