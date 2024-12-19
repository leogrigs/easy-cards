import { AppModule } from "@/components/AppModule";
import { ModulePreview } from "@/interfaces/module.interface";
import { fireEvent, render } from "@testing-library/react";

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

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn();
    const { getByRole } = render(
      <AppModule module={mockModule} onDelete={onDelete} />
    );
    const deleteButton = getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockModule.id);
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
