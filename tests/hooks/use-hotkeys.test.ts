import { useHotkeys } from "@/hooks/use-hotkeys";
import { act, renderHook } from "@testing-library/react";

function dispatchKey(key: string, target?: HTMLElement) {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
  });
  (target ?? document).dispatchEvent(event);
  return event;
}

describe("useHotkeys", () => {
  it("fires the matching handler on keydown", () => {
    const handler = jest.fn();
    renderHook(() => useHotkeys({ a: handler }));

    act(() => {
      dispatchKey("a");
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("calls preventDefault on the event when a handler matches", () => {
    const handler = jest.fn();
    renderHook(() => useHotkeys({ ArrowRight: handler }));

    let event: KeyboardEvent;
    act(() => {
      event = dispatchKey("ArrowRight");
    });

    expect(event!.defaultPrevented).toBe(true);
  });

  it("does not fire when the user is typing in an input", () => {
    const handler = jest.fn();
    renderHook(() => useHotkeys({ " ": handler }));

    const input = document.createElement("input");
    document.body.appendChild(input);

    act(() => {
      dispatchKey(" ", input);
    });

    expect(handler).not.toHaveBeenCalled();
    input.remove();
  });

  it("does nothing when disabled", () => {
    const handler = jest.fn();
    renderHook(() => useHotkeys({ a: handler }, false));

    act(() => {
      dispatchKey("a");
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it("uses the latest handler without re-registering", () => {
    const first = jest.fn();
    const second = jest.fn();
    const { rerender } = renderHook(({ fn }) => useHotkeys({ a: fn }), {
      initialProps: { fn: first },
    });

    rerender({ fn: second });

    act(() => {
      dispatchKey("a");
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
