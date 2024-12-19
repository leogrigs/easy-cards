import PlayModulePage from "@/app/(system)/modules/play/[moduleId]/page";
import { useLoader } from "@/providers/LoaderContext";
import { getDoc } from "@firebase/firestore";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("@/providers/LoaderContext", () => ({
  useLoader: jest.fn(() => ({
    isLoading: false,
    setLoading: jest.fn(),
  })),
}));

jest.mock("@firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("@/firebase/clientApp", () => ({
  firestore: {},
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(() => ({ moduleId: "test-module-id" })),
}));

describe("PlayModulePage", () => {
  const mockModule = {
    name: "Sample Module",
    description: "This is a sample module.",
    cards: [
      { id: "card-1", front: "Card 1", back: "Back 1" },
      { id: "card-2", front: "Card 2", back: "Back 2" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the loader during initial loading", () => {
    (useLoader as jest.Mock).mockReturnValueOnce({
      isLoading: true,
      setLoading: jest.fn(),
    });
    render(<PlayModulePage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  // it("fetches and displays module data", async () => {
  //   (getDoc as jest.Mock).mockResolvedValueOnce({
  //     exists: () => true,
  //     data: () => mockModule,
  //   });

  //   render(<PlayModulePage />);

  //   await waitFor(() => {
  //     expect(screen.getByText(mockModule.name)).toBeInTheDocument();
  //     expect(screen.getByText(mockModule.description)).toBeInTheDocument();
  //   });

  //   mockModule.cards.forEach((card) => {
  //     expect(screen.getByText(card.front)).toBeInTheDocument();
  //   });
  // });

  it("handles missing module data", async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({ exists: () => false });

    render(<PlayModulePage />);

    await waitFor(() => {
      expect(screen.queryByText(mockModule.name)).not.toBeInTheDocument();
    });
  });

  it("handles fetch errors", async () => {
    (getDoc as jest.Mock).mockRejectedValueOnce(
      new Error("Error fetching module")
    );

    render(<PlayModulePage />);

    await waitFor(() => {
      expect(screen.queryByText(mockModule.name)).not.toBeInTheDocument();
    });
  });

  // it("navigates through the carousel", async () => {
  //   (getDoc as jest.Mock).mockResolvedValueOnce({
  //     exists: () => true,
  //     data: () => mockModule,
  //   });

  //   render(<PlayModulePage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Card 1")).toBeInTheDocument();
  //   });

  //   const nextButton = screen.getByRole("button", { name: /next/i });
  //   fireEvent.click(nextButton);

  //   await waitFor(() => {
  //     expect(screen.getByText("Card 2")).toBeInTheDocument();
  //   });

  //   const prevButton = screen.getByRole("button", { name: /previous/i });
  //   fireEvent.click(prevButton);

  //   await waitFor(() => {
  //     expect(screen.getByText("Card 1")).toBeInTheDocument();
  //   });
  // });

  // it("disables navigation buttons appropriately", async () => {
  //   (getDoc as jest.Mock).mockResolvedValueOnce({
  //     exists: () => true,
  //     data: () => mockModule,
  //   });

  //   render(<PlayModulePage />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Card 1")).toBeInTheDocument();
  //   });

  //   const prevButton = screen.getByRole("button", { name: /previous/i });
  //   expect(prevButton).toBeDisabled();

  //   const nextButton = screen.getByRole("button", { name: /next/i });
  //   expect(nextButton).not.toBeDisabled();

  //   fireEvent.click(nextButton);

  //   await waitFor(() => {
  //     expect(screen.getByText("Card 2")).toBeInTheDocument();
  //   });

  //   expect(nextButton).toBeDisabled();
  //   expect(prevButton).not.toBeDisabled();
  // });
});
