import { LoaderProvider, useLoader } from "@/providers/LoaderContext";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";

const MockChild = () => {
  const { isLoading, setLoading } = useLoader();

  return (
    <div>
      <p data-testid="loading-state">{isLoading ? "Loading..." : "Idle"}</p>
      <button onClick={() => setLoading(true)}>Start Loading</button>
      <button onClick={() => setLoading(false)}>Stop Loading</button>
    </div>
  );
};

const renderWithLoaderProvider = () =>
  render(
    <LoaderProvider>
      <MockChild />
    </LoaderProvider>
  );

describe("LoaderProvider", () => {
  it("renders children correctly", () => {
    renderWithLoaderProvider();
    expect(screen.getByText("Idle")).toBeInTheDocument();
    expect(screen.getByText("Start Loading")).toBeInTheDocument();
    expect(screen.getByText("Stop Loading")).toBeInTheDocument();
  });

  it("updates loading state to true", () => {
    renderWithLoaderProvider();

    const startButton = screen.getByText("Start Loading");
    act(() => startButton.click());

    expect(screen.getByTestId("loading-state").textContent).toBe("Loading...");
  });

  it("updates loading state to false", () => {
    renderWithLoaderProvider();

    const startButton = screen.getByText("Start Loading");
    const stopButton = screen.getByText("Stop Loading");

    act(() => startButton.click());
    expect(screen.getByTestId("loading-state").textContent).toBe("Loading...");

    act(() => stopButton.click());
    expect(screen.getByTestId("loading-state").textContent).toBe("Idle");
  });

  it("throws an error when useLoader is used outside of LoaderProvider", () => {
    const TestComponent = () => {
      useLoader();
      return <div />;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "useLoader must be used within a LoaderProvider"
    );
  });
});
