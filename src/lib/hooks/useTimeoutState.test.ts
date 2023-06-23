import { act, renderHook, waitFor } from "@testing-library/react";
import useTimeoutState from "./useTimeoutState";

describe("useTimeoutState", () => {
  test("Resets the value to its initialValue after a timeout", async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useTimeoutState("initial", 1000));

    expect(result.current[0]).toBe("initial");

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => expect(result.current[0]).toBe("initial"));
  });
});
