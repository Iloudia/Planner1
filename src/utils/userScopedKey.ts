const normalizeEmail = (email: string | null | undefined) => String(email ?? "").trim().toLowerCase() || "guest"

export const buildUserScopedKey = (email: string | null | undefined, key: string) => `planner:${normalizeEmail(email)}:${key}`

export const normalizeUserEmail = normalizeEmail
