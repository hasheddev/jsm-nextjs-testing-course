import { fireEvent, screen, render } from "@testing-library/react";

import { Button } from "@/components/ui/button";

describe("Button Component - TDD Approach", () => {
  it("should render a button with text", () => {
    const text = "Click me";
    render(<Button>{text}</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(text);
  });

  it("should call the onClick when button is clicked", () => {
    const text = "Click me";
    const onClick = jest.fn();
    render(<Button onClick={onClick}>{text}</Button>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("should render button with the correct varaint", () => {
    const text = "Click me";

    render(<Button variant="destructive">{text}</Button>);

    expect(screen.getByText(text)).toHaveClass("bg-red-500");
  });

  //   it("should render button with the correct disabled state", () => {
  //     const text = "Click me";

  //     render(<Button disabled>{text}</Button>);

  //     expect(screen.getByText(text)).toHaveAttribute("disabled");
  //   });
});
