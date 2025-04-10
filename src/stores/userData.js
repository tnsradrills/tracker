import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { supabase } from "./supabase.js";
export const useCounterStore = defineStore('counter', () => {
  const userData = reactive({
    id: null,
    display_name: null,
    discord_username: null,
    region_id: null,
    qual_runs: [],
  });

  const loginUser = (discordName, password) => {
    return new Promise( async (resolve, reject) => {
      const fakeEmail = `${discordName.value}@placeholder.xyz`;
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: password.value,
      });
      if (signInError) {
        console.log("uwu it made a fucky");
        reject(signInError);
        return;
      } 
    });
  };
  
  const signupUser = (discordName, displayName, password, regionId) => {
    return new Promise (async (resolve, reject) => {
      const fakeEmail = `${discordName}@placeholder.xyz`;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: password,
      });
      if (signUpError) {
        console.log("uwu it made a fucky");
        reject(signUpError);
        return;
      } else {
        userData.id = signUpData.id;
      }
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          discord_username: discordName,
          display_name: displayName,
          region: regionId
        },
      ]);
    
      if (insertError) {
        console.log("uwu it made a fucky in the second half");
        reject(insertError);
        return;
      } else {
        userData.display_name = displayName;
        userData.discord_username = discordName;
        userData.region_id = regionId;
        userData.qual_runs = [];
        resolve();
        return;
      }
    })
    
  };

  const retrieveUserData = () => {

  };

  return {
    userData,
    //functions
    loginUser,
    signupUser,
    retrieveUserData,

  }

});
