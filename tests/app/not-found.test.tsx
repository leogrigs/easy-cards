import NotFound from "@/app/not-found";
import { render, screen } from "@testing-library/react";

describe("NotFound page", () => {
  it("shows the 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: /404/i })).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
