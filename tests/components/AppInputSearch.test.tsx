import AppInputSearch from "@/components/AppInputSearch";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";

describe("AppInputSearch component", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(
      <AppInputSearch value="" onChange={jest.fn()} />
    );
    expect(getByPlaceholderText("Search your Module")).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(
      <AppInputSearch value="" onChange={onChange} />
    );
    const input = getByPlaceholderText("Search your Module");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("has the correct className", () => {
    const { getByPlaceholderText } = render(
      <AppInputSearch value="" onChange={jest.fn()} />
    );
    const input = getByPlaceholderText("Search your Module");
    expect(input.parentElement).toHaveClass("relative");
  });
});
