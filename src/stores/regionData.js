import { defineStore } from "pinia";
import { reactive } from "vue";
import { supabase } from "./supabase.js";
export const useRegionStore = defineStore("region", () => {
  const regionListData = reactive({
    list: [],
    loading: true,
  });

  const retrieveRegionList = async () => {
    const { data, error } = await supabase.from("regions").select();
    if (data) {
      regionListData.list = data;
      regionListData.loading = false;
    } else {
      console.log(error);
    }
  };

  return {
    regionListData,
    //functions
    retrieveRegionList,
  };
});
