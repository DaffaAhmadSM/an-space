<script>
	import profile_webp from '$lib/assets/profile/profile.webp';
	import About from '$lib/components/about.svelte';
	import Art from '$lib/components/artUrl.svelte';
	import Contact from '$lib/components/contact.svelte';
	import bgImage from '$lib/assets/background-image/bg-contact-lan.jpg';
	// import Activity from '$lib/components/activity.svelte';
	// import SocialMedia from '$lib/components/socialmedia.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section id="home">
	<div
		class="main flex flex-col mx-auto items-center justify-center !h-screen !snap-center text-tertiary font-semibold uppercase"
	>
		<img
			src={profile_webp}
			alt="profile"
			class="rounded-full aspect-square object-cover"
			width="200"
		/>
		<div
			class="md:text-3xl xl:text-5xl sm:text-xl min-[2400px]:text-9xl max-[360px]:text-sm whitespace-pre-line text-center tracking-baseSpace !leading-relaxed"
		>
			HELLOoo ~ welcome to an's space!
		</div>
	</div>
</section>
<section id="about">
	<About />
</section>
<section id="art">
	<Art />
</section>
<section
	id="contact"
	class="bg-cover"
	style="background-image: url({bgImage}); background-repeat: no-repeat;"
>
	<Contact />
</section>

<style>
	section {
		scroll-snap-align: center;
		height: 100vh;
	}
</style>
