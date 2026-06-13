import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { env } from '$env/dynamic/private';

const DATA_DIR = 'data';
const UPLOADS_DIR = 'data/uploads';
const METADATA_FILE = join(DATA_DIR, 'images.json');

function isVercel() {
	return !!env.DATABASE_URL;
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

async function ensureTable(sql) {
	await sql`CREATE TABLE IF NOT EXISTS images (
		id TEXT PRIMARY KEY,
		url TEXT NOT NULL,
		filename TEXT NOT NULL,
		category TEXT NOT NULL,
		original_name TEXT NOT NULL,
		uploaded_at TEXT NOT NULL,
		data BYTEA NOT NULL
	)`;
	try {
		await sql`ALTER TABLE images ADD COLUMN IF NOT EXISTS data BYTEA`;
	} catch {
		/* column exists or not supported */
	}
}

export async function getImages(category) {
	if (isVercel()) {
		const { neon } = await import('@neondatabase/serverless');
		const sql = neon(env.DATABASE_URL);
		await ensureTable(sql);
		const rows = category
			? await sql`SELECT id, url, filename, category, original_name, uploaded_at FROM images WHERE category = ${category} ORDER BY uploaded_at DESC`
			: await sql`SELECT id, url, filename, category, original_name, uploaded_at FROM images ORDER BY uploaded_at DESC`;
		return rows.map((r) => ({
			id: r.id,
			url: r.url,
			filename: r.filename,
			category: r.category,
			originalName: r.original_name,
			uploadedAt: r.uploaded_at
		}));
	}

	const images = await readMetadata();
	if (category) return images.filter((img) => img.category === category);
	return images;
}

export async function saveImage(file, category) {
	const id = randomUUID();
	let buffer = Buffer.from(await file.arrayBuffer());
	buffer = await compress(buffer);
	const filename = `${id}.webp`;

	if (isVercel()) {
		const { neon } = await import('@neondatabase/serverless');
		const sql = neon(env.DATABASE_URL);
		await ensureTable(sql);
		await sql`INSERT INTO images (id, filename, url, category, original_name, uploaded_at, data)
			VALUES (${id}, ${filename}, ${'/api/image/' + id}, ${category}, ${file.name}, ${new Date().toISOString()}, ${buffer})`;
		return {
			id,
			url: `/api/image/${id}`,
			filename,
			category,
			originalName: file.name,
			uploadedAt: new Date().toISOString()
		};
	}

	ensureDirs();
	writeFileSync(join(UPLOADS_DIR, filename), buffer);
	const url = `/uploads/${filename}`;

	const image = {
		id,
		filename,
		url,
		category,
		originalName: file.name,
		uploadedAt: new Date().toISOString()
	};
	const images = await readMetadata();
	images.push(image);
	await writeMetadata(images);
	return image;
}

export async function deleteAllByCategory(category) {
	if (isVercel()) {
		const { neon } = await import('@neondatabase/serverless');
		const sql = neon(env.DATABASE_URL);
		await sql`DELETE FROM images WHERE category = ${category}`;
		return;
	}

	const images = await readMetadata();
	const toDelete = images.filter((img) => img.category === category);
	for (const img of toDelete) {
		const filepath = join(UPLOADS_DIR, img.filename);
		if (existsSync(filepath)) unlinkSync(filepath);
	}
	await writeMetadata(images.filter((img) => img.category !== category));
}

export async function deleteImage(id) {
	if (isVercel()) {
		const { neon } = await import('@neondatabase/serverless');
		const sql = neon(env.DATABASE_URL);
		await ensureTable(sql);
		await sql`DELETE FROM images WHERE id = ${id}`;
		return true;
	}

	const images = await readMetadata();
	const index = images.findIndex((img) => img.id === id);
	if (index === -1) return false;
	const image = images[index];
	const filepath = join(UPLOADS_DIR, image.filename);
	if (existsSync(filepath)) unlinkSync(filepath);
	images.splice(index, 1);
	await writeMetadata(images);
	return true;
}

/** Read image data for serving via /api/image/[id] */
export async function getImageData(id) {
	if (isVercel()) {
		const { neon } = await import('@neondatabase/serverless');
		const sql = neon(env.DATABASE_URL);
		const rows = await sql`SELECT data FROM images WHERE id = ${id}`;
		if (rows.length === 0) return null;
		return rows[0].data;
	}

	const images = await readMetadata();
	const image = images.find((img) => img.id === id);
	if (!image) return null;
	const filepath = join(UPLOADS_DIR, image.filename);
	if (!existsSync(filepath)) return null;
	return readFileSync(filepath);
}

async function readMetadata() {
	ensureDirs();
	if (!existsSync(METADATA_FILE)) return [];
	return JSON.parse(readFileSync(METADATA_FILE, 'utf-8'));
}

async function writeMetadata(data) {
	ensureDirs();
	writeFileSync(METADATA_FILE, JSON.stringify(data, null, 2));
}
