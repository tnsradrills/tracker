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
  const raw =
    props.viewingGroup == 0
      ? props.data.map((r) => parseFloat(r.total_score_percentage))
      : props.data.map((r) => parseFloat(r.total_score));

  const filtered = raw.filter((v) => typeof v === "number" && !isNaN(v));
  return filtered.slice(0, 10).reverse();
});
const gradients = ["#1feaea", "#ffd200", "#f72047"];

const sparklineLabels = computed(() => {
  return trendData.value.map((v) =>
    props.viewingGroup === 0 ? `${v}%` : `${v}`
  );
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
        auto-draw
        :labels="sparklineLabels"
      >
      </v-sparkline>
    </v-card-text>
  </v-card>
</template>
