import { describe, expect, it } from "vitest"

import { safeParseInt } from "@/lib/safeParseInt"

describe("safeParseInt", () => {
  it("return the string value converted to number", () => {
    expect(safeParseInt("100", 10)).toBe(100)
  })

  it("return the fallback value if string is not parsed to integer", () => {
    expect(safeParseInt("avc", 10)).toBe(10)
  })

  it("return the fallback value if string is undefined", () => {
    expect(safeParseInt(undefined, 10)).toBe(10)
  })
})
