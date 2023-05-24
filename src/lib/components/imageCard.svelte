<script>
    import { onMount } from "svelte";
    let imageContainer;
    export let objectFit = "cover";
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
<div class="content md:justify-between justify-center" bind:this={imageContainer}>
    {#each images as image}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src={image.url} alt="image" class="item inline-block aspect-[2/3] rounded-lg" style="object-fit: {objectFit};" width="200px" id="{image.id}"/>
    {/each}
 </div>

 <style>
    .content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-end;
  align-content: space-between;
}
.item {
  flex: 0 1 auto;
  margin: 10px;
}
 </style>