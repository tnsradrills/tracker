<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/userData";

const userStore = useUserStore();

const headers = [
  { title: "Date", value: "date" },
  { title: "Exercise", value: "type" },
  { title: "Average Time Per String", value: "avg_time_per_string" },
  { title: "Total Score", value: "total_score" },
  { title: "Hit Factor", value: "total_hit_factor" },
];

const averageTime = computed(() => {
  const runs = userStore.userData.qual_runs ?? [];
  if (!runs.length) return 0;
  return (runs.reduce((sum, r) => sum + r.time, 0) / runs.length).toFixed(2);
});

const averageScore = computed(() => {
  const runs = userStore.userData.qual_runs ?? [];
  if (!runs.length) return 0;
  return (runs.reduce((sum, r) => sum + r.score, 0) / runs.length).toFixed(1);
});
</script>

<template>
  <div>
    <v-container fluid>
      <v-row class="mt-5">
        <!-- Averages -->
        <v-col cols="12" md="6">
          <v-card elevation="2" class="pa-4">
            <div class="text-h6 text-center">Average Score Across All Runs</div>
            <div class="text-h4 font-weight-bold text-center">
              {{ averageTime }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card elevation="2" class="pa-4">
            <div class="text-h6 text-center">
              Average Hit Factor Across All Runs
            </div>
            <div class="text-h4 font-weight-bold text-center">
              {{ averageScore }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title>History</v-card-title>
            <v-data-table
              :headers="headers"
              :items="userStore.userData.qual_runs"
              class="elevation-1"
              :items-per-page="10"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
