<script>
	let { form } = $props();
</script>

<div class="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
	<form method="POST" action="?/login" class="bg-white p-8 rounded shadow-md w-full max-w-sm">
		<h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>

		{#if form?.error}
			<p class="text-red-500 text-sm mb-4 text-center">{form.error}</p>
		{/if}

		<label class="block mb-2 text-sm font-medium" for="password">Password</label>
		<input
			id="password"
			type="password"
			name="password"
			class="w-full border rounded px-3 py-2 mb-4"
			placeholder="Enter admin password"
			required
		/>

		<button
			type="submit"
			class="w-full bg-[#E1735E] text-white py-2 rounded hover:bg-[#c9604e] transition"
		>
			Login
		</button>
	</form>
</div>
