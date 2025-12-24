import { screen, render } from "@testing-library/react";

import { MockEditDeleteAction, MockImage, MockMetric, MockLink } from "@/tests/mocks";
import QuestionCard from "@/components/cards/QuestionCard";
import { getTimeStamp } from "@/lib/utils";

jest.mock("next/link", () => MockLink);
jest.mock("next/image", () => MockImage);
jest.mock("@/components/user/EditDeleteAction", () => MockEditDeleteAction);
jest.mock("@/components/Metric", () => ({ Metric: MockMetric }));

const getMockQuestion = () =>
  ({
    _id: "123",
    title: "How To Unit Test a Nextjs component",
    content: "This is a sample Question content",
    tags: [
      { _id: "tag1", name: "javascript" },
      { _id: "tag2", name: "next.js" },
    ],
    author: {
      _id: "user1",
      name: "John Doe",
      image: "/images/user.jpg",
    },
    createdAt: new Date("2025-09-01T12:00:00Z"),
    upvotes: 10,
    downvotes: 0,
    answers: 5,
    views: 100,
  }) as Question;

const relativeTimeText: string = getTimeStamp(new Date("2025-09-01T12:00:00Z"));

describe("QuestionCard component", () => {
  describe("Rendering", () => {
    it("sould render a all elements", () => {
      const question = getMockQuestion();
      render(<QuestionCard question={question} />);

      //Title
      expect(screen.getByText(question.title)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: question.title })).toHaveAttribute("href", "/questions/123");
      //Tags
      expect(screen.getByText("javascript")).toBeInTheDocument();
      expect(screen.getByText("next.js")).toBeInTheDocument();
      //Avatar
      expect(screen.getByRole("img", { name: `${question.author.name}'s avatar` })).toBeInTheDocument();
      expect(screen.getByText(question.author.name)).toBeInTheDocument();
      //TimeStaamp
      expect(screen.getByText(relativeTimeText)).toBeInTheDocument();
      //Metrics
      expect(screen.getByText(`${question.upvotes} Votes`)).toBeInTheDocument();
      expect(screen.getByText(`${question.answers} Answers`)).toBeInTheDocument();
      expect(screen.getByText(`${question.views} Views`)).toBeInTheDocument();
    });
    describe("Action Buttons", () => {
      const question = getMockQuestion();
      it("should render edit/delete actions when showActionBtns is true", () => {
        render(<QuestionCard question={question} showActionBtns={true} />);

        expect(screen.getByText(/edit/i)).toBeInTheDocument();
        expect(screen.getByText(/delete/i)).toBeInTheDocument();
      });

      it("should hide edit/delete actions when showActionBtns is false", () => {
        render(<QuestionCard question={question} showActionBtns={false} />);

        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
      });
    });
    describe("Responsiveness", () => {
      const question = getMockQuestion();
      it("should hide timestamp on small screens", () => {
        Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });
        window.dispatchEvent(new Event("resize"));

        render(<QuestionCard question={question} showActionBtns={true} />);

        const timestamp = screen.getByText(relativeTimeText, { selector: "span" });
        expect(timestamp).toHaveClass("sm:hidden");
      });

      it("should hide timestamp on smal screens", () => {
        Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });
        window.dispatchEvent(new Event("resize"));

        render(<QuestionCard question={question} showActionBtns={true} />);

        const timestamp = screen.getByText(relativeTimeText, { selector: "span" });
        expect(timestamp).toBeVisible();
        const metric = screen.getAllByTestId("metric")[0];
        expect(metric).toBeVisible();
      });
    });
  });
});
