import { expect } from "jsr:@std/expect"
import { beforeAll, describe, it } from "jsr:@std/testing/bdd"
import type { Insight } from "$models/insight.ts"
import { withDB } from "../testing.ts"
import addInsight from "./add-insight.ts"

describe("adding an insight into the database", () => {
  withDB((fixture) => {
    let result: Insight
    const testBrand = 2
    const testText = "Excellent target metrics analysis"

    beforeAll(() => {
      result = addInsight({
        db: fixture.db,
        brand: testBrand,
        text: testText
      })
    })

    it("returns the freshly created insight object structure", () => {
      expect(result).toBeDefined()
      expect(result.id).toBeGreaterThan(0)
      expect(result.brand).toBe(testBrand)
      expect(result.text).toBe(testText)
    })

    it("automatically generates a valid JavaScript Date instance for createdAt", () => {
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(isNaN(result.createdAt.getTime())).toBe(false)
    })

    it("physically persists the row inside the underlying database architecture", () => {
      const dbRows = fixture.insights.select()
      
      const persistedRow = dbRows.find((row) => row.id === result.id)

      expect(persistedRow).toBeDefined()
      expect(persistedRow?.brand).toBe(testBrand)
      expect(persistedRow?.text).toBe(testText)
      expect(typeof persistedRow?.createdAt).toBe("string")
    })
  })
})