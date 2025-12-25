import { generateText } from "ai";
import { testApiHandler } from "next-test-api-route-handler";
import { POST } from "@/app/api/ai/answers/route";

jest.mock("ai", () => ({ generateText: jest.fn() }));

const mockGenerateText = generateText as jest.Mock;

const validQuestion = "Explain Nextjs in detail".repeat(5);
const validContent = "Next.js is a frame work for react that".repeat(5);
describe("POST /api/ai/answers", () => {
  it("should return 200 and Ai-generated text when request is valid", async () => {
    const mockResponse = "This is the generated markDown response";
    mockGenerateText.mockResolvedValue({ text: mockResponse });

    const requestBody = { question: validQuestion, content: validContent, userAnswer: "A frameworkfor react" };
    await testApiHandler({
      appHandler: { POST },
      async test({ fetch }) {
        const response = await fetch({
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const json = await response.json();
        expect(response.status).toBe(200);
        expect(json).toEqual({ success: true, data: mockResponse });
        expect(mockGenerateText).toHaveBeenCalledTimes(1);
        expect(mockGenerateText.mock.calls[0][0].prompt).toContain(requestBody.question);
        expect(mockGenerateText.mock.calls[0][0].prompt).toContain(requestBody.content);
        expect(mockGenerateText.mock.calls[0][0].prompt).toContain(requestBody.userAnswer);
      },
    });
  });
});
