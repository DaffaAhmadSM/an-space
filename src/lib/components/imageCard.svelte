<script>
	/** @type {HTMLDivElement | null} */
	let imageContainer = $state(null);
	/** @type {HTMLDialogElement | null} */
	let dialog = $state(null);

	/**
	 * @typedef {Object} Props
	 * @property {number} [columnCount]
	 * @property {string} [aspectRatio]
	 * @property {string} [objectFit]
	 * @property {{ url: string; id: string }[]} [images]
	 */

	/** @type {Props} */
	let {
		columnCount = 4,
		aspectRatio = 'auto',
		objectFit = 'contain',
		images = [{ url: '', id: '' }]
	} = $props();

	let imgSrc = $state('');

	function openDialog(e) {
		imgSrc = e.target.src;
		dialog?.showModal();
	}

	function handleDialogClick(e) {
		if (!dialog) return;
		const rect = dialog.getBoundingClientRect();
		if (
			e.clientX < rect.left ||
			e.clientX > rect.right ||
			e.clientY < rect.top ||
			e.clientY > rect.bottom
		) {
			dialog.close();
		}
	}
</script>

<div
	class="content"
	bind:this={imageContainer}
	style="-webkit-column-count:auto; column-count:{columnCount};"
>
	{#each images as image (image.id)}
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<img
			src={image.url}
			alt="image"
			class="item"
			style="aspect-ratio: {aspectRatio}; object-fit:{objectFit}"
			oncontextmenu={(e) => e.preventDefault()}
			onclick={openDialog}
			onkeydown={(e) => e.key === 'Enter' && openDialog(e)}
			role="button"
			tabindex="0"
		/>
	{/each}

	<dialog bind:this={dialog} id="dialog" onclick={handleDialogClick}>
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
		cursor: pointer;
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
