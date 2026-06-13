<script>
	import ImageCard from '$lib/components/imageCard.svelte';
	import arrowVector from '$lib/assets/vector/arrowVector.svg';

	let imageUrl = $state([]);
	let loading = $state(true);

	$effect(() => {
		fetch('/api/images?category=personalArtworks')
			.then((res) => res.json())
			.then((data) => {
				imageUrl = data.map((img) => ({ url: img.url, id: img.id }));
				loading = false;
			});
	});

	function handleBack() {
		history.back();
	}
</script>

<div class="h-screen grid place-content-center bg-[#F5F5DC]">
	<div class="absolute text-[#E1735E] w-full top-4">
		<button
			onclick={handleBack}
			class=" flex flex-row items-center text-3xl font-semibold translate-x-24"
		>
			<img src={arrowVector} alt="" class="inline-block w-5 -rotate-90 mr-2 align-middle" />
			<div>Back</div>
		</button>
	</div>
	<div class="container gap-6 flex flex-col">
		<p
			class="lg:text-4xl lg:translate-x-3 font-base font-semibold text-base lg:tracking-semi text-2xl max-lg:self-center"
		>
			personal artworks :
		</p>
		<div class="overflow-y-scroll h-[70vh] image-container">
			{#if loading}
				<p class="text-center text-gray-500">Loading images...</p>
			{:else}
				<ImageCard images={imageUrl} />
			{/if}
		</div>
		<div class="self-center">
			<p class="md:text-2xl font-base font-semibold text-base text-sm">Scroll to view more</p>
			<img
				src={arrowVector}
				alt=""
				width="30px"
				height="70px"
				class="mx-auto translate-y-1 rotate-180 lg:w-8 sm:w-3 w-2 arrow"
			/>
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
