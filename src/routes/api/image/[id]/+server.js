import { getImageData } from '$lib/server/metadata';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const data = await getImageData(params.id);
	if (!data) {
		return new Response('Not found', { status: 404 });
	}

	return new Response(data, {
		headers: {
			'Content-Type': 'image/webp',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
}
