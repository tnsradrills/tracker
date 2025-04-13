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
  { title: "Date", value: "created_at" },
  { title: "Exercise Group", value: "group_name" },
  { title: "Avg Efficiency On Run", value: "efficiency_score" },
  { title: "Total Score", value: "total_score" },
  { title: "Total Hit Factor", value: "total_hit_factor" },
];

const expandedTableRows = ref([]);
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
    >
      <template #item.avg_time_per_string="{ value }">
        {{ value + " seconds" }}
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
                    { title: 'Hit Factor', value: 'hit_factor' },
                    { title: 'Efficiency', value: 'efficiency' },
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
                    {{
                      item.exercises?.par_time
                        ? item.time_taken.toFixed(2) +
                          " / " +
                          item.exercises?.par_time
                        : item.time_taken.toFixed(2)
                    }}
                    seconds
                  </template>
                  <template #item.hit_factor="{ item }">
                    {{ item.hit_factor }}
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
