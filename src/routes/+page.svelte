<svelte:head>
	<title>Home</title>
</svelte:head>
<script>
  import profile_webp from '$lib/assets/profile/profile.webp';
  import profile_jpeg from '$lib/assets/profile/profile.jpeg';
  import About from '$lib/components/about.svelte';
  import Art from '$lib/components/artUrl.svelte';
	import Contact from '$lib/components/contact.svelte';
  import bgImage from '$lib/assets/background-image/bg-contact-lan.jpg';
  // import Activity from '$lib/components/activity.svelte';
  // import SocialMedia from '$lib/components/socialmedia.svelte';
</script>
<main class="grid place-items-center content-div bg-base relative wrapper">
    <section id="home" class="h-screen">
      <div class="main flex flex-col mx-auto items-center justify-center !h-screen !snap-center text-tertiary font-semibold uppercase">
          <picture class="w-[40%] rounded-full aspect-square object-contain mb-10" width="450px">
            <source srcset={profile_jpeg} type="image/webp" class="rounded-full aspect-square object-cover">
            <img src="{profile_webp}" alt="profile" class="rounded-full aspect-square object-cover">
          </picture>
          <div class="md:text-3xl xl:text-5xl sm:text-xl min-[2400px]:text-9xl max-[360px]:text-sm whitespace-pre-line text-center tracking-baseSpace !leading-relaxed">
            HELLOoo ~
            welcome to an's space!
          </div>
      </div>
    </section>
    <section id="about" class="h-screen snap-center">
      <About />
    </section>
    <section id="art" class="h-screen snap-center">
      <Art />
    </section>
    <section id="contact" class="h-screen snap-center bg-cover" style="background-image: url({bgImage}); background-repeat: no-repeat;">
      <Contact />
    </section>
</main>

<style>
	.content-div::-webkit-scrollbar {
		display: none;
	}
  .wrapper section {
    scroll-snap-align: start;
  }
</style>

