import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').PageServerLoad} */
export function load({ cookies }) {
	const auth = cookies.get('admin_auth');
	if (auth !== env.ADMIN_PASSWORD) {
		throw redirect(303, '/admin');
	}
}
