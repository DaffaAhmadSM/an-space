<script>
	let dragging = $state(false);
	let files = $state([]);
	let category = $state('commis');
	let message = $state('');
	let uploading = $state(false);
	let existingImages = $state([]);
	/** @type {HTMLDialogElement | null} */
	let previewDialog = $state(null);
	let previewSrc = $state('');
	/** @type {{ id: string; originalName: string } | null} */
	let deleteTarget = $state(null);
	/** @type {HTMLDialogElement | null} */
	let confirmDialog = $state(null);

	let filteredImages = $derived(existingImages.filter((img) => img.category === category));

	async function loadExisting() {
		const res = await fetch('/api/images');
		existingImages = await res.json();
	}

	$effect(() => {
		loadExisting();
	});

	function handleDragOver(e) {
		e.preventDefault();
		dragging = true;
	}

	function handleDragLeave() {
		dragging = false;
	}

	function handleDrop(e) {
		e.preventDefault();
		dragging = false;
		const dropped = Array.from(e.dataTransfer?.files || []);
		files = dropped;
	}

	function handleFileInput(e) {
		const selected = Array.from(e.target?.files || []);
		files = selected;
	}

	function removeFile(index) {
		files = files.filter((_, i) => i !== index);
	}

	async function upload() {
		if (files.length === 0) return;
		uploading = true;
		message = '';
		let count = 0;

		for (const file of files) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('category', category);

			const res = await fetch('/api/images', {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				count++;
			} else {
				message = `Failed to upload ${file.name}`;
			}
		}

		if (!message) message = `Uploaded ${count} image(s) to "${category}"`;
		files = [];
		uploading = false;
		loadExisting();
	}

	function openPreview(url) {
		previewSrc = url;
		previewDialog?.showModal();
	}

	function closePreview() {
		previewDialog?.close();
	}

	function handlePreviewBackdrop(e) {
		if (!previewDialog) return;
		const rect = previewDialog.getBoundingClientRect();
		if (
			e.clientX < rect.left ||
			e.clientX > rect.right ||
			e.clientY < rect.top ||
			e.clientY > rect.bottom
		) {
			previewDialog.close();
		}
	}

	function promptDelete(image) {
		deleteTarget = image;
		confirmDialog?.showModal();
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		const res = await fetch('/api/images', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: deleteTarget.id })
		});
		if (res.ok) {
			existingImages = existingImages.filter((img) => img.id !== deleteTarget.id);
		}
		deleteTarget = null;
		confirmDialog?.close();
	}
</script>

