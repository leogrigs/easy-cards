import ErrorBoundary from "@/app/error";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Root error boundary", () => {
  it("renders the error message and calls reset on click", () => {
    const reset = jest.fn();
    const error = new Error("boom") as Error & { digest?: string };
    render(<ErrorBoundary error={error} reset={reset} />);

    expect(screen.getByText("boom")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("falls back to a default message when error.message is empty", () => {
    const reset = jest.fn();
    const error = new Error("") as Error & { digest?: string };
    render(<ErrorBoundary error={error} reset={reset} />);

    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
  });
});
