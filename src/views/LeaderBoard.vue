<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useExerciseStore } from "@/stores/exercise.js";
import { useLeaderboardStore } from "@/stores/leaderboard.js";
import { useRegionStore } from "@/stores/regionData.js";
const regionStore = useRegionStore();
const leaderboardStore = useLeaderboardStore();
const exerciseStore = useExerciseStore();

const selectedGroup = ref(1);
const selectedRegion = ref(null);
const selectedMetric = ref("match_percentage");

const leaderboardRaw = ref([]);

const metricOptions = ref([
  {
    text: "Latest Match Percentage",
    value: "match_percentage",
  },
  {
    text: "Weighted Match Percentage",
    value: "weighted_match_percentage",
  },
  {
    text: "Average Score",
    value: "average_score",
  },
  {
    text: "Top Score",
    value: "total_score",
  },
]);

const headers = [
  { title: "Rank", value: "position" },
  { title: "User", value: "display_name" },
  { title: "Region", value: "region" },
  { title: "Latest Match Percentage", value: "match_percentage" },
  { title: "Weighted Match Percentage", value: "weighted_match_percentage" },
  { title: "Avg Score", value: "average_score" },
  { title: "Summed Total Score", value: "total_score" },
  { title: "# of Attempts", value: "run_count" },
];

const loadLeaderboard = async () => {
  if (!selectedGroup.value) return;
  await leaderboardStore.fetchLeaderboard(
    selectedGroup.value,
    selectedRegion.value,
    selectedMetric.value
  );
  leaderboardRaw.value = leaderboardStore.leaderboard;
};

const filteredLeaderboard = computed(() => {
  let filtered = leaderboardRaw.value;

  if (selectedRegion.value !== null) {
    filtered = filtered.filter((r) => r.region === selectedRegion.value);
  }

  const sorted = [...filtered].sort(
    (a, b) => b[selectedMetric.value] - a[selectedMetric.value]
  );

  return sorted.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
});

const leaderboardUnder5 = computed(() =>
  filteredLeaderboard.value.filter((entry) => entry.run_count < 5)
);

const leaderboard5Plus = computed(() =>
  filteredLeaderboard.value.filter((entry) => entry.run_count >= 5)
);

const prependedRegionList = computed(() => {
  return [
    { id: null, name: "All regions" },
    ...regionStore.regionListData.list,
  ];
});

const filteredExerciseGroupList = computed(() => {
  return exerciseStore.exerciseGroupData.list.slice(1);
});

watch([selectedGroup], loadLeaderboard, {
  immediate: true,
});

const findRegion = (row) => {
  return (
    regionStore.regionListData.list.find((r) => r.id == row)?.name || "Unknown"
  );
};

onMounted(() => {
  if (regionStore.regionListData?.list.length < 1) {
    regionStore.retrieveRegionList();
  }
  if (exerciseStore.exerciseGroupData.list.length === 1) {
    exerciseStore.getExerciseGroups();
  }
  loadLeaderboard();
});
</script>

<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title class="text-h5 font-weight-bold">Leaderboards</v-card-title>

      <v-row class="mt-3">
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedGroup"
            :items="filteredExerciseGroupList"
            item-title="name"
            item-value="id"
            label="Exercise Group"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="selectedRegion"
            :items="prependedRegionList"
            :loading="regionStore.regionListData.loading"
            item-title="name"
            item-value="id"
            label="Region"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="selectedMetric"
            :items="metricOptions"
            item-value="value"
            item-title="text"
            label="Ranking Metric"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mt-5" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        5 - 10 Attempts
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="leaderboard5Plus"
        class="elevation-1"
        item-value="alt_user_id"
        dense
        :loading="leaderboardStore.loading"
        items-per-page-text="Rows per page"
        :hide-default-footer="leaderboard5Plus.length <= 10"
      >
        <template #header.weighted_match_percentage>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <span v-bind="props"> Weighted Match % </span>
            </template>
            <span>
              Calculated by comparing your <strong>4 best runs</strong> to the
              top shooter's 4 best runs, scaled by how many attempts you've
              made. Encourages practice without punishing activity.
            </span>
          </v-tooltip>
        </template>
        <template #loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
        <template #item.position="{ item }">
          <span class="font-weight-bold">#{{ item.position }}</span>
        </template>
        <template #item.match_percentage="{ item }">
          {{ item.match_percentage }}%
        </template>
        <template #item.weighted_match_percentage="{ item }">
          {{ item.weighted_match_percentage }}%
        </template>
        <template #item.total_score="{ item }">
          {{ item.total_score + " / " + item.total_possible }}
        </template>
        <template #item.region="{ item }">
          {{ findRegion(item.region) }}
        </template>
      </v-data-table>
    </v-card>

    <v-card class="mt-5" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        1 - 4 Attempts
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="leaderboardUnder5"
        class="elevation-1"
        item-value="alt_user_id"
        dense
        :loading="leaderboardStore.loading"
        items-per-page-text="Rows per page"
        :hide-default-footer="leaderboardUnder5.length <= 10"
      >
        <template #loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
        <template #header.weighted_match_percentage>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <span v-bind="props"> Weighted Match % </span>
            </template>
            <span>
              Calculated by comparing your <strong>4 best runs</strong> to the
              top shooter's 4 best runs, scaled by how many attempts you've
              made. Encourages practice without punishing activity.
            </span>
          </v-tooltip>
        </template>
        <template #item.position="{ item }">
          <span class="font-weight-bold">#{{ item.position }}</span>
        </template>
        <template #item.weighted_match_percentage="{ item }">
          {{ item.weighted_match_percentage }}%
        </template>
        <template #item.match_percentage="{ item }">
          {{ item.match_percentage }}%
        </template>
        <template #item.total_score="{ item }">
          {{ item.total_score + " / " + item.total_possible }}
        </template>
        <template #item.region="{ item }">
          {{ findRegion(item.region) }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
