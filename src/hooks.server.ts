import { getValidatedSession } from '$lib/server/session'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const handleAuth: Handle = async ({ event, resolve }) => {
    const session = await getValidatedSession()
    event.locals.session = session

    return resolve(event)
}

export const handle = sequence(handleAuth)