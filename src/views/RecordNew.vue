<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useExerciseStore } from "@/stores/exercise.js";
import { useRunRecorderStore } from "@/stores/runRecorder.js";
import RunRecorder from "@/components/record-new/RunRecorder.vue";
import ScoringRulesDialog from "@/components/record-new/ScoringRulesDialog.vue";
import RunSummary from "@/components/record-new/RunSummary.vue";
const router = useRouter();
const exerciseStore = useExerciseStore();
const runRecorderStore = useRunRecorderStore();
const selectedGroupId = ref(null);
const showScoringRules = ref(false);
const recordingRun = computed(() => runRecorderStore.groupId !== null);

const selectedGroup = computed(() => {
  if (!selectedGroupId.value) {
    return null;
  }
  return exerciseStore.exerciseGroupData.list.find(
    (g) => g.id === selectedGroupId.value
  );
});

onMounted(() => {
  if (
    exerciseStore.exerciseGroupData.list.length === 1 ||
    exerciseStore.allExercises.length < 1
  ) {
    exerciseStore.getExerciseGroups();
    exerciseStore.getAllExercises();
  }
});

const startRun = () => {
  if (selectedGroupId.value) {
    runRecorderStore.setGroupId(selectedGroupId.value);
  }
};

const reviewing = ref(false);

const showSummary = () => {
  reviewing.value = true;
};

const submitRunComplete = () => {
  recordingRun.value = false;
  reviewing.value = false;
  runRecorderStore.results.value = [];
  redirectToDash();
};

const redirectToDash = () => {
  router.push({ name: "Dashboard" });
};

const cancelFromSummary = () => {
  recordingRun.value = false;
  reviewing.value = false;
  runRecorderStore.cancelRun();
};
</script>

<template>
  <v-container>
    <v-slide-y-transition mode="out-in">
      <div v-if="!recordingRun && !reviewing">
        <v-row class="mt-10">
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-select
                  v-model="selectedGroupId"
                  :items="exerciseStore.createSelectableGroupsForNewRun"
                  item-title="name"
                  item-value="id"
                  label="Select an Exercise Group"
                  :loading="exerciseStore.exerciseGroupData.loading"
                  variant="outlined"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="selectedGroup">
          <v-col cols="12">
            <v-card class="pa-4" elevation="2">
              <v-card-title class="text-h5 font-weight-bold">
                {{ selectedGroup.name }}
              </v-card-title>
              <v-card-text
                class="text-subtitle-1"
                style="white-space: pre-line"
              >
                {{ selectedGroup.description }}
              </v-card-text>
              <v-card-text class="text-h6 pb-0">Scoring:</v-card-text>
              <v-card-text
                class="text-subtitle-1"
                style="white-space: pre-line"
              >
                {{ selectedGroup.scoring_rules }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="space-around" class="pb-5">
          <v-btn @click="redirectToDash" class="mr-3">Cancel</v-btn>
          <v-btn @click="startRun" color="primary" v-if="selectedGroup"
            >Start</v-btn
          >
        </v-row>
      </div>

      <div v-else-if="recordingRun && !reviewing">
        <RunRecorder @complete="showSummary" />
        <v-row class="mt-10" justify="center">
          <v-btn @click="showScoringRules = true"
            >Show General Scoring Rules</v-btn
          >
        </v-row>
      </div>

      <div v-else>
        <RunSummary
          v-if="reviewing"
          :results="runRecorderStore.results"
          :exercises="runRecorderStore.exercises"
          @submitted="submitRunComplete"
          @edit="reviewing = false"
          @cancel="cancelFromSummary"
        />
      </div>
    </v-slide-y-transition>

    <ScoringRulesDialog
      v-model="showScoringRules"
      :text="selectedGroup?.scoring_rules"
      @closeDialog="showScoringRules = false"
    />
  </v-container>
</template>
