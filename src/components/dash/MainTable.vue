<script setup>
import { ref } from "vue";
const props = defineProps({
  viewingGroup: {
    type: Number,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const headers = [
  { title: "Date", value: "created_at_unix", sortable: true },
  { title: "Exercise Group", value: "group_name", sortable: true },
  { title: "Total Score", value: "total_score", sortable: true },
];

const expandedTableRows = ref([]);

const timeDisplay = (item) => {
  if (item.exercises.par_time && item.time_taken) {
    return item.time_taken + " / " + item.exercises.par_time + " seconds";
  } else if (item.time_taken) {
    return item.time_taken + " seconds";
  } else {
    return "N/A";
  }
};
</script>

<template>
  <v-card elevation="2">
    <v-card-title>History</v-card-title>
    <v-data-table
      :headers="headers"
      :items="props.data"
      :items-per-page="10"
      expand-on-click
      show-expand
      item-value="id"
      class="elevation-1"
      :expanded="expandedTableRows"
      hide-default-footer
    >
      <template #item.created_at_unix="{ item }">
        {{ item.created_at }}
      </template>
      <template #item.avg_time_per_string="{ value }">
        {{ value + " seconds" }}
      </template>
      <template #item.total_score="{ item }">
        {{ item.total_score + " / " + item.max_possible_score }}
      </template>
      <template #expanded-row="{ item }">
        <tr>
          <td :colspan="headers.length" class="pa-4">
            <v-card flat class="mx-2 my-2">
              <v-card-title class="text-h6 font-weight-bold">
                Run Details for {{ item.group_name }} ({{ item.created_at }})
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :items="item.original.run_results"
                  :headers="[
                    { title: 'Exercise', value: 'name' },
                    { title: 'Score', value: 'score' },
                    { title: 'Time Taken', value: 'time_taken' },
                    { title: 'Shot Hit Factor', value: 'hit_factor' },
                    { title: 'Baseline Hit Factor', value: 'baseline_hf' },
                  ]"
                  class="elevation-1"
                  hide-default-footer
                  dense
                >
                  <template #item.name="{ item }">
                    {{ item.exercises?.name || "Unnamed Drill" }}
                  </template>
                  <template #item.score="{ item }">
                    {{
                      item.exercises?.max_points
                        ? item.score + " / " + item.exercises?.max_points
                        : item.score
                    }}
                  </template>
                  <template #item.time_taken="{ item }">
                    {{ timeDisplay(item) }}
                  </template>
                  <template #item.hit_factor="{ item }">
                    <span
                      v-if="item.exercises?.par_time"
                      class="font-weight-bold"
                      :class="
                        item.hit_factor >= item.baseline_hf
                          ? 'text-green'
                          : 'text-red'
                      "
                      >{{ item.hit_factor }}</span
                    >
                    <span v-else class="font-weight-bold">{{
                      item.hit_factor
                    }}</span>
                  </template>
                  <template #item.baseline_hf="{ item }">
                    {{ item.baseline_hf ?? "No Par Set" }}
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
