<script>
	import { onMount } from 'svelte';
	let imageContainer = $state();
	let dialog = $state();
	/**
	 * @typedef {Object} Props
	 * @property {number} [columnCount]
	 * @property {string} [aspectRatio]
	 * @property {string} [objectFit]
	 * @property {any} [images]
	 */

	/** @type {Props} */
	let {
		columnCount = 4,
		aspectRatio = 'auto',
		objectFit = 'contain',
		images = [
		{
			url: 'aaaaa',
			id: 'aaaaa'
		}
	]
	} = $props();
	let imgSrc = $state();
	onMount(() => {
		const images = imageContainer.querySelectorAll('img');
		images.forEach((img) => {
			img.addEventListener('click', (e) => {
				imgSrc = e.target.src;
				dialog.showModal();
			});

			dialog.addEventListener('click', (e) => {
				const dialogDimensions = dialog.getBoundingClientRect();
				if (
					e.clientX < dialogDimensions.left ||
					e.clientX > dialogDimensions.right ||
					e.clientY < dialogDimensions.top ||
					e.clientY > dialogDimensions.bottom
				) {
					dialog.close();
				}
			});
		});
	});
</script>

<div
	class="content"
	bind:this={imageContainer}
	style="-webkit-column-count:auto; column-count:{columnCount};"
>
	{#each images as image}
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<img
			src={image.url}
			alt="image"
			class="item"
			id={image.id}
			style="aspect-ratio: {aspectRatio}; object-fit:{objectFit}"
			oncontextmenu={(e) => e.preventDefault()}
		/>
	{/each}

	<dialog bind:this={dialog} id="dialog">
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<img src={imgSrc} alt="image" id="dialog-img" />
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
