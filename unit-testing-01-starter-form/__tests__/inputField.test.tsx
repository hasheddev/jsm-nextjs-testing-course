import { render, screen, fireEvent } from "@testing-library/react";
//render component,find elements in screen(screen) and simulate user actions
import { InputField } from "@/components/input-fields/InputField";

//test group
describe("InputField", () => {
  const label = "First Name";
  const name = "first name";
  const placeholder = "John";

  it("renders correctly with placeholder and label", () => {
    render(
      <InputField
        label={label}
        name={name}
        placeholder={placeholder}
        onChange={() => {}}
        value=""
        required
      />
    );
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(
      <InputField
        label={label}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value=""
        required
      />
    );
    const input = screen.getByPlaceholderText(placeholder);
    fireEvent.change(input, { target: { value: "Jane" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("shows error if required and blurred with empty value", () => {
    const handleChange = jest.fn();
    render(
      <InputField
        label={label}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value=""
        required
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.blur(input);
    const errorMessage = screen.getByText(`${label} is required.`);
    expect(errorMessage).toBeInTheDocument();
  });

  it("does not shows error if required and value is present", () => {
    render(
      <InputField
        label={label}
        name={name}
        placeholder={placeholder}
        onChange={() => {}}
        value="John"
        required
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.blur(input);
    const errorMessage = screen.queryByText(`${label} is required.`);
    expect(errorMessage).not.toBeInTheDocument();
  });
});
