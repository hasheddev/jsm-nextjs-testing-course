import { Question } from "@/database";
import Tag, { ITagDoc } from "@/database/tag.model";
import User, { IUserDoc } from "@/database/user.model";
import { getQuestions } from "@/lib/actions/question.action";

describe("getQuestions action", () => {
  let testUser: IUserDoc; // Need to store user reference
  let testTags: ITagDoc[]; // Need to store tag references
  describe("validation", () => {
    it("should return error for invalid params", async () => {
      const invalidParams = {
        page: "invalid", // String instead of number
        pageSize: -5, // Negative instead of positive
      } as unknown as PaginatedSearchParams;

      const result = await getQuestions(invalidParams);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error && result.error.message).toContain(
        "Invalid input: expected number, received string, Page size must be at least 1"
      );
    });
  });

  describe("Pagination and Sorting", () => {
    beforeEach(async () => {
      // Step 1: Create the author
      testUser = await User.create({
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
      });
      // Step 2: Create tags
      testTags = await Tag.insertMany([
        { name: "javascript", questions: 0 },
        { name: "react", questions: 0 },
        { name: "node", questions: 0 },
      ]);
      // Step 3: Create questions with deliberate values
      const testQuestions = [
        {
          title: "How to use React hooks?",
          content: "I need help with React hooks",
          author: testUser._id, // Reference to created user
          tags: [testTags[1]._id], // Reference to "react" tag
          views: 100,
          upvotes: 50, // Lowest upvotes
          answers: 5, // Has answers
          createdAt: new Date("2024-01-01"), // Oldest date
        },
        {
          title: "JavaScript async/await explained",
          content: "Can someone explain async/await?",
          author: testUser._id,
          tags: [testTags[0]._id], // Reference to "javascript" tag
          views: 200,
          upvotes: 100, // Highest upvotes
          answers: 0, // No answers (for unanswered filter)
          createdAt: new Date("2024-02-01"), // Middle date
        },
        {
          title: "Node.js best practices",
          content: "What are the best practices for Node.js?",
          author: testUser._id,
          tags: [testTags[2]._id], // Reference to "node" tag
          views: 150,
          upvotes: 75, // Middle upvotes
          answers: 3, // Has answers
          createdAt: new Date("2024-03-01"), // Newest date
        },
      ];
      await Question.insertMany(testQuestions);
    });

    afterEach(async () => {
      await Question.deleteMany({});
      await Tag.deleteMany({});
      await User.deleteMany({});
    });
    it("should return the first page of questions sorted by creation date (default behavior)", async () => {
      const result = await getQuestions({ page: 1, pageSize: 2 });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(2);
      // Newest first (March), then February
      expect(result.data?.questions[0].title).toBe("Node.js best practices");
      expect(result.data?.questions[1].title).toBe("JavaScript async/await explained");
      expect(result.data?.isNext).toBe(true); // January question is on page 2
    });
    it("should return the second page of questions when paginated", async () => {
      const result = await getQuestions({ page: 2, pageSize: 2 });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("How to use React hooks?");
      expect(result.data?.isNext).toBe(false); // No more pages
    });
    it("should sort questions by newest when filter is 'newest'", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10, // Large page size to get all results
        filter: "newest",
      });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(3);
      // All three, ordered by date descending
      expect(result.data?.questions[0].title).toBe("Node.js best practices");
      expect(result.data?.questions[1].title).toBe("JavaScript async/await explained");
      expect(result.data?.questions[2].title).toBe("How to use React hooks?");
    });
    it("should filter and sort unanswered questions when filter is 'unanswered'", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        filter: "unanswered",
      });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("JavaScript async/await explained");
      // Explicitly verify it's actually unanswered
      expect(result.data?.questions[0].answers).toBe(0);
    });
    it("should sort questions by upvotes when filter is 'popular'", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        filter: "popular",
      });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(3);
      // Sorted by upvotes: 100, 75, 50
      expect(result.data?.questions[0].title).toBe("JavaScript async/await explained");
      expect(result.data?.questions[0].upvotes).toBe(100);
      expect(result.data?.questions[1].upvotes).toBe(75);
      expect(result.data?.questions[2].upvotes).toBe(50);
    });
  });
  describe("Search Functionality", () => {
    let testUser: IUserDoc;
    let testTag: ITagDoc;

    beforeEach(async () => {
      testUser = await User.create({
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
      });

      testTag = await Tag.create({ name: "javascript", questions: 0 });

      // Simpler data focused only on searchability
      await Question.insertMany([
        {
          title: "JavaScript array methods",
          content: "How to use map, filter, and reduce?",
          author: testUser._id,
          tags: [testTag._id],
        },
        {
          title: "React hooks tutorial",
          content: "Learn about useState and useEffect",
          author: testUser._id,
          tags: [testTag._id],
        },
        {
          title: "Python data structures",
          content: "Understanding lists and dictionaries",
          author: testUser._id,
          tags: [testTag._id],
        },
      ]);
    });
    it("should filter questions by title match (case-insensitive)", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        query: "javascript", // lowercase
      });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("JavaScript array methods");
    });
    it("should filter questions by content match (case-insensitive)", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        query: "useState", // Only in content, not in title
      });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("React hooks tutorial");
    });
    it("should return an empty array when no questions match the query", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        query: "nonexistent",
      });

      expect(result.success).toBe(true); // Still successful
      expect(result.data?.questions).toHaveLength(0); // Just empty
    });
    it("should search and filter together", async () => {
      const result = await getQuestions({
        page: 1,
        pageSize: 10,
        query: "react",
        filter: "newest",
      });

      expect(result.success).toBe(true);
      expect(result.data?.questions).toHaveLength(1);
      expect(result.data?.questions[0].title).toBe("React hooks tutorial");
    });
  });
});
