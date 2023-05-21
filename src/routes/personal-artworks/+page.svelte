<script>
    import ImageCard from "$lib/components/imageCard.svelte";
    import image1 from "$lib/assets/personalArtworks/(1).png";
    import image2 from "$lib/assets/personalArtworks/(2).png";
    import image3 from "$lib/assets/personalArtworks/(3).png";
    import image4 from "$lib/assets/personalArtworks/(4).png";
    import image5 from "$lib/assets/personalArtworks/(5).png";
    import image6 from "$lib/assets/personalArtworks/(6).png";
    import image7 from "$lib/assets/personalArtworks/(7).png";
    import image8 from "$lib/assets/personalArtworks/(8).png";
    import image9 from "$lib/assets/personalArtworks/(9).png";
    import image10 from "$lib/assets/personalArtworks/(10).png";
    import image11 from "$lib/assets/personalArtworks/(11).png";
    import image12 from "$lib/assets/personalArtworks/(12).png";
    import image13 from "$lib/assets/personalArtworks/(13).png";
    import image14 from "$lib/assets/personalArtworks/(14).png";
    import image15 from "$lib/assets/personalArtworks/(15).png";
    import image16 from "$lib/assets/personalArtworks/(16).png";
    import image17 from "$lib/assets/personalArtworks/(17).png";
    import image18 from "$lib/assets/personalArtworks/(18).png";
    import image19 from "$lib/assets/personalArtworks/(19).png";
    import image20 from "$lib/assets/personalArtworks/(20).png";
    import image21 from "$lib/assets/personalArtworks/(21).png";
    import image22 from "$lib/assets/personalArtworks/(22).png";
    import image23 from "$lib/assets/personalArtworks/(23).png";
    import image24 from "$lib/assets/personalArtworks/(24).png";
    import image25 from "$lib/assets/personalArtworks/(25).png";
    import image26 from "$lib/assets/personalArtworks/(26).png";
    import image27 from "$lib/assets/personalArtworks/(27).png";
    import image28 from "$lib/assets/personalArtworks/(28).png";
    import image29 from "$lib/assets/personalArtworks/(29).png";
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
        {
            url: image8,
            id: "image8"
        },
        {
            url: image9,
            id: "image9"
        },
        {
            url: image10,
            id: "image10"
        },
        {
            url: image11,
            id: "image11"
        },
        {
            url: image12,
            id: "image12"
        },
        {
            url: image13,
            id: "image13"
        },
        {
            url: image14,
            id: "image14"
        },
        {
            url: image15,
            id: "image15"
        },
        {
            url: image16,
            id: "image16"
        },
        {
            url: image17,
            id: "image17"
        },
        {
            url: image18,
            id: "image18"
        },
        {
            url: image19,
            id: "image19"
        },
        {
            url: image20,
            id: "image20"
        },
        {
            url: image21,
            id: "image21"
        },
        {
            url: image22,
            id: "image22"
        },
        {
            url: image23,
            id: "image23"
        },
        {
            url: image24,
            id: "image24"
        },
        {
            url: image25,
            id: "image25"
        },
        {
            url: image26,
            id: "image26"
        },
        {
            url: image27,
            id: "image27"
        },
        {
            url: image28,
            id: "image28"
        },
        {
            url: image29,
            id: "image29"
        },
    ]

    function handleBack() {
        history.back();
    }
</script>

<div class="h-screen grid place-content-center bg-[#F5F5DC]">
        <div class="absolute text-3xl font-semibold translate-x-24 top-4 text-[#E1735E]">
            <button on:click={handleBack} class=" flex flex-row items-center">
                <img src="{arrowVector}" alt="" class="inline-block w-5 -rotate-90 mr-2 align-middle">
                <div>Back</div>
            </button>
        </div>
        <div class="container gap-6 flex flex-col">
            <p class="lg:text-4xl lg:translate-x-3 font-base font-semibold text-base lg:tracking-semi text-2xl max-lg:self-center">personal artworks :</p>
            <div class="overflow-y-scroll h-[50vh] image-container">
                <ImageCard images={imageUrl}/>
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