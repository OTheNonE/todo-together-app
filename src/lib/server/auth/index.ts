
function generateSecureRandomString(): string {
    const alphabet = "abcdefghijkmnpqrstuvwxyz23456789"

    const bytes = new Uint8Array(24)
    crypto.getRandomValues(bytes)

    let id = "";
    for (let i = 0; i < bytes.length; i++) {
        id += alphabet[bytes[i] >> 3];
    }

    return id
}


async function createSession() {
    const now = new Date()

    const id = generateSecureRandomString()
    const secret = generateSecureRandomString()
    const secretHash = await hashSecret(secret)

    const token = `${id}.${secret}`

    const session = {
        id,
        secretHash,
        createdAt: now,
        token
    }
    
}

async function hashSecret(secret: string): Promise<Uint8Array> {
    const secretBytes = new TextEncoder().encode(secret)
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes)
    return new Uint8Array(secretHashBuffer)
}