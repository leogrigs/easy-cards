import AppLoader from "@/components/AppLoader";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("AppLoader component", () => {
  it("renders correctly", () => {
    const { getByText } = render(<AppLoader />);
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the logo", () => {
    const { getByAltText } = render(<AppLoader />);
    const logo = getByAltText("Logo");
    expect(logo).toBeInTheDocument();
  });

  it("has the correct className", () => {
    const { getByText } = render(<AppLoader />);
    const loader = getByText("Loading...");
    expect(loader.parentElement).toHaveClass(
      "flex flex-col items-center justify-center gap-4 animate-pulse"
    );
  });

  it("renders the Image component with the correct props", () => {
    const { getByAltText } = render(<AppLoader />);
    const logo = getByAltText("Logo");
    expect(logo).toHaveAttribute("src");
    expect(logo).toHaveAttribute("width", "32");
    expect(logo).toHaveAttribute("height", "32");
  });
});
