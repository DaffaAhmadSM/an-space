import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const UPLOADS_DIR = 'data/uploads';

/** @type {import('./$types').RequestHandler} */
export function GET({ params }) {
	const filename = params.filename;
	const filepath = join(UPLOADS_DIR, filename);

	if (!existsSync(filepath)) {
		return new Response('Not found', { status: 404 });
	}

	const buffer = readFileSync(filepath);
	const ext = filename.split('.').pop()?.toLowerCase();

	const mimeTypes = {
		webp: 'image/webp',
		png: 'image/png',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		gif: 'image/gif',
		svg: 'image/svg+xml'
	};
	const contentType = mimeTypes[ext] || 'application/octet-stream';

	return new Response(buffer, {
		headers: {
			'Content-Type': contentType,
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
}
