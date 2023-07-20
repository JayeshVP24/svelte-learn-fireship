<script lang="ts">
  import UserLink from '$lib/components/UserLink.svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

    console.log(data.links)
</script>

<svelte:head>
    <title>@{data.username}</title>
    <meta name="description" content={data.bio} />
</svelte:head>

<main class="prose text-center mx-auto mt-8" >
    <h1 class="text-7xl text-purple-500" >@{data.username}</h1>
    <img src={data.photoURL ?? "/user.png"} alt={`photo of ${data.username}`}
    width="256"
    class="mx-auto my-10"
    >

    <p class="text-xl my-8" >{data.bio ?? "no bio yet..."}</p>
    
    <ul class="list-none" >
        {#each data.links as item}
            <UserLink {...item} />
        {/each}
    </ul>
    
</main>