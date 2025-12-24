import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema, SignUpSchema } from "@/lib/validations";
import { mockRouter, mockToast, resetAllMocks } from "@/tests/mocks";
import ROUTES from "@/constants/routes";

const user = userEvent.setup();

describe("AuthForm Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });
  describe("Sign In Form", () => {
    describe("Rendering", () => {
      it("should display all required fields", () => {
        render(
          <AuthForm
            defaultValues={{ email: "", password: "" }}
            formType="SIGN_IN"
            schema={SignInSchema}
            onSubmit={jest.fn()}
          />
        );
        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const button = screen.getByRole("button", { name: "Sign In" });

        expect(email).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(screen.getByText("Don’t have an account?")).toBeInTheDocument();
      });
    });
    describe("Form Validation", () => {
      it("should show validation error for invalid email", async () => {
        const onSubmit = jest.fn();
        render(
          <AuthForm
            defaultValues={{ email: "", password: "" }}
            formType="SIGN_IN"
            schema={SignInSchema}
            onSubmit={onSubmit}
          />
        );

        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const button = screen.getByRole("button", { name: "Sign In" });
        await user.type(email, "test@invalid");
        await user.type(password, "123123123");
        await user.click(button);

        expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should show validation error for invalid password", async () => {
        const onSubmit = jest.fn();
        render(
          <AuthForm
            defaultValues={{ email: "", password: "" }}
            formType="SIGN_IN"
            schema={SignInSchema}
            onSubmit={onSubmit}
          />
        );

        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const button = screen.getByRole("button", { name: "Sign In" });
        await user.type(email, "test@email.com");
        await user.type(password, "1234");
        await user.click(button);

        expect(screen.getByText("Password must be at least 6 characters long.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
    describe("Submission", () => {
      it("should call onSubmit with valid data and display loading state", async () => {
        // const onSubmit = jest.fn().mockResolvedValue({ success: true });
        const onSubmit = jest
          .fn()
          .mockImplementation(() => new Promise((r) => setTimeout(() => r({ success: true }), 200)));
        render(
          <AuthForm
            defaultValues={{ email: "", password: "" }}
            formType="SIGN_IN"
            schema={SignInSchema}
            onSubmit={onSubmit}
          />
        );
        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const button = screen.getByRole("button", { name: "Sign In" });
        await user.type(email, "test@email.com");
        await user.type(password, "1234abCjh#@");
        await user.click(button);
        expect(screen.getByText("Signing In...")).toBeInTheDocument();
        expect(onSubmit).toHaveBeenCalledWith({
          email: "test@email.com",
          password: "1234abCjh#@",
        });
      });
    });
    describe("Success Handling", () => {
      it("should show success toast and redirect to home", async () => {
        const onSubmit = jest.fn().mockResolvedValue({ success: true });

        render(
          <AuthForm
            defaultValues={{ email: "", password: "" }}
            formType="SIGN_IN"
            schema={SignInSchema}
            onSubmit={onSubmit}
          />
        );
        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const button = screen.getByRole("button", { name: "Sign In" });
        await user.type(email, "test@email.com");
        await user.type(password, "1234abCjh#@");
        await user.click(button);
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "You have successfully signed in.",
        });
        expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.HOME);
      });
    });
    describe("Failure Handling", () => {
      it("should show error toast and not redirect to home", async () => {
        const onSubmit = jest
          .fn()
          .mockResolvedValue({ success: false, error: { message: "Sign in failed" }, status: 404 });

        render(
          <AuthForm
            defaultValues={{ email: "", password: "" }}
            formType="SIGN_IN"
            schema={SignInSchema}
            onSubmit={onSubmit}
          />
        );
        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const button = screen.getByRole("button", { name: "Sign In" });
        await user.type(email, "test@email.com");
        await user.type(password, "1234abCjh#@");
        await user.click(button);
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error (404)",
          description: "Sign in failed",
          variant: "destructive",
        });
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });
  });
  describe("Sign Up Form", () => {
    describe("Rendering", () => {
      it("should display all required fields", () => {
        render(
          <AuthForm
            defaultValues={{ email: "", password: "", name: "", username: "" }}
            formType="SIGN_UP"
            schema={SignUpSchema}
            onSubmit={jest.fn()}
          />
        );
        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const name = screen.getByLabelText("Name");
        const username = screen.getByLabelText("Username");
        const button = screen.getByRole("button", { name: "Sign Up" });

        expect(email).toBeInTheDocument();
        expect(password).toBeInTheDocument();
        expect(name).toBeInTheDocument();
        expect(username).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(screen.getByText("Already have an account?")).toBeInTheDocument();
      });
    });

    describe("Validation", () => {
      it("should show validaton error for invalid inputs", async () => {
        const onSubmit = jest.fn();
        render(
          <AuthForm
            defaultValues={{ email: "", password: "", name: "", username: "" }}
            formType="SIGN_UP"
            schema={SignUpSchema}
            onSubmit={onSubmit}
          />
        );
        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const name = screen.getByLabelText("Name");
        const username = screen.getByLabelText("Username");
        const button = screen.getByRole("button", { name: "Sign Up" });

        await user.type(email, "invalidemail");
        await user.type(password, "in");
        await user.type(name, "invalid@");
        await user.type(username, "us");
        await user.click(button);

        expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();
        expect(screen.getByText("Name can only contain letters and spaces.")).toBeInTheDocument();
        expect(screen.getByText("Username must be at least 3 characters long.")).toBeInTheDocument();
        expect(screen.getByText("Please provide a valid email address.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();

        await user.clear(email);
        await user.clear(password);
        await user.clear(name);
        await user.clear(username);
        await user.click(button);

        expect(screen.getByText("Email is required.")).toBeInTheDocument();
        expect(screen.getByText("Password must be at least 6 characters long.")).toBeInTheDocument();
        expect(screen.getByText("Username must be at least 3 characters long.")).toBeInTheDocument();
        expect(screen.getByText("Name is required.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should show validaton error for weak password", async () => {
        const onSubmit = jest.fn();
        render(
          <AuthForm
            defaultValues={{ email: "", password: "", name: "", username: "" }}
            formType="SIGN_UP"
            schema={SignUpSchema}
            onSubmit={onSubmit}
          />
        );
        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const name = screen.getByLabelText("Name");
        const username = screen.getByLabelText("Username");
        const button = screen.getByRole("button", { name: "Sign Up" });

        await user.type(email, "nvalid@email.com");
        await user.type(password, "12345677");
        await user.type(name, "validName");
        await user.type(username, "validUserName");
        await user.click(button);

        expect(screen.getByText("Password must contain at least one uppercase letter.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();

        await user.clear(password);
        await user.type(password, "1234567E");
        await user.click(button);

        expect(screen.getByText("Password must contain at least one lowercase letter.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();

        await user.clear(password);
        await user.type(password, "BsAlonHer");
        await user.click(button);

        expect(screen.getByText("Password must contain at least one number.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();

        await user.clear(password);
        await user.type(password, "1234567Bs");
        await user.click(button);

        expect(screen.getByText("Password must contain at least one special character.")).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
