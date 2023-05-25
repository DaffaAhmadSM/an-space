<script>
    import { onMount } from "svelte";
    let imageContainer;
    export let columnCount = 4;
    export let aspectRatio = 'auto';
    export let images = [
        {
            url: "aaaaa",
            id: "aaaaa"
        }
    ];

    onMount(() => {
        const images = imageContainer.querySelectorAll("img");
        let imgSrc;
        images.forEach((img) => {
        img.addEventListener("click", (e) => {
            imgSrc = e.target.src;
            console.log(imgSrc);
        });
        
    });
    });
</script>
<div class="content" bind:this={imageContainer} style="-webkit-column-count:auto; column-count:{columnCount};">
    {#each images as image}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src={image.url} alt="image" class="item" id="{image.id}" style="aspect-ratio: {aspectRatio};"/>
    {/each}
 </div>

 <style>
    .content > img {
    width: 100%;
    margin-bottom: 5px;
    display: inline-block;
    }
    .item {
    margin: 10px;
    }
 </style>