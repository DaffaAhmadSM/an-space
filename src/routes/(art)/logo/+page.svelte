<script>
    import ImageCard from "$lib/components/imageCard.svelte";
    import image1 from "$lib/assets/logoWatermark/(1).png";
    import image2 from "$lib/assets/logoWatermark/(2).png";
    import image3 from "$lib/assets/logoWatermark/(3).png";
    import image4 from "$lib/assets/logoWatermark/(4).png";
    import image5 from "$lib/assets/logoWatermark/(5).png";
    import image6 from "$lib/assets/logoWatermark/(6).png";
    import image7 from "$lib/assets/logoWatermark/(7).png";

    import arrowVector from "$lib/assets/vector/arrowVector.svg";
    let imageUrl =[
        {
            url: image1,
            id: "image1"
        },
        {
            url: image2,
            id: "image2"
        },
        {
            url: image3,
            id: "image3"
        },
        {
            url: image4,
            id: "image4"
        },
        {
            url: image5,
            id: "image5"
        },
        {
            url: image6,
            id: "image6"
        },
        {
            url: image7,
            id: "image7"
        },
    ]
    let aspectRatio = "1/1";

    let columnCount = 4;

    let objectFit = "scale-down";

    function handleBack() {
        history.back();
    }
</script>

<div class="h-screen grid place-content-center bg-[#F5F5DC]">
        <div class="absolute text-[#E1735E] w-full top-4">
            <button on:click={handleBack} class=" flex flex-row items-center text-3xl font-semibold translate-x-24">
                <img src="{arrowVector}" alt="" class="inline-block w-5 -rotate-90 mr-2 align-middle">
                <div>Back</div>
            </button>
        </div>
        <div class="container gap-6 flex flex-col">
            <p class="lg:text-4xl lg:translate-x-3 font-base font-semibold text-base lg:tracking-semi text-2xl max-lg:self-center">Logo :</p>
            <div class="overflow-y-scroll h-[65vh] image-container">
                <ImageCard images={imageUrl} aspectRatio={aspectRatio} columnCount={columnCount} objectFit={objectFit}/>
            </div>
            <div class="self-center">
                <p class="md:text-2xl font-base font-semibold text-base text-sm">Scroll to view more</p>
                <img src="{arrowVector}" alt="" width="30px" height="70px" class="mx-auto translate-y-1 rotate-180 lg:w-8 sm:w-3 w-2 arrow">
            </div>
        </div>
</div>

<style>
    .image-container {
		scroll-behavior: smooth;
	}
    .image-container::-webkit-scrollbar {
        display: none;
    }
    .arrow {
        animation: arrow 1s infinite;
    }
    @keyframes arrow {
        0% {
            transform: translateY(0px) rotate(180deg);
        }
        50% {
            transform: translateY(10px) rotate(180deg);
        }
        100% {
            transform: translateY(0px) rotate(180deg);
        }
    }
</style>