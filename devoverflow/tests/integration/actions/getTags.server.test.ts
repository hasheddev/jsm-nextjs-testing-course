import { getTags } from "@/lib/actions/tag.action";
import { Tag } from "@/database";

describe("getTags action", () => {
  describe("Validation", () => {
    it("should return an error if invalid params", async () => {
      const invalidParams = { page: "Invalid", pageSize: -5 } as unknown as PaginatedSearchParams;
      const result = await getTags(invalidParams);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain("expected number, received string, Page size must be at least 1");
    });
  });
  describe("Pagination and Sorting", () => {
    beforeEach(async () => {
      const testTags = [
        { name: "javascript", questions: 100, createdAt: "2026-01-01" },
        { name: "react", questions: 50, createdAt: "2026-02-01" },
        { name: "node", questions: 200, createdAt: "2026-03-01" },
      ];
      await Tag.insertMany(testTags);
    });
    afterEach(async () => {
      await Tag.deleteMany({});
    });

    it("should return the first page of Tags sorted by question count (default behaviour)", async () => {
      const params = { page: 1, pageSize: 2 } as unknown as PaginatedSearchParams;
      const result = await getTags(params);
      const { data } = result;

      expect(result.success).toBe(true);
      expect(result.error).not.toBeDefined();
      expect(data?.tags).toHaveLength(2);
      expect(data?.tags[0].name).toBe("node");
      expect(data?.tags[1].name).toBe("javascript");
      expect(data?.isNext).toBe(true);
    });
    it("should return the second page of Tags when paginated", async () => {
      const params = { page: 2, pageSize: 2 } as unknown as PaginatedSearchParams;
      const result = await getTags(params);
      const { data } = result;

      expect(result.success).toBe(true);
      expect(result.error).not.toBeDefined();
      expect(data?.tags).toHaveLength(1);
      expect(data?.tags[0].name).toBe("react");
      expect(data?.isNext).toBe(false);
    });
  });

  describe("Search functionality", () => {
    beforeEach(async () => {
      const testTags = [
        { name: "javascript", questions: 100, createdAt: "2026-01-01" },
        { name: "react", questions: 50, createdAt: "2026-02-01" },
        { name: "node", questions: 200, createdAt: "2026-03-01" },
        { name: "java", questions: 60, createdAt: "2026-02-01" },
      ];
      await Tag.insertMany(testTags);
    });
    afterEach(async () => {
      await Tag.deleteMany({});
    });

    it("should filter tags by partial name match (case insensitive)", async () => {
      const params = { page: 1, pageSize: 2, query: "jav" } as unknown as PaginatedSearchParams;
      const result = await getTags(params);
      const { data } = result;

      expect(result.success).toBe(true);
      expect(result.error).not.toBeDefined();
      expect(data?.tags).toHaveLength(2);
      expect(data?.tags.map((t) => t.name)).toEqual(expect.arrayContaining(["javascript", "java"]));
    });
    it("should return an empty array when no tags match", async () => {
      const params = { page: 1, pageSize: 2, query: "noneexistent" } as unknown as PaginatedSearchParams;
      const result = await getTags(params);
      const { data } = result;

      expect(result.success).toBe(true);
      expect(result.error).not.toBeDefined();
      expect(data?.tags).toHaveLength(0);
    });
  });
});
