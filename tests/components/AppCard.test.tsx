import { AppCard } from "@/components/AppCard";
import { ICard } from "@/interfaces/card.interface";
import { fireEvent, render, waitFor } from "@testing-library/react";

describe("AppCard component", () => {
  const card: ICard = {
    id: "1",
    front: "Front text",
    back: "Back text",
  };

  it("renders correctly", () => {
    const { getByText } = render(<AppCard card={card} />);
    expect(getByText(card.front)).toBeInTheDocument();
    expect(getByText(card.back)).toBeInTheDocument();
  });

  it("flips when clicked", () => {
    const { getByText, container } = render(<AppCard card={card} />);
    const cardElement = container.querySelector(".cursor-pointer");
    fireEvent.click(cardElement!);
    waitFor(() =>
      expect(getByText(card.back)).toHaveStyle("transform: rotateY(180deg);")
    );
  });
});
