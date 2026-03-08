export const createClientId = (prefix: string) => {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return `${prefix}-${random}`
}
