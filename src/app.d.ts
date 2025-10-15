// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session } from "$lib/server/session/session";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | undefined
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
