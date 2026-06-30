import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";

describe("deleting an insight from the database", () => {
  describe("when the target insight exists", () => {
    withDB((fixture) => {
      const insights = [
        {
          id: 1,
          brand: 0,
          createdAt: new Date().toISOString(),
          text: "Keep this row A",
        },
        {
          id: 2,
          brand: 1,
          createdAt: new Date().toISOString(),
          text: "Delete this target row",
        },
        {
          id: 3,
          brand: 4,
          createdAt: new Date().toISOString(),
          text: "Keep this row B",
        },
      ];

      beforeAll(() => {
        fixture.insights.insert(insights);

        deleteInsight({
          db: fixture.db,
          id: 2,
        });
      });

      it("physically removes the target record from the database table", () => {
        const remainingRows = fixture.insights.selectAll();
        const deletedRow = remainingRows.find((row) => row.id === 2);

        expect(deletedRow).toBeUndefined();
      });

      it("leaves all other unrelated records completely untouched", () => {
        const remainingRows = fixture.insights.selectAll();

        // Check that the other two rows are still safely preserved
        expect(remainingRows.length).toBe(2);
        expect(remainingRows.some((row) => row.id === 1)).toBe(true);
        expect(remainingRows.some((row) => row.id === 3)).toBe(true);
      });
    });
  });

  describe("when the target insight does not exist", () => {
    withDB((fixture) => {
      beforeAll(() => {
        fixture.insights.insert([
          {
            brand: 3,
            createdAt: new Date().toISOString(),
            text: "Unrelated insight",
          },
        ]);

        deleteInsight({
          db: fixture.db,
          id: 999,
        });
      });

      it("completes gracefully without throwing errors or dropping valid records", () => {
        const remainingRows = fixture.insights.selectAll();

        expect(remainingRows.length).toBe(1);
        expect(remainingRows[0].id).toBe(1);
      });
    });
  });
});
