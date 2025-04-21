<script setup>
import { computed, ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userData";
import { useExerciseStore } from "@/stores/exercise.js";
import MainTable from "@/components/dash/MainTable.vue";
import SparkLine from "@/components/dash/SparkLine.vue";
import { useDisplay } from "vuetify";
const { smAndUp } = useDisplay();
const userStore = useUserStore();
const exerciseStore = useExerciseStore();
const viewingGroup = ref(0);

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

const consistencyScore = computed(() => {
  const percentages = filteredRuns.value
    .map((run) => {
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
      return max > 0 ? (total / max) * 100 : null;
    })
    .filter((v) => v !== null);

  if (percentages.length < 2) return "N/A";

  const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
  const variance =
    percentages.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
    percentages.length;
  const stddev = Math.sqrt(variance);
  return (100 - stddev).toFixed(1);
});

const runSummaryRows = computed(() =>
  filteredRuns.value.map((run) => {
    let scoreTotal = 0;
    let timeTotal = 0;
    let maxTotal = 0;

    const results = run.run_results.map((r) => {
      const max = r.exercises?.max_points || 0;
      const par = r.exercises?.par_time || null;
      const score = r.score;
      const time = r.time_taken;

      maxTotal += max;
      scoreTotal += score;
      timeTotal += time;

      return {
        ...r,
        hit_factor: par ? (score / time).toFixed(2) : null,
        baseline_hf: par && max ? (max / par).toFixed(2) : null,
      };
    });

    const hitFactor = scoreTotal / timeTotal;
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
      <v-row justify="center" v-if="runSummaryRows.length == 0">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Welcome! We're glad you're here.</v-card-title>
            <v-card-text>
              When you're ready, you'll find a link to record your first
              exercise group run in the top right corner. This site will keep
              track of the last 10 runs you performed for all of the exercise
              groups above so you can see your progress over time.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-5" v-if="runSummaryRows.length > 1">
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
            <div class="text-h6 text-center d-flex justify-center align-center">
              Consistency Score
              <v-tooltip location="top" v-if="smAndUp">
                <template #activator="{ props }">
                  <v-icon v-bind="props" size="18" color="primary" class="ml-2">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <div style="max-width: 250px; white-space: normal">
                  Consistency is calculated by averaging your score percentages
                  and subtracting the standard deviation. A lower variation in
                  scores results in a higher consistency score.
                </div>
              </v-tooltip>
            </div>
            <div class="text-h4 font-weight-bold text-center">
              {{ consistencyScore }}
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
            v-if="runSummaryRows.length > 1"
          />
          <v-card v-else-if="runSummaryRows.length == 1">
            <v-card-text class="text-center">
              Go through one more exercise group to start seeing a trendline!
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
