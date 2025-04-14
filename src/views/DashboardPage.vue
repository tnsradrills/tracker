<script setup>
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userData";
import { useExerciseStore } from "@/stores/exercise.js";
import MainTable from "@/components/dash/MainTable.vue";
import SparkLine from "@/components/dash/SparkLine.vue";

const userStore = useUserStore();
const exerciseStore = useExerciseStore();
const viewingGroup = ref(0);

// Centralized filtered runs
const filteredRuns = computed(() => {
  const runs = userStore.userData.runs ?? [];
  return viewingGroup.value === 0
    ? runs
    : runs.filter((run) => run.exercise_group_id === viewingGroup.value);
});

const averageScorePercentage = computed(() => {
  const validRuns = filteredRuns.value.filter((run) =>
    run.run_results.some(
      (r) =>
        typeof r.score === "number" &&
        typeof r.exercises?.max_points === "number"
    )
  );

  if (!validRuns.length) return "N/A";

  const totalPercent = validRuns.reduce((sum, run) => {
    const { total, max } = run.run_results.reduce(
      (acc, r) => {
        if (
          typeof r.score === "number" &&
          typeof r.exercises?.max_points === "number"
        ) {
          acc.total += r.score;
          acc.max += r.exercises.max_points;
        }
        return acc;
      },
      { total: 0, max: 0 }
    );
    return sum + (max > 0 ? (total / max) * 100 : 0);
  }, 0);

  return (totalPercent / validRuns.length).toFixed(1);
});

const averageEfficiency = computed(() => {
  let total = 0;
  let count = 0;

  filteredRuns.value.forEach((run) => {
    run.run_results.forEach(({ score, time_taken, exercises }) => {
      const max = exercises?.max_points;
      const par = exercises?.par_time;
      if (max && par && time_taken > 0) {
        const scoreRatio = score / max;
        const timeRatio = par / time_taken;
        total += scoreRatio * timeRatio * 100;
        count++;
      }
    });
  });

  return count ? (total / count).toFixed(1) : "N/A";
});

const runSummaryRows = computed(() =>
  filteredRuns.value.map((run) => {
    let scoreTotal = 0;
    let timeTotal = 0;
    let efficiencySum = 0;
    let count = 0;
    let maxTotal = 0;

    const results = run.run_results.map((r) => {
      const max = r.exercises?.max_points || 0;
      const par = r.exercises?.par_time || null;
      const score = r.score;
      const time = r.time_taken;

      maxTotal += max;
      scoreTotal += score;
      timeTotal += time;

      let efficiency = null;
      if (max && par && time > 0) {
        const scoreRatio = score / max;
        const timeRatio = par / time;
        efficiency = (scoreRatio * timeRatio * 100).toFixed(2);
        efficiencySum += scoreRatio * timeRatio;
        count++;
      }

      return {
        ...r,
        efficiency,
        hit_factor: par ? (score / time).toFixed(2) : null,
        baseline_hf: par && max ? (max / par).toFixed(2) : null,
      };
    });

    const hitFactor = scoreTotal / timeTotal;
    const avgEfficiency = count
      ? ((efficiencySum / count) * 100).toFixed(1)
      : "N/A";
    const scorePercent = maxTotal
      ? ((scoreTotal / maxTotal) * 100).toFixed(2)
      : "N/A";

    return {
      id: run.id,
      created_at: new Date(run.created_at).toLocaleDateString(),
      created_at_unix: new Date(run.created_at).getTime(),
      group_name: run.exercise_groups?.name || "Unknown",
      total_score: scoreTotal.toFixed(2),
      total_score_percentage: scorePercent,
      max_possible_score: maxTotal.toFixed(2),
      total_hit_factor: hitFactor.toFixed(2),
      efficiency_score: avgEfficiency,
      original: { ...run, run_results: results },
    };
  })
);

onMounted(() => {
  exerciseStore.getExerciseGroups();
  exerciseStore.getAllExercises();
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
            <div class="text-h6 text-center">
              Average Score % Across Last 10 Runs
            </div>
            <div class="text-h4 font-weight-bold text-center">
              {{ averageScorePercentage }}%
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card elevation="2" class="pa-4">
            <div class="text-h6 text-center">
              Average Efficiency Score Across Last 10 Runs
            </div>
            <div class="text-h4 font-weight-bold text-center">
              {{ averageEfficiency }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="8">
          <SparkLine
            :data="runSummaryRows"
            :viewing-group="viewingGroup"
            :group-names="exerciseStore.exerciseGroupData.list"
          />
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
