import DashboardPage from "@/app/(system)/dashboard/page";
import { deleteModuleFromUser, getUserData } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthContext";
import { useLoader } from "@/providers/LoaderContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/firebase/clientApp");
jest.mock("@/firebase/firestore", () => ({
  deleteModuleFromUser: jest.fn(),
  getUserData: jest.fn(),
}));
jest.mock("@/providers/AuthContext", () => ({
  useAuth: jest.fn(),
}));
jest.mock("@/providers/LoaderContext", () => ({
  useLoader: jest.fn(),
}));
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("@/components/AppInputSearch", () => ({
  __esModule: true,
  default: jest.fn((props) => (
    <input
      data-testid="search-input"
      value={props.value}
      onChange={props.onChange}
    />
  )),
}));
jest.mock("@/components/AppLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));
jest.mock("@/components/AppModule", () => ({
  __esModule: true,
  AppModule: jest.fn(({ module, onDelete, isOwner, isLoading }) => (
    <div data-testid="module-item">
      <p>{module.name}</p>
      <button
        data-testid={`delete-button-${module.id}`}
        onClick={() => onDelete(module.id)}
        disabled={isLoading}
      >
        Delete
      </button>
    </div>
  )),
}));

const mockModules = [
  { id: "1", name: "Module 1", description: "Description 1", ownerId: "user1" },
  { id: "2", name: "Module 2", description: "Description 2", ownerId: "user1" },
];
const mockUser = { uid: "user1" };
const setupMocks = ({
  user = mockUser,
  isLoading = false,
  userData = { modules: mockModules },
  toast = jest.fn(),
} = {}) => {
  (useAuth as jest.Mock).mockReturnValue({ user });
  (useLoader as jest.Mock).mockReturnValue({
    isLoading,
    setLoading: jest.fn(),
  });
  (getUserData as jest.Mock).mockResolvedValue(userData);
  (deleteModuleFromUser as jest.Mock).mockResolvedValue({});
  (useToast as jest.Mock).mockReturnValue({ toast });
};

describe("DashboardPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", async () => {
    setupMocks({ isLoading: true });
    render(<DashboardPage />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders empty state when no modules", async () => {
    setupMocks({ userData: { modules: [] } });
    render(<DashboardPage />);
    await waitFor(() =>
      expect(
        screen.getByText("You do not have any modules yet.")
      ).toBeInTheDocument()
    );
  });

  it("renders modules when data is loaded", async () => {
    setupMocks();
    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId("module-item")).toHaveLength(
        mockModules.length
      );
      expect(screen.getByText("Module 1")).toBeInTheDocument();
      expect(screen.getByText("Module 2")).toBeInTheDocument();
    });
  });

  it("filters modules by search input", async () => {
    setupMocks();
    render(<DashboardPage />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Module 1" } });
    await waitFor(() => {
      expect(screen.getAllByTestId("module-item")).toHaveLength(1);
      expect(screen.getByText("Module 1")).toBeInTheDocument();
    });
  });

  it("calls deleteModule when delete button is clicked", async () => {
    setupMocks();
    render(<DashboardPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("delete-button-1"));
    });
    await waitFor(() => {
      expect(deleteModuleFromUser).toHaveBeenCalledWith(mockUser.uid, "1");
    });
  });

  it("disables delete button while deleting a module", async () => {
    setupMocks();
    render(<DashboardPage />);
    await waitFor(() => {
      const deleteButton = screen.getByTestId("delete-button-1");
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeDisabled();
    });
  });

  it("shows a toast when a module is deleted", async () => {
    const mockToast = jest.fn();
    setupMocks({ toast: mockToast });
    render(<DashboardPage />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId("delete-button-1"));
    });
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Module deleted",
        description: "Your module has been deleted successfully.",
      });
    });
  });

  it("does not call fetchUserData when user is not authenticated", async () => {
    setupMocks({ user: null as any });
    render(<DashboardPage />);
    await waitFor(() => {
      expect(getUserData).not.toHaveBeenCalled();
    });
  });
});
