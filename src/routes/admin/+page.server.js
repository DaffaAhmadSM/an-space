import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password')?.toString();

		if (password === env.ADMIN_PASSWORD) {
			cookies.set('admin_auth', password, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 24h
			});
			throw redirect(303, '/admin/upload');
		}

		return { error: 'Wrong password' };
	},

	logout: async ({ cookies }) => {
		cookies.delete('admin_auth', { path: '/' });
		throw redirect(303, '/admin');
	}
};
