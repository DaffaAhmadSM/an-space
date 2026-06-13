import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const DATA_DIR = 'data';
const UPLOADS_DIR = 'static/uploads';
const METADATA_FILE = join(DATA_DIR, 'images.json');
const METADATA_BLOB = '_metadata/images.json';

function isBlob() {
	return !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL);
}

function ensureDirs() {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
	if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
}

/** @param {Buffer} buffer @param {string} ext */
async function compress(buffer, ext) {
	if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
		return await sharp(buffer)
			.resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer();
	}
	return buffer;
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
	let ext = file.name.split('.').pop()?.toLowerCase() || 'png';
	let buffer = Buffer.from(await file.arrayBuffer());
	buffer = await compress(buffer, ext);
	ext = 'webp';
	const filename = `${id}.${ext}`;

	let url;
	if (isBlob()) {
		const { put } = await import('@vercel/blob');
		const result = await put(`${category}/${filename}`, buffer, {
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
	if (isBlob()) {
		try {
			const { del } = await import('@vercel/blob');
			await del(image.url);
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
	if (isBlob()) {
		try {
			const { get } = await import('@vercel/blob');
			const { blob } = await get(METADATA_BLOB);
			const text = await blob.text();
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
	if (isBlob()) {
		const { put } = await import('@vercel/blob');
		await put(METADATA_BLOB, JSON.stringify(data, null, 2), {
			access: 'public',
			addRandomSuffix: false
		});
	} else {
		ensureDirs();
		writeFileSync(METADATA_FILE, JSON.stringify(data, null, 2));
	}
}
