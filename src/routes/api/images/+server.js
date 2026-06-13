import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getImages, saveImage, deleteImage, deleteAllByCategory } from '$lib/server/metadata';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const category = url.searchParams.get('category');
	const images = await getImages(category || undefined);
	return json(images);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	const auth = cookies.get('admin_auth');
	if (auth !== env.ADMIN_PASSWORD) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const data = await request.formData();
	const file = data.get('file');
	const category = data.get('category')?.toString() || 'uncategorized';

	if (!file || !(file instanceof File)) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	const result = await saveImage(file, category);
	return json(result, { status: 201 });
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, cookies }) {
	const auth = cookies.get('admin_auth');
	if (auth !== env.ADMIN_PASSWORD) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();

	if (body.category && body.all === true) {
		await deleteAllByCategory(body.category);
		return json({ success: true });
	}

	if (!body.id) return json({ error: 'Missing id' }, { status: 400 });

	const ok = await deleteImage(body.id);
	return json({ success: ok }, { status: ok ? 200 : 404 });
}
