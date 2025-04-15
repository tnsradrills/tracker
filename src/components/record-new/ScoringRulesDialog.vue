<script setup>
import { computed } from "vue";
const props = defineProps({
  modelValue: Boolean,
  text: {
    type: String,
    default: null,
  },
});
const emit = defineEmits(["update:modelValue"]);
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <v-dialog v-model="isOpen" width="auto">
    <v-card>
      <v-card-title>Scoring Rules</v-card-title>
      <v-card-text>
        {{ props.text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="isOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
