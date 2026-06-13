import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const DATA_DIR = 'data';
const UPLOADS_DIR = 'static/uploads';
const METADATA_FILE = join(DATA_DIR, 'images.json');

function ensureDirs() {
	if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
	if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
	if (!existsSync(METADATA_FILE)) writeFileSync(METADATA_FILE, JSON.stringify([]));
}

function readMetadata() {
	ensureDirs();
	return JSON.parse(readFileSync(METADATA_FILE, 'utf-8'));
}

function writeMetadata(data) {
	ensureDirs();
	writeFileSync(METADATA_FILE, JSON.stringify(data, null, 2));
}

/** @param {string} [category] */
export function getImages(category) {
	const images = readMetadata().map((img) => ({
		...img,
		url: img.url || `/uploads/${img.filename}`
	}));
	if (category) return images.filter((img) => img.category === category);
	return images;
}

/** @param {File} file @param {string} category */
export async function saveImage(file, category) {
	const images = readMetadata();
	const id = randomUUID();
	const ext = file.name.split('.').pop() || 'png';
	const filename = `${id}.${ext}`;
	const buffer = Buffer.from(await file.arrayBuffer());

	ensureDirs();
	writeFileSync(join(UPLOADS_DIR, filename), buffer);

	const image = {
		id,
		filename,
		url: `/uploads/${filename}`,
		category,
		originalName: file.name,
		uploadedAt: new Date().toISOString()
	};
	images.push(image);
	writeMetadata(images);
	return image;
}

/** @param {string} id */
export function deleteImage(id) {
	const images = readMetadata();
	const image = images.find((img) => img.id === id);
	if (!image) return false;

	const filepath = join(UPLOADS_DIR, image.filename);
	if (existsSync(filepath)) unlinkSync(filepath);

	writeMetadata(images.filter((img) => img.id !== id));
	return true;
}
