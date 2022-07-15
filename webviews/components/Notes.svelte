<script lang="ts">

    import { onMount } from "svelte";
    import type { User } from "../types";

    export let user: User;
    export let accessToken: string;
    let errorMessage: null | string = null


    // get date
    let now = new Date();
let formatDate = now.toLocaleString('en-US', {
	dateStyle: 'medium',
	timeStyle: 'short',
	hour12: true
});

// split date
let formateDateArr = formatDate.split(',')

    
    let text = "";
    let notes: Array<{ text: string; completed: boolean; id: string }> = [];

    // add note
    async function addNote(t: string) {
        const response = await fetch(`${apiBaseUrl}/note`, {
            method: "POST",
            body: JSON.stringify({
                text: t,
            }),
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
        });
        const { note } = await response.json();
        notes = [note, ...notes];
    }



    // fetch notes
    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.command) {
                case "new-note":
                    addNote(message.value);
                    break;
            }
        });
        const response = await fetch(`${apiBaseUrl}/notes`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const payload = await response.json();
        notes = payload.notes
    });


</script>

<!-- Heading -->
<div class="heading">
    <div>Hello, {user.name}</div>
        <div class="time">
{formateDateArr[0]}, {formateDateArr[2]}
</div>
    

</div>



<!-- Form input/ Enter note -->
<form
    on:submit|preventDefault={async () => {
        addNote(text);
        text = '';
    }}>
    <input placeholder="Enter note" bind:value={text} />
</form>


    {#each notes as note (note.id)}
    <div class="todoContainer">
    <input class="check" type=checkbox bind:checked={note.completed} on:click={
        async () => {
            //------- edit/mark complete
                note.completed = !note.completed;
                await fetch(`${apiBaseUrl}/note`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        id: note.id,
                    }),
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${accessToken}`,
                    },
                });
            }
    } />
        <span
            class:complete={note.completed}
           >
            {note.text}
        </span>
        <button
        class="deleteNoteBtn"
        on:click={
            // ---------delete note
            async () => {
                let detailNote = note.id
                     await fetch(`${apiBaseUrl}/note`, {
                        method: 'DELETE',
                        body: JSON.stringify({
                            id: detailNote,
                        }),
                        headers: {
                            'content-type': 'application/json',
                            authorization: `Bearer ${accessToken}`,
                        },
                    });
                 
                    notes = notes.filter(note => note.id !== detailNote);
                }
        }>x</button>
    </div>
    {/each}
{#if errorMessage === null && notes.length > 0}
<button
class="deleteAllBtn"
on:click={async () => {
    try {
      const response =   await fetch(`${apiBaseUrl}/notes`, {
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${accessToken}`,
                    },
                });
                const {message} = await response.json()
                if(message) {
                    notes.length = 0 
                } 
                
    } catch (error) {
        errorMessage = `Unable to delete notes`
       console.log(error + `: ${errorMessage}`)
    }      
}}>Delete All</button>
{:else if errorMessage !== null}
<div style=" text-align: center;
">
<h3>Error: {errorMessage}</h3>
<p>Refresh sidebar webview and try again and/ or check network.</p>
</div>
     
{/if}
    
    
    

        
  

<style>
    
    .complete {
        text-decoration: line-through;
    }
    .time {
        font-size: smaller;
    }
    form{
        margin-top: .5em;
    }
    .todoContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: .5em;
    }
  .check:hover{
    cursor: pointer;
  }
  .deleteNoteBtn{
    margin-left: auto;
    width: 1.1em;
  padding: 0px;
    font-size: small;
  }
 
  button:focus{
    outline: 0 !important;
}

</style>