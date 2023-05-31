<script>
    import { onMount } from "svelte";
    let imageContainer;
    let dialog;
    export let columnCount = 4;
    export let aspectRatio = 'auto';
    export let objectFit = 'contain';
    export let images = [
        {
            url: "aaaaa",
            id: "aaaaa"
        }
    ];
    let imgSrc;
    onMount(() => {
        const images = imageContainer.querySelectorAll("img");
        images.forEach((img) => {
        img.addEventListener("click", (e) => {
            imgSrc = e.target.src;
            dialog.showModal();
        });

        dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialog.close()
        }
        })
        
    });
    });
</script>
<div class="content" bind:this={imageContainer} style="-webkit-column-count:auto; column-count:{columnCount};">
    {#each images as image}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src={image.url} alt="image" class="item" id="{image.id}" style="aspect-ratio: {aspectRatio}; object-fit:{objectFit}" oncontextmenu="return false;"/>
    {/each}

    <dialog bind:this={dialog} id="dialog">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="{imgSrc}" alt="image" id="dialog-img"/>
    </dialog>
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
    img {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;  
    }
    #dialog::backdrop {
        backdrop-filter: blur(10px);
    }
 </style>