import CreateModulePage from "@/app/(system)/modules/new-module/page";
import { createModule, updateUserModules } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthContext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

global.ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/providers/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/firebase/firestore", () => ({
  createModule: jest.fn(),
  updateUserModules: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("CreateModulePage", () => {
  const mockToast = { toast: jest.fn() };
  const mockRouterPush = jest.fn();
  const mockAuth = { user: { uid: "user123" } };

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue(mockToast);
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  it("renders the page and shows the form", () => {
    render(<CreateModulePage />);

    expect(screen.getByText("Create a New Module")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter module name")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter module description")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Public")).toBeInTheDocument();
  });

  it("navigates to Cards tab and shows card section", async () => {
    render(<CreateModulePage />);

    const cardsButton = screen.getByRole("tab", { name: /Cards/i });
    expect(cardsButton).toBeInTheDocument();
    expect(cardsButton).toHaveAttribute("aria-selected", "false");

    await userEvent.click(cardsButton);

    await waitFor(() => {
      expect(cardsButton).toHaveAttribute("aria-selected", "true");
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Front")).toBeVisible();
    });
  });

  it("handles form submission successfully with at least one card", async () => {
    (createModule as jest.Mock).mockResolvedValueOnce({
      id: "module123",
      name: "Module",
      description: "Test",
      public: true,
    });
    (updateUserModules as jest.Mock).mockResolvedValueOnce(undefined);

    render(<CreateModulePage />);

    fireEvent.input(screen.getByPlaceholderText("Enter module name"), {
      target: { value: "Test Module" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter module description"), {
      target: { value: "This is a test module." },
    });

    userEvent.click(screen.getByText("Cards"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Front")).toBeVisible();
    });

    fireEvent.input(screen.getByPlaceholderText("Front"), {
      target: { value: "Front Text" },
    });
    fireEvent.input(screen.getByPlaceholderText("Back"), {
      target: { value: "Back Text" },
    });
    fireEvent.click(screen.getByText("Add"));

    fireEvent.click(screen.getByText("Create Module"));

    await waitFor(() => {
      expect(createModule).toHaveBeenCalledWith({
        name: "Test Module",
        description: "This is a test module.",
        public: false,
        id: expect.any(String),
        ownerId: "user123",
        cards: [
          { front: "Front Text", back: "Back Text", id: expect.any(String) },
        ],
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Module created",
        description: "Your module has been created successfully.",
      });
    });
  });

  it("shows a toast error when creating a module fails", async () => {
    (createModule as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to create module")
    );

    render(<CreateModulePage />);

    // Fill in module details and add a card
    fireEvent.input(screen.getByPlaceholderText("Enter module name"), {
      target: { value: "Test Module" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter module description"), {
      target: { value: "This is a test module." },
    });

    userEvent.click(screen.getByText("Cards"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Front")).toBeVisible();
    });

    fireEvent.input(screen.getByPlaceholderText("Front"), {
      target: { value: "Front Text" },
    });
    fireEvent.input(screen.getByPlaceholderText("Back"), {
      target: { value: "Back Text" },
    });
    fireEvent.click(screen.getByText("Add"));

    // Submit form
    fireEvent.click(screen.getByText("Create Module"));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to create module.",
        variant: "destructive",
      });
    });
  });

  it("displays error toast when no cards are added", async () => {
    render(<CreateModulePage />);

    fireEvent.input(screen.getByPlaceholderText("Enter module name"), {
      target: { value: "Test Module" },
    });
    fireEvent.input(screen.getByPlaceholderText("Enter module description"), {
      target: { value: "Test Description" },
    });

    // No cards are added, this should trigger the error
    fireEvent.click(screen.getByText("Create Module"));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Error",
        description: "You must add at least one card.",
        variant: "destructive",
      });
    });
  });

  it("adds a card manually", async () => {
    render(<CreateModulePage />);

    userEvent.click(screen.getByText("Cards"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Front")).toBeVisible();
    });

    fireEvent.input(screen.getByPlaceholderText("Front"), {
      target: { value: "Front Text" },
    });
    fireEvent.input(screen.getByPlaceholderText("Back"), {
      target: { value: "Back Text" },
    });

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(screen.getByText("Front Text")).toBeInTheDocument();
      expect(screen.getByText("Back Text")).toBeInTheDocument();
    });
  });

  it("shows an error toast if invalid JSON is provided for bulk card addition", async () => {
    render(<CreateModulePage />);

    userEvent.click(screen.getByText("Cards"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Front")).toBeVisible();
    });

    fireEvent.change(screen.getAllByRole("textbox")[2], {
      target: { value: "[ { 'front': 'Q1', 'back': 'A1' } ]" },
    });

    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Error",
        description:
          "Invalid JSON format. Ensure it's an array of objects with 'front' and 'back'.",
        variant: "destructive",
      });
    });
  });

  it("clears the cards when 'Clear Cards' button is clicked", async () => {
    render(<CreateModulePage />);

    userEvent.click(screen.getByText("Cards"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Front")).toBeVisible();
    });

    fireEvent.input(screen.getByPlaceholderText("Front"), {
      target: { value: "Card 1 Front" },
    });
    fireEvent.input(screen.getByPlaceholderText("Back"), {
      target: { value: "Card 1 Back" },
    });

    fireEvent.click(screen.getByText("Add"));

    fireEvent.click(screen.getByText("Clear Cards"));

    await waitFor(() => {
      expect(screen.queryByText("Card 1 Front")).not.toBeInTheDocument();
      expect(screen.queryByText("Card 1 Back")).not.toBeInTheDocument();
    });
  });
});
