import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import QuestionForm from "@/components/forms/QuestionForm";
import { loremText, MockEditor, mockRouter, resetAllMocks } from "@/tests/mocks";
import { createQuestion } from "@/lib/actions/question.action";
import { toast } from "@/hooks/use-toast";

//const mockCreateQuestion = jest.fn();
//The const intialization runst after hoisting of jest.mock() calls leading to reference error

jest.mock("@/components/editor", () => MockEditor);
jest.mock("@/lib/actions/question.action", () => ({ createQuestion: jest.fn() }));

let user: ReturnType<typeof userEvent.setup>;

const mockCreateQuestion = createQuestion as jest.MockedFunction<typeof createQuestion>;

describe("QuestionForm Component", () => {
  beforeEach(() => {
    resetAllMocks();
    user = userEvent.setup();
    mockCreateQuestion.mockClear();
  });

  describe("rendering", () => {
    it("Should render all form fields", async () => {
      render(<QuestionForm />);

      expect(screen.getByLabelText(/Question title/i)).toBeInTheDocument();
      expect(await screen.findByLabelText(/Detailed explanation of your problem/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Add tags/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /ask a Question/i })).toBeInTheDocument();
    });
  });
  describe("Validation", () => {
    it("should show validation errors when form is submitted empty", async () => {
      render(<QuestionForm />);

      const submitBtn = screen.getByRole("button", {
        name: /ask a question/i,
      });

      await user.click(submitBtn);

      expect(await screen.findByText(/title must be at least 5 characters/i)).toBeInTheDocument();
      expect(await screen.findByText(/minimum of 100 characters/i)).toBeInTheDocument();
      expect(await screen.findByText(/add at least one tag/i)).toBeInTheDocument();
    });
  });
  describe("Submission", () => {
    it("should submit form successfully with valid data", async () => {
      mockCreateQuestion.mockResolvedValue({ success: true, data: { _id: "123", answers: 1 } as Question });
      render(<QuestionForm />);

      const submitBtn = screen.getByRole("button", {
        name: /ask a question/i,
      });

      const titleInput = screen.getByLabelText(/Question title/i);
      await user.type(titleInput, "Unit Testing Title");
      const editorTextArea = await screen.findByTestId("mdx-editor");
      await user.click(editorTextArea);
      //await user.type(editorTextArea, loremText);
      await user.paste(loremText);
      const tagInput = screen.getByPlaceholderText(/Add tags/i);
      fireEvent.change(tagInput, { target: { value: "react" } });
      fireEvent.keyDown(tagInput, { key: "Enter" });
      // user.type(tagInput, "react{enter}");
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(createQuestion).toHaveBeenCalledWith({
          title: "Unit Testing Title",
          content: loremText,
          tags: ["react"],
        });
      });

      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Success",
          description: "Your question has been posted successfully.",
        })
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/questions/123");
    });
    it("should display proper message for failed submission", async () => {
      mockCreateQuestion.mockResolvedValue({
        success: false,
        status: 400,
        error: { message: "Failed To Submit" },
      });
      render(<QuestionForm />);

      const submitBtn = screen.getByRole("button", {
        name: /ask a question/i,
      });

      const titleInput = screen.getByLabelText(/Question title/i);
      await user.type(titleInput, "Unit Testing Title");
      const editorTextArea = await screen.findByTestId("mdx-editor");
      await user.click(editorTextArea);
      //await user.type(editorTextArea, loremText);
      await user.paste(loremText);
      const tagInput = screen.getByPlaceholderText(/Add tags/i);
      fireEvent.change(tagInput, { target: { value: "react" } });
      fireEvent.keyDown(tagInput, { key: "Enter" });
      // user.type(tagInput, "react{enter}");
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(createQuestion).toHaveBeenCalledWith({
          title: "Unit Testing Title",
          content: loremText,
          tags: ["react"],
        });
      });
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: `Error (400)`,
          description: "Failed To Submit",
          variant: "destructive",
        })
      );
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
