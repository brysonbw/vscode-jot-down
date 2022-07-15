<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import Notes from '../components/Notes.svelte';
  let accessToken = "";
  let loading: boolean = true;
  let error: boolean = true
  let errorMessage: string = ''
  let user: User | null = null;
  
  onMount(async () => {
    // fetch token
      window.addEventListener("message", async (event) => {
          const message = event.data;
          switch (message.command) {
              case "token":
                  accessToken = message.value;
                  try {
                    const response = await fetch(`${apiBaseUrl}/me`, {
                      headers: {
                          authorization: `Bearer ${accessToken}`,
                      },
                  });
                  const data = await response.json();
                  user = data.user;
                  loading = false;  
                  error = false
                  } catch (error : any) {
                    console.log(error + `: ${error.message}`)
                    errorMessage = error.message
                    loading = false
                  }
          }
      });
      tsvscode.postMessage({ command: "get-token", value: undefined });
  });
</script>


{#if loading}
  <div>loading...</div>
{:else if error}
<div style=" text-align: center;
        margin-top: 2em;">
    <h2>Uh Oh :/ - Something Went Wrong </h2>
    <p style="margin-top: 1em;">Error: {errorMessage}</p>
</div>
{:else if user}
      <Notes {user} {accessToken} />
      <button
      on:click={() => {
          accessToken = '';
          user = null;
          tsvscode.postMessage({ command: 'logout', value: undefined });
      }}>Logout</button>
{:else}
<div class="titleText">
    <h2>Jot Down</h2>
    <br/>
    <em>Quick and simple note taking-tool for vs code</em>
</div>
<br/>
  <button
      on:click={() => {
          tsvscode.postMessage({ command: 'signIn', value: undefined });
      }}>Sign In With GitHub</button>

{/if}


<style>
   
   
    .titleText {
        text-align: center;
    }

</style>