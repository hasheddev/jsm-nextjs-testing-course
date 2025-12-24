import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import AnswerForm from "@/components/forms/AnswerForm";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { MockEditor, mockSession, mockToast, mockUseSession, resetAllMocks } from "@/tests/mocks";

const user = userEvent.setup();

jest.mock("@/components/editor", () => MockEditor);
jest.mock("@/lib/actions/answer.action", () => ({
  createAnswer: jest.fn(),
}));
jest.mock("@/lib/api", () => ({ api: { ai: { getAnswer: jest.fn() } } }));

const mockCreateAnswer = createAnswer as jest.MockedFunction<typeof createAnswer>;
const mockApiAnswer = api.ai.getAnswer as jest.MockedFunction<typeof api.ai.getAnswer>;

describe("AnswerForm", () => {
  beforeEach(() => {
    resetAllMocks();
  });
  describe("AI Generation", () => {
    it("should generate an AI answer for authenticated user", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn(),
      });
      mockApiAnswer.mockResolvedValue({
        success: true,
        data: "AI generated answer",
      });
      render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content" />);
      await user.click(screen.getByRole("button", { name: /generate ai answer/i }));

      expect(mockApiAnswer).toHaveBeenCalledWith("Test Question", "Test Content", "");
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "The AI has successfully generated an answer.",
          title: "AI Answer Generated",
        })
      );
    });
    it("should not generate an AI answer for unauthenticated user", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: jest.fn(),
      });
      render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content" />);
      await user.click(screen.getByRole("button", { name: /generate ai answer/i }));

      expect(mockApiAnswer).not.toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "You must log in to generate an AI answer.",
          title: "Please log in",
        })
      );
    });
    it("should show proper message for failed AI answer generation", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn(),
      });
      mockApiAnswer.mockResolvedValue({
        success: false,
        error: "AI generated answer failed",
      });
      render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content" />);
      await user.click(screen.getByRole("button", { name: /generate ai answer/i }));

      expect(mockApiAnswer).toHaveBeenCalledWith("Test Question", "Test Content", "");
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: `Failed to generate AI answer. Please try again. ${JSON.stringify("AI generated answer failed")}`,
          variant: "destructive",
        })
      );
    });
  });
  describe("Submission", () => {
    it("should submit form successfully with valid data", async () => {
      mockCreateAnswer.mockResolvedValue({ success: true });
      render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content" />);
      await user.type(await screen.findByTestId("mdx-editor"), "This is my Answer to the question".repeat(5));
      await user.click(screen.getByRole("button", { name: /post answer/i }));

      await waitFor(() => {
        expect(mockCreateAnswer).toHaveBeenCalledWith({
          content: "This is my Answer to the question".repeat(5),
          questionId: "123",
        });
      });

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Your answer has been created successfully.",
          title: "Success",
        })
      );
    });
    it("should disable submit button when form is submitting", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn(),
      });
      mockCreateAnswer.mockImplementation(() => new Promise(() => {}));
      mockApiAnswer.mockImplementation(() => new Promise(() => {}));
      render(<AnswerForm questionId="123" questionTitle="Test Question" questionContent="Test Content" />);
      await user.type(await screen.findByTestId("mdx-editor"), "This is my Answer to the question".repeat(5));
      const submitBtn = screen.getByRole("button", { name: /post answer/i });
      const generateBtn = await screen.findByRole("button", { name: /generate ai answer/i });
      await user.click(submitBtn);
      await user.click(generateBtn);
      await waitFor(() => {
        expect(submitBtn).toHaveAttribute("disabled");
        expect(screen.getByText(/Posting/i)).toBeInTheDocument();
        expect(generateBtn).toBeDisabled();
        expect(screen.getByText(/generating/i)).toBeInTheDocument();
      });
    });
  });
});
