import { AppModule } from "@/components/AppModule";
import { ModulePreview } from "@/interfaces/module.interface";
import { fireEvent, render, screen, within } from "@testing-library/react";

describe("AppModule component", () => {
  const mockModule: ModulePreview = {
    id: "module-1",
    name: "Module 1",
    public: true,
    description: "This is a module",
    ownerId: "user-1",
  };

  it("renders correctly", () => {
    const { getByText } = render(<AppModule module={mockModule} />);
    expect(getByText(mockModule.name)).toBeInTheDocument();
    expect(getByText(mockModule.description!)).toBeInTheDocument();
  });

  it("displays the correct badges", () => {
    const { getByText } = render(<AppModule isOwner module={mockModule} />);
    expect(getByText("Public")).toBeInTheDocument();
    expect(getByText("Owner")).toBeInTheDocument();
  });

  it("opens a confirm dialog when the delete trigger is clicked", () => {
    const onDelete = jest.fn();
    render(<AppModule module={mockModule} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("calls onDelete only after confirming in the dialog", () => {
    const onDelete = jest.fn();
    render(<AppModule module={mockModule} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /^delete$/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockModule.id);
  });

  it("does not call onDelete when the dialog is cancelled", () => {
    const onDelete = jest.fn();
    render(<AppModule module={mockModule} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /cancel/i }));
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("calls onAdd when add button is clicked", () => {
    const onAdd = jest.fn();
    const { getByRole } = render(
      <AppModule type="explore" module={mockModule} onAdd={onAdd} />
    );
    const addButton = getByRole("button", { name: "Add" });
    fireEvent.click(addButton);
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(mockModule);
  });

  it("renders the correct links", () => {
    const { getByText } = render(<AppModule module={mockModule} />);
    expect(getByText("View")).toBeInTheDocument();
    expect(getByText("Play")).toBeInTheDocument();
  });

  it("has the correct className", () => {
    const { getByText } = render(<AppModule module={mockModule} />);
    const moduleCard = getByText(mockModule.name).parentElement?.parentElement;
    expect(moduleCard).toHaveClass("flex flex-col h-full");
  });
});
