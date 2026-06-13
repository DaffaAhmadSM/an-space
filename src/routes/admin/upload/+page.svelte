<script>
	/** @type {string[]} */
	let dragging = $state(false);
	/** @type {File[]} */
	let files = $state([]);
	/** @type {string} */
	let category = $state('commis');
	/** @type {string} */
	let message = $state('');
	/** @type {boolean} */
	let uploading = $state(false);
	/** @type {{ id: string; url: string; originalName: string; category: string }[]} */
	let uploaded = $state([]);
	/** @type {any[]} */
	let existingImages = $state([]);

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

	async function upload() {
		if (files.length === 0) return;
		uploading = true;
		message = '';

		for (const file of files) {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('category', category);

			const res = await fetch('/api/images', {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				const data = await res.json();
				uploaded = [...uploaded, data];
			} else {
				message = `Failed to upload ${file.name}`;
			}
		}

		if (!message) message = `Uploaded ${uploaded.length} file(s)`;
		files = [];
		uploading = false;
		loadExisting();
	}

	async function removeImage(id) {
		const res = await fetch('/api/images', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		if (res.ok) {
			existingImages = existingImages.filter((img) => img.id !== id);
		}
	}
</script>

<div class="min-h-screen bg-[#F5F5DC] p-8">
	<div class="max-w-4xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold">Upload Images</h1>
			<form method="POST" action="/admin?/logout">
				<button type="submit" class="text-sm text-gray-500 hover:text-red-500"> Logout </button>
			</form>
		</div>

		<!-- Category selector -->
		<div class="mb-4">
			<label class="block text-sm font-medium mb-1" for="category">Category</label>
			<select id="category" bind:value={category} class="border rounded px-3 py-2 bg-white">
				<option value="commis">Commissions</option>
				<option value="personalArtworks">Personal Artworks</option>
				<option value="others">Others</option>
				<option value="logo">Logo</option>
			</select>
		</div>

		<!-- Drop zone -->
		<div
			class="border-2 border-dashed rounded-lg p-12 text-center transition cursor-pointer"
			class:border-[#E1735E]={dragging}
			class:bg-[#fdf0ed]={dragging}
			class:border-gray-300={!dragging}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			onclick={() => document.getElementById('fileInput')?.click()}
			onkeydown={(e) => e.key === 'Enter' && document.getElementById('fileInput')?.click()}
			role="button"
			tabindex="0"
		>
			<p class="text-gray-500 text-lg">
				{#if files.length > 0}
					{files.length} file(s) selected
				{:else}
					Drag & drop images here, or click to select
				{/if}
			</p>
			<input
				id="fileInput"
				type="file"
				accept="image/*"
				multiple
				class="hidden"
				onchange={handleFileInput}
			/>
		</div>

		<!-- Upload button -->
		<div class="mt-4">
			<button
				onclick={upload}
				disabled={files.length === 0 || uploading}
				class="bg-[#E1735E] text-white px-6 py-2 rounded hover:bg-[#c9604e] transition disabled:opacity-50"
			>
				{uploading ? 'Uploading...' : `Upload ${files.length || 0} file(s)`}
			</button>

			{#if message}
				<p class="mt-2 text-sm text-green-600">{message}</p>
			{/if}
		</div>

		<!-- Existing images -->
		<div class="mt-8">
			<h2 class="text-xl font-semibold mb-4">Existing Images ({existingImages.length})</h2>
			<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each existingImages as image}
					<div class="relative group">
						<img
							src={image.url}
							alt={image.originalName}
							class="w-full h-32 object-cover rounded"
						/>
						<button
							onclick={() => removeImage(image.id)}
							class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition"
						>
							✕
						</button>
						<p class="text-xs text-gray-500 mt-1 truncate">{image.originalName}</p>
						<p class="text-xs text-gray-400">{image.category}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
