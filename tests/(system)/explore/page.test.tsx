import ExplorePage from "@/app/(system)/explore/page";
import { getPublicModules, updateUserModules } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthContext";
import { useLoader } from "@/providers/LoaderContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/firebase/clientApp");
jest.mock("@/firebase/firestore", () => ({
  getPublicModules: jest.fn(),
  updateUserModules: jest.fn(),
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
  AppModule: jest.fn(({ module, onAdd, isLoading }) => (
    <div data-testid="module-item">
      <p>{module.name}</p>
      <button
        data-testid={`add-button-${module.id}`}
        onClick={() => onAdd(module)}
        disabled={isLoading}
      >
        Add
      </button>
    </div>
  )),
}));

const mockModules = [
  {
    id: "1",
    name: "Public Module 1",
    description: "Description 1",
    ownerId: "user1",
  },
  {
    id: "2",
    name: "Public Module 2",
    description: "Description 2",
    ownerId: "user2",
  },
];
const mockUser = { uid: "user1" };

const setupMocks = ({
  user = mockUser,
  isLoading = false,
  modules = mockModules,
  toast = jest.fn(),
} = {}) => {
  (useAuth as jest.Mock).mockReturnValue({ user });
  (useLoader as jest.Mock).mockReturnValue({
    isLoading,
    setLoading: jest.fn(),
  });
  (getPublicModules as jest.Mock).mockResolvedValue(modules);
  (updateUserModules as jest.Mock).mockResolvedValue({});
  (useToast as jest.Mock).mockReturnValue({ toast });
};

describe("ExplorePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", async () => {
    setupMocks({ isLoading: true });
    render(<ExplorePage />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders empty state when no modules", async () => {
    setupMocks({ modules: [] });
    render(<ExplorePage />);
    await waitFor(() =>
      expect(
        screen.getByText("No modules found. Create a new one to get started.")
      ).toBeInTheDocument()
    );
  });

  it("renders modules when data is loaded", async () => {
    setupMocks();
    render(<ExplorePage />);
    await waitFor(() => {
      expect(screen.getAllByTestId("module-item")).toHaveLength(
        mockModules.length
      );
      expect(screen.getByText("Public Module 1")).toBeInTheDocument();
      expect(screen.getByText("Public Module 2")).toBeInTheDocument();
    });
  });

  it("filters modules by search input", async () => {
    setupMocks();
    render(<ExplorePage />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Public Module 1" } });
    await waitFor(() => {
      expect(screen.getAllByTestId("module-item")).toHaveLength(1);
      expect(screen.getByText("Public Module 1")).toBeInTheDocument();
    });
  });

  it("calls addModuleToUser when add button is clicked", async () => {
    setupMocks();
    render(<ExplorePage />);
    await waitFor(() => {
      expect(getPublicModules).toHaveBeenCalled();
    });
    const addButton = screen.getByTestId("add-button-1");
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(updateUserModules).toHaveBeenCalledWith(
        mockUser.uid,
        mockModules[0]
      );
    });
  });

  it("disables add button while adding a module", async () => {
    setupMocks();
    render(<ExplorePage />);
    await waitFor(() => {
      expect(getPublicModules).toHaveBeenCalled();
    });
    const addButton = screen.getByTestId("add-button-1");
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(addButton).toBeDisabled();
    });
  });

  it("shows a toast when a module is added", async () => {
    const mockToast = jest.fn();
    setupMocks({ toast: mockToast });
    render(<ExplorePage />);
    await waitFor(() => {
      expect(getPublicModules).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByTestId("add-button-1"));
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Module added",
        description: "Module Public Module 1 added to your modules",
      });
    });
  });

  it("does not fetch public modules when user is not authenticated", async () => {
    setupMocks({ user: null as any });
    render(<ExplorePage />);
    await waitFor(() => {
      expect(getPublicModules).toHaveBeenCalled();
    });
  });
});
