<script setup>
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userData";
import { useExerciseStore } from "@/stores/exercise.js";
const userStore = useUserStore();
const exerciseStore = useExerciseStore();
const headers = [
  { title: "Date", value: "created_at" },
  { title: "Exercise Group", value: "group_name" },
  { title: "Average Time Per String", value: "avg_time_per_string" },
  { title: "Total Score", value: "total_score" },
  { title: "Total Hit Factor", value: "total_hit_factor" },
];

const viewingGroup = ref(0);

const averageTime = computed(() => {
  const runs = userStore.userData.runs ?? [];
  if (!runs.length) return 0;
  return (runs.reduce((sum, r) => sum + r.time, 0) / runs.length).toFixed(2);
});

const averageScore = computed(() => {
  const runs = userStore.userData.runs ?? [];
  if (!runs.length) return 0;
  return (runs.reduce((sum, r) => sum + r.score, 0) / runs.length).toFixed(1);
});

const runSummaryRows = computed(() => {
  const allRuns = Object.values(userStore.userData.runs ?? {}).flatMap(
    (g) => g.runs || []
  );

  let runsToShow;
  if (viewingGroup.value == 0) {
    runsToShow = allRuns;
  } else {
    runsToShow = allRuns.filter(
      (run) => run.exercise_group_id == viewingGroup.value
    );
  }

  return runsToShow.map((run) => {
    const totalScore = run.run_results.reduce((sum, r) => sum + r.score, 0);
    const totalTime = run.run_results.reduce((sum, r) => sum + r.time_taken, 0);
    const avgTime = totalTime / run.run_results.length;
    const hitFactor = totalScore / totalTime;

    console.log(run);

    return {
      id: run.id,
      created_at: new Date(run.created_at).toLocaleDateString(),
      group_name: run.exercise_groups?.name || "Unknown",
      avg_time_per_string: avgTime.toFixed(2),
      total_score: totalScore.toFixed(1),
      total_hit_factor: hitFactor.toFixed(2),
    };
  });
});

onMounted(() => {
  exerciseStore.getExerciseGroups();
});
</script>

<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            label="Currently Viewing Exercise Group:"
            v-model="viewingGroup"
            :items="exerciseStore.exerciseGroupData.list"
            item-title="name"
            item-value="id"
            :loading="exerciseStore.exerciseGroupData.loading"
          ></v-select>
        </v-col>
      </v-row>
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
              :items="runSummaryRows"
              class="elevation-1"
              :items-per-page="10"
            >
              <template v-slot:item.avg_time_per_string="{ value }">
                {{ value + " seconds" }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
