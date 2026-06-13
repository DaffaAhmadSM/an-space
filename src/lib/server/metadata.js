import { randomUUID } from 'crypto';
import { env } from '$env/dynamic/private';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const useBlob = !!env.BLOB_READ_WRITE_TOKEN;

const DATA_DIR = 'data';
const UPLOADS_DIR = 'static/uploads';
const METADATA_FILE = join(DATA_DIR, 'images.json');
const METADATA_BLOB = '_metadata/images.json';

let blob;
if (useBlob) {
	blob = await import('@vercel/blob');
}

function ensureDirs() {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
	if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
}

/** @param {string} [category] */
export async function getImages(category) {
	const images = await readMetadata();
	if (category) return images.filter((img) => img.category === category);
	return images;
}

/** @param {File} file @param {string} category */
export async function saveImage(file, category) {
	const images = await readMetadata();
	const id = randomUUID();
	const ext = file.name.split('.').pop() || 'png';
	const filename = `${id}.${ext}`;
	const buffer = Buffer.from(await file.arrayBuffer());

	let url;
	if (useBlob) {
		const result = await blob.put(`${category}/${filename}`, buffer, {
			access: 'public',
			addRandomSuffix: false
		});
		url = result.url;
	} else {
		ensureDirs();
		writeFileSync(join(UPLOADS_DIR, filename), buffer);
		url = `/uploads/${filename}`;
	}

	const image = {
		id,
		filename,
		url,
		category,
		originalName: file.name,
		uploadedAt: new Date().toISOString()
	};
	images.push(image);
	await writeMetadata(images);
	return image;
}

/** @param {string} id */
export async function deleteImage(id) {
	const images = await readMetadata();
	const index = images.findIndex((img) => img.id === id);
	if (index === -1) return false;

	const image = images[index];
	if (useBlob) {
		try {
			await blob.del(image.url);
		} catch (e) {
			// blob may already be gone
		}
	} else {
		const filepath = join(UPLOADS_DIR, image.filename);
		if (existsSync(filepath)) unlinkSync(filepath);
	}

	images.splice(index, 1);
	await writeMetadata(images);
	return true;
}

async function readMetadata() {
	if (useBlob) {
		try {
			const { blob: b } = await blob.get(METADATA_BLOB);
			const text = await b.text();
			return JSON.parse(text);
		} catch {
			return [];
		}
	} else {
		ensureDirs();
		if (!existsSync(METADATA_FILE)) return [];
		return JSON.parse(readFileSync(METADATA_FILE, 'utf-8'));
	}
}

async function writeMetadata(data) {
	if (useBlob) {
		await blob.put(METADATA_BLOB, JSON.stringify(data, null, 2), {
			access: 'public',
			addRandomSuffix: false
		});
	} else {
		ensureDirs();
		writeFileSync(METADATA_FILE, JSON.stringify(data, null, 2));
	}
}
