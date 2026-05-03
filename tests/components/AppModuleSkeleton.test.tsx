import { AppModuleSkeleton } from "@/components/AppModuleSkeleton";
import { render, screen } from "@testing-library/react";

describe("AppModuleSkeleton", () => {
  it("renders a skeleton placeholder card", () => {
    render(<AppModuleSkeleton />);
    expect(screen.getByTestId("module-skeleton")).toBeInTheDocument();
  });
});
