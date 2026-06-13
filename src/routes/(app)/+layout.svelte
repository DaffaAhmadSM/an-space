
<script>
	// import profile from '$lib/assets/profile/profile.png';
	import { page } from '$app/state';
	import '../../app.css';
	import { slide } from 'svelte/transition';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
	let showMenu = $state(false);
	let top = $state();
	function toggleMenu() {
		showMenu = !showMenu;
	}
	function onTop() {
		top.scrollTo(0, 0);
	}
 </script>
	<div class="scroll-container max-h-screen font-base bg-base" bind:this={top}>
		<nav class="top-0 bg-secondary w-full font-base fixed z-10 text-base">
			<div class="mx-14">
			  <div class="flex items-center justify-between h-20">
				<div class="flex-shrink-0">
					{#if page.route.id === '/(app)'}
					<button class="font-semibold text-3xl tracking-baseSpace" onclick={onTop}>HOME</button>
					{:else}
					<a href="/" class="font-semibold text-3xl tracking-baseSpace">HOME</a>
					{/if}
				</div>
				<button class="block md:hidden text-white focus:outline-none" onclick={toggleMenu} aria-label="nav-toggle" id="nav-toggle" title="nav-toggle">
				  <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					{#if showMenu}
					  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.293 4.707a1 1 0 010 1.414l-14 14a1 1 0 01-1.414-1.414l14-14a1 1 0 011.414 0z" />
					  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.707 4.707a1 1 0 000 1.414l14 14a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 0z" />
					{:else}
					  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
					{/if}
				  </svg>
				</button>
				<div class="hidden md:block">
				  <div class="ml-10 flex items-baseline space-x-4 text-3xl tracking-baseSpace">
					<a href="#about" class="hover:text-white px-3 py-2 rounded-md font-medium">About</a>
					<a href="#art" class="hover:text-white px-3 py-2 rounded-md font-medium">Art</a>
					<a href="#contact" class="hover:text-white px-3 py-2 rounded-md font-medium">Contact</a>
				  </div>
				</div>
			  </div>
			</div>
			{#if showMenu}
			<div transition:slide|global class="md:hidden absolute top-20 w-full bg-secondary">
			  <div class="flex flex-col items-start py-4 px-4 tracking-baseSpace font-bold">
				<a href="#about" class="hover:text-white text-xl py-2" onclick={toggleMenu}>About</a>
				<a href="#art" class="hover:text-white text-xl py-2" onclick={toggleMenu}>Art</a>
				<a href="#contact" class="hover:text-white text-xl py-2" onclick={toggleMenu}>contact</a>
			  </div>
			</div>
			{/if}
		</nav>
		
		{@render children?.()}
	</div>

<style>
	.scroll-container{
    scroll-snap-type: y mandatory;
    overflow: scroll;
	scroll-behavior: smooth;
	scroll-snap-stop: always;
  }
  .scroll-container::-webkit-scrollbar {
	display: none;
  }
</style>


  
