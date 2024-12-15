import { AuthProvider, useAuth } from "@/providers/AuthContext";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(() => ({ name: "mockApp" })),
  getApps: jest.fn(() => []),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("../../firebase/clientApp", () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

const mockOnAuthStateChanged =
  jest.requireMock("firebase/auth").onAuthStateChanged;
const mockSignInWithPopup = jest.requireMock("firebase/auth").signInWithPopup;
const mockSignOut = jest.requireMock("firebase/auth").signOut;
const mockUseRouter = jest.requireMock("next/navigation").useRouter;
const mockPush = jest.fn();
mockUseRouter.mockReturnValue({ push: mockPush });

const MockChild = () => {
  const { loginWithGoogle, logout } = useAuth();

  return (
    <div>
      <button onClick={loginWithGoogle}>Login with Google</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const renderWithAuthProvider = () =>
  render(
    <AuthProvider>
      <MockChild />
    </AuthProvider>
  );

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children correctly", () => {
    renderWithAuthProvider();
    expect(screen.getByText("Login with Google")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("redirects to '/' if unauthenticated", async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });

    renderWithAuthProvider();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });

  it("redirects to '/dashboard' after login", async () => {
    mockSignInWithPopup.mockResolvedValueOnce(null);

    renderWithAuthProvider();

    const loginButton = screen.getByText("Login with Google");
    loginButton.click();

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("calls signOut on logout", async () => {
    mockSignOut.mockResolvedValueOnce(null);

    renderWithAuthProvider();

    const logoutButton = screen.getByText("Logout");
    logoutButton.click();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
});
