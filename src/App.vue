<template>
  <div>
    <h1>Users</h1>
    <!-- <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="New todo" />
      <button>Add</button>
    </form> -->
    <ul v-if="!loading">
      <li v-for="user in users" :key="user.id">
        {{ user.discord_name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../src/supabase";
const users = ref([]);
const loading = ref(true);
const fetchUsers = async () => {
  const { data, error } = await supabase.from("users").select("*").order("id");
  if (error) {
    console.error(error);
  } else {
    users.value = data;
    loading.value = false;
  }
};

// const addTodo = async () => {
//   if (!newTodo.value) return;
//   const { error } = await supabase.from('todos').insert([{ title: newTodo.value }]);
//   if (error) console.error(error);
//   newTodo.value = '';
//   fetchTodos();
// };

onMounted(fetchUsers);
</script>
