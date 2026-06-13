import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const DATA_DIR = 'data';
const UPLOADS_DIR = 'data/uploads';
const METADATA_FILE = join(DATA_DIR, 'images.json');
const METADATA_BLOB = '_metadata/images.json';

function isVercel() {
	return process.env.VERCEL === '1';
}

function ensureDirs() {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
	if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function compress(buffer) {
	try {
		const { default: sharp } = await import('sharp');
		return await sharp(buffer)
			.resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer();
	} catch {
		return buffer;
	}
}

export async function getImages(category) {
	const images = await readMetadata();
	if (category) return images.filter((img) => img.category === category);
	return images;
}

export async function saveImage(file, category) {
	const images = await readMetadata();
	const id = randomUUID();
	let buffer = Buffer.from(await file.arrayBuffer());
	buffer = await compress(buffer);
	const filename = `${id}.webp`;

	let url;
	if (isVercel()) {
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

export async function deleteImage(id) {
	const images = await readMetadata();
	const index = images.findIndex((img) => img.id === id);
	if (index === -1) return false;

	const image = images[index];
	if (isVercel()) {
		try {
			const { del } = await import('@vercel/blob');
			await del(image.url);
		} catch {
			/* blob may be gone */
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
	if (isVercel()) {
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
	if (isVercel()) {
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
