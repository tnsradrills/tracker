<script setup>
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userData";
import { useExerciseStore } from "@/stores/exercise.js";
import MainTable from "@/components/dash/MainTable.vue";
import SparkLine from "@/components/dash/SparkLine.vue";
const userStore = useUserStore();
const exerciseStore = useExerciseStore();

const viewingGroup = ref(0);

const averageTime = computed(() => {
  const runs = userStore.userData.runs ?? [];
  const filteredRuns =
    viewingGroup.value === 0
      ? runs
      : runs.filter((run) => run.exercise_group_id === viewingGroup.value);

  if (!filteredRuns.length) return 0;

  const totalTime = filteredRuns.reduce((sum, run) => {
    return sum + run.run_results.reduce((s, r) => s + r.time_taken, 0);
  }, 0);

  const totalExercises = filteredRuns.reduce(
    (count, run) => count + run.run_results.length,
    0
  );

  return totalExercises ? (totalTime / totalExercises).toFixed(2) : 0;
});

const averageHitFactor = computed(() => {
  const runs = userStore.userData.runs ?? [];
  const filteredRuns =
    viewingGroup.value === 0
      ? runs
      : runs.filter((run) => run.exercise_group_id === viewingGroup.value);

  if (!filteredRuns.length) return 0;

  let totalScore = 0;
  let totalTime = 0;

  filteredRuns.forEach((run) => {
    run.run_results.forEach((result) => {
      const par = result.exercises?.par_time;
      if (par !== null && par !== undefined) {
        totalScore += result.score;
        totalTime += result.time_taken;
      }
    });
  });

  return totalTime > 0 ? (totalScore / totalTime).toFixed(2) : 0;
});

const runSummaryRows = computed(() => {
  const allRuns = userStore.userData.runs ?? [];
  console.log(allRuns);

  const runsToShow =
    viewingGroup.value === 0
      ? allRuns
      : allRuns.filter((run) => run.exercise_group_id === viewingGroup.value);

  return runsToShow.map((run) => {
    const totalScore = run.run_results.reduce((sum, r) => sum + r.score, 0);
    const totalTime = run.run_results.reduce((sum, r) => sum + r.time_taken, 0);
    const hitFactor = totalScore / totalTime;

    let efficiencySum = 0;
    let count = 0;
    run.run_results.forEach((r) => {
      r.efficiency = null;
      const max = r.exercises?.max_points;
      const par = r.exercises?.par_time;
      const scoreRatio = r.score / max;
      const timeRatio = par && r.time_taken > 0 ? par / r.time_taken : 1;
      r.efficiency = (scoreRatio * timeRatio * 100).toFixed(2);
      efficiencySum += scoreRatio * timeRatio;
      count++;
      r.hit_factor = null;
      if (r.exercises?.par_time) {
        r.hit_factor = (r.score / r.time_taken).toFixed(2);
      }
    });

    const avgEfficiency =
      count > 0 ? ((efficiencySum / count) * 100).toFixed(1) : "N/A";

    return {
      id: run.id,
      created_at: new Date(run.created_at).toLocaleDateString(),
      group_name: run.exercise_groups?.name || "Unknown",
      total_score: totalScore.toFixed(1),
      total_hit_factor: hitFactor.toFixed(2),
      efficiency_score: avgEfficiency,
      original: run,
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
            v-model="viewingGroup"
            label="Currently Viewing Exercise Group:"
            :items="exerciseStore.exerciseGroupData.list"
            item-title="name"
            item-value="id"
            :loading="exerciseStore.exerciseGroupData.loading"
          />
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
              {{ averageHitFactor }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Efficiency Score Trend (Last 10 Runs)</v-card-title>
            <v-card-text>
              <SparkLine :data="runSummaryRows" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <MainTable :viewing-group="viewingGroup" :data="runSummaryRows" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
