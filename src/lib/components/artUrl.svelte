<script>
    import others from '$lib/assets/background-image/others.svg';
    import personal_artworks from '$lib/assets/background-image/personal-artworks.svg';
    import logo from '$lib/assets/background-image/logo.svg';
    import commissions from '$lib/assets/background-image/commissions.svg';
</script>

<main class="text-xl font-bold flex flex-col items-center justify-center h-full max-lg:mx-9 tracking-semi font-base relative gap-8">
    <a class="inline-block relative" href="/personal-artworks"><img class="w-3/4 block mx-auto"  src="{personal_artworks}" alt="url-personal-artworks"></a>
    <a class="inline-block relative" href="/"><img class="w-3/4 block mx-auto"  src="{logo}" alt="url-logo"></a>
    <a class="inline-block relative" href="/commissions"><img class="w-3/4 block mx-auto"  src="{commissions}" alt="url-commissions"></a>
    <a class="inline-block relative" href="/others"><img class="w-3/4 block mx-auto"  src="{others}" alt="url-others"></a>
</main>


<style>
</style>