import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/AuthContext";
import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

jest.mock("@/providers/AuthContext", () => ({
  useAuth: jest.fn(() => ({ logout: jest.fn() })),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Logo</div>),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const renderSidebar = () =>
  render(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );

describe("AppSidebar", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    renderSidebar();
  });

  it("renders the sidebar", () => {
    expect(screen.getByText("Easy Cards")).toBeInTheDocument();
  });

  it("renders the logo", async () => {
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("renders the navigation items", async () => {
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
  });

  it("renders the logout button", async () => {
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("calls the logout function when the logout button is clicked", async () => {
    const logoutButton = screen.getByRole("button", { name: "Logout" });
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("renders navigation items as Next.js links", () => {
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: /explore/i })).toHaveAttribute(
      "href",
      "/explore"
    );
  });

  it("marks the active route with aria-current=page", () => {
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: /explore/i })).not.toHaveAttribute(
      "aria-current"
    );
  });
});
