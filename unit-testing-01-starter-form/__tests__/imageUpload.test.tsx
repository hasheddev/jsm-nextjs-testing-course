import { render, screen, fireEvent } from "@testing-library/react";
//render component,find elements in screen(screen) and simulate user actions
import { ImageUpload } from "@/components/input-fields/ImageUpload";

//test group
describe("ImageUpload", () => {
  const mockHandleChange = jest.fn();
  it("calls handleChange with the correct file when a file is selected", () => {
    render(<ImageUpload handleChange={mockHandleChange} />);

    const file = new File(["Dummy content"], "profile.png", {
      type: "image/png",
    });
    const fileInput = screen.getByTestId("file-upload");
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockHandleChange).toHaveBeenCalled();
    expect(mockHandleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([file]),
        }),
      })
    );
  });

  it("calls handleChange when a single valid file is dropped", () => {
    render(<ImageUpload handleChange={mockHandleChange} />);

    const file = new File(["Dummy content"], "profile.png", {
      type: "image/png",
    });

    const data = { dataTransfer: { files: [file] } };
    const dropZone = screen.getByTestId("drop-zone");
    if (dropZone) {
      fireEvent.drop(dropZone, data);
    }
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });

  it("does not call handleChange when a single non-image file is dropped", () => {
    render(<ImageUpload handleChange={mockHandleChange} />);

    const file = new File(["Dummy content"], "profile.pdf", {
      type: "application/pdf",
    });

    const data = { dataTransfer: { files: [file] } };
    const dropZone = screen.getByTestId("drop-zone");
    if (dropZone) {
      fireEvent.drop(dropZone, data);
    }
    expect(mockHandleChange).toHaveBeenCalledTimes(0);
  });

  it("clears error message after a successful file upload following an invalid upload", () => {
    render(<ImageUpload handleChange={mockHandleChange} />);

    const file1 = new File(["Dummy content"], "profile.png", {
      type: "image/png",
    });
    const file2 = new File(["Dummy content two"], "profile.png", {
      type: "image/png",
    });

    const invalidData = { dataTransfer: { files: [file1, file2] } };
    const dropZone = screen.getByTestId("drop-zone");
    if (dropZone) {
      fireEvent.drop(dropZone, invalidData);
    }

    expect(
      screen.getByText(/Only one image can be uploaded./i)
    ).toBeInTheDocument();

    const validData = { dataTransfer: { files: [file1] } };
    fireEvent.drop(dropZone, validData);
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});
