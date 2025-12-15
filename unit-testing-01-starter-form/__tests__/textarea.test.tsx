import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { TextArea } from "@/components/input-fields/TextArea";

export const TestWrapper = ({
  initilValue,
  maxWords,
}: {
  initilValue: string;
  maxWords?: number;
}) => {
  const [value, setValue] = useState(initilValue);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value);

  return (
    <TextArea
      label="Description"
      name="description"
      onChange={handleChange}
      value={value}
      maxWords={maxWords}
    />
  );
};

describe("TextArea", () => {
  it("updates value and does not show error when typing within word limit", async () => {
    const user = userEvent.setup();

    render(<TestWrapper initilValue="" maxWords={3} />);

    const textArea = screen.getByRole("textbox");
    const text = "I am a full-stack developer";
    await user.type(textArea, text);

    expect(textArea).toHaveValue(text);
    expect(
      screen.queryByText(/Maximum 10 words allowed/)
    ).not.toBeInTheDocument();
  });

  it("clears error message when word count becomes valid", async () => {
    const user = userEvent.setup();

    render(<TestWrapper initilValue="" maxWords={10} />);

    const textArea = screen.getByRole("textbox");
    const text =
      "I am a full-stack developer Testing error should error out here with this value";
    await user.type(textArea, text);

    expect(textArea).toHaveValue(text);
    expect(screen.queryByText(/Maximum 10 words allowed/)).toBeInTheDocument();

    const validWord = "I am a full-stack developer";
    await user.clear(textArea);
    await user.type(textArea, validWord);
    expect(
      screen.queryByText(/Maximum 10 words allowed/)
    ).not.toBeInTheDocument();
  });
});
