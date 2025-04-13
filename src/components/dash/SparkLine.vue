<script setup>
import { computed } from "vue";
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});
const trendData = computed(() => {
  return props.data
    .map((r) => parseFloat(r.efficiency_score))
    .filter((v) => !isNaN(v))
    .slice(0, 10)
    .reverse();
});
const gradients = ["#f72047", "#ffd200", "#1feaea"];
</script>

<template>
  <v-sparkline
    :auto-line-width="false"
    :fill="true"
    :gradient="gradients"
    gradient-direction="top"
    line-width="2"
    :model-value="trendData"
    padding="12"
    smooth="10"
    stroke-linecap="round"
    type="trend"
    auto-draw
    :labels="trendData"
  >
  </v-sparkline>
</template>
