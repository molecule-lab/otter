function safeParseInt(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback
  }
  const parsed = parseInt(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

export { safeParseInt }
