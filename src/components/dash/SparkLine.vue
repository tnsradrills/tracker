<script setup>
import { computed } from "vue";
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  viewingGroup: {
    type: Number,
    required: true,
  },
  groupNames: {
    type: Array,
    required: true,
  },
});
const trendData = computed(() => {
  if (props.viewingGroup == 0) {
    return props.data
      .map((r) => parseFloat(r.total_score_percentage))
      .filter((v) => !isNaN(v))
      .slice(0, 10)
      .reverse();
  }
  return props.data
    .map((r) => parseFloat(r.total_score))
    .filter((v) => !isNaN(v))
    .slice(0, 10)
    .reverse();
});
const gradients = ["#1feaea", "#ffd200", "#f72047"];

const sparklineLabels = computed(() => {
  if (props.viewingGroup === 0) {
    return trendData.value.map((v) => `${v}%`);
  }
  return trendData.value.map((v) => `${v}`); // No % for raw scores
});

const title = computed(() => {
  if (props.viewingGroup == 0) {
    return "Overall Score Percentage Trend";
  } else {
    const name =
      props.groupNames.find((g) => g.id === props.viewingGroup)?.name ||
      "Unknown";
    return "Score Trend For " + name;
  }
});
</script>

<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
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
        :labels="sparklineLabels"
      >
      </v-sparkline>
    </v-card-text>
  </v-card>
</template>