<div class="min-h-screen bg-[#F5F5DC] p-6 md:p-10">
	<div class="max-w-5xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-3xl font-bold tracking-tight">Upload Images</h1>
				<p class="text-sm text-gray-500 mt-1">Manage your portfolio assets</p>
			</div>
			<form method="POST" action="/admin?/logout">
				<button type="submit" class="text-sm text-gray-500 hover:text-red-500 transition-colors">
					Logout
				</button>
			</form>
		</div>

		<!-- Drop zone -->
		<div
			class="border-2 border-dashed rounded-xl p-10 md:p-14 text-center cursor-pointer transition-colors mb-6 hover:border-[#E1735E]/50"
			class:border-[#E1735E]={dragging}
			class:bg-[#fef0ed]={dragging}
			class:border-gray-300={!dragging}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			onclick={() => document.getElementById('fileInput')?.click()}
			onkeydown={(e) => e.key === 'Enter' && document.getElementById('fileInput')?.click()}
			role="button"
			tabindex="0"
		>
			<svg
				class="mx-auto mb-4 w-12 h-12 text-gray-400"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				viewBox="0 0 24 24"
			>
				<path d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" />
			</svg>
			<p class="text-gray-600 text-lg font-medium">Drag & drop images here</p>
			<p class="text-gray-400 text-sm mt-1">or click to browse files</p>
			<input
				id="fileInput"
				type="file"
				accept="image/*"
				multiple
				class="hidden"
				onchange={handleFileInput}
			/>
		</div>

		<!-- Selected files preview -->
		{#if files.length > 0}
			<div class="mb-6 p-4 bg-white rounded-lg border">
				<div class="flex items-center justify-between mb-3">
					<span class="text-sm font-medium text-gray-700">
						{files.length} file(s) selected
					</span>
					<button
						onclick={() => (files = [])}
						class="text-xs text-gray-400 hover:text-red-500 transition-colors"
					>
						Clear all
					</button>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each files as file, i}
						<div
							class="relative inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-xs text-gray-600"
						>
							<span class="max-w-[120px] truncate">{file.name}</span>
							<button
								onclick={() => removeFile(i)}
								class="text-gray-400 hover:text-red-500 ml-1"
								aria-label="Remove {file.name}"
							>
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
								>
									<path d="M6 6l12 12M18 6L6 18" />
								</svg>
							</button>
						</div>
					{/each}
				</div>
				<button
					onclick={upload}
					disabled={uploading}
					class="mt-3 bg-[#E1735E] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[#c9604e] transition-colors disabled:opacity-50"
				>
					{uploading ? 'Uploading…' : 'Upload to ' + category}
				</button>
			</div>
		{/if}

		{#if message}
			<p
				class="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2"
			>
				{message}
			</p>
		{/if}

		<!-- Category filter + count -->
		<div class="flex items-end gap-4 mb-6">
			<div>
				<label class="block text-sm font-medium text-gray-600 mb-1" for="category"
					>Filter by category</label
				>
				<select
					id="category"
					bind:value={category}
					class="border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E1735E]/30 focus:border-[#E1735E]"
				>
					<option value="commis">Commissions</option>
					<option value="personalArtworks">Personal Artworks</option>
					<option value="others">Others</option>
					<option value="logo">Logo</option>
				</select>
			</div>
			<div class="text-sm text-gray-500 pb-2">
				{filteredImages.length} image(s)
			</div>
		</div>

		<!-- Image grid -->
		{#if filteredImages.length === 0}
			<div class="text-center py-16 text-gray-400">
				<p class="text-lg">No images in "{category}"</p>
				<p class="text-sm mt-1">Upload some using the drop zone above</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each filteredImages as image (image.id)}
					<div class="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
						<button
							onclick={() => openPreview(image.url)}
							class="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E1735E] focus-visible:ring-inset"
							aria-label="View {image.originalName}"
						>
							<img
								src={image.url}
								alt={image.originalName}
								class="w-full h-40 object-cover"
								loading="lazy"
							/>
						</button>
						<div class="p-2 flex flex-col gap-1 min-w-0">
							<p class="text-xs text-gray-600 truncate" title={image.originalName}>
								{image.originalName}
							</p>
							<button
								onclick={() => promptDelete(image)}
								class="text-xs text-red-500 hover:text-red-700 transition-colors self-start"
							>
								Delete
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Preview dialog -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={previewDialog} class="preview-dialog" onclick={handlePreviewBackdrop}>
	<div class="preview-inner">
		<!-- svelte-ignore a11y_img_redundant_alt -->
		<img src={previewSrc} alt="Preview" class="preview-img" />
		<button class="preview-close" onclick={closePreview} aria-label="Close preview">
			<svg
				width="20"
				height="20"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>
	</div>
</dialog>

<!-- Confirm delete dialog -->
<dialog bind:this={confirmDialog} class="confirm-dialog">
	<div class="confirm-content">
		<h3 class="text-lg font-semibold mb-2">Delete image?</h3>
		{#if deleteTarget}
			<p
				class="text-sm text-gray-600 mb-1 truncate max-w-[300px]"
				title={deleteTarget.originalName}
			>
				{deleteTarget.originalName}
			</p>
		{/if}
		<p class="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
		<div class="flex gap-3 justify-end">
			<button
				onclick={() => confirmDialog?.close()}
				class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
			>
				Cancel
			</button>
			<button
				onclick={confirmDelete}
				class="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
			>
				Delete
			</button>
		</div>
	</div>
</dialog>

<style>
	.preview-dialog {
		max-width: 90vw;
		max-height: 90vh;
		border: none;
		border-radius: 12px;
		padding: 0;
		background: transparent;
		overflow: visible;
	}
	.preview-dialog::backdrop {
		background: rgb(0 0 0 / 0.6);
		backdrop-filter: blur(10px);
	}
	.preview-inner {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.preview-img {
		max-width: 85vw;
		max-height: 80vh;
		border-radius: 8px;
		object-fit: contain;
		box-shadow: 0 8px 40px rgb(0 0 0 / 0.3);
	}
	.preview-close {
		position: absolute;
		top: 12px;
		right: 12px;
		background: rgb(0 0 0 / 0.45);
		color: white;
		border: none;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.preview-close:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
	}

	.confirm-dialog {
		border: none;
		border-radius: 12px;
		padding: 0;
		box-shadow: 0 16px 48px rgb(0 0 0 / 0.2);
	}
	.confirm-dialog::backdrop {
		background: rgb(0 0 0 / 0.3);
	}
	.confirm-content {
		padding: 24px;
	}
</style>
