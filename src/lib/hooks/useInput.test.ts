import { act, renderHook, waitFor } from "@testing-library/react";
import useInput from "./useInput";

type Name = Parameters<typeof useInput>[0];
type Options = Parameters<typeof useInput>[1];

describe("useInput", () => {
  const name: Name = "test";
  const options: Options = {
    type: "text",
    defaultValue: "default",
    min: 1,
    max: 10,
    required: true,
    disabled: false,
    label: "label",
  };
  it("Takes a name and options as arguments", () => {
    const { result } = renderHook(() => useInput(name, options));
    expect(result.current).toBeDefined();
  });
  it("Defaults to a text input", () => {
    const { result } = renderHook(() => useInput(name));
    expect(result.current.props.type).toBe("text");
  });
  describe("Return object", () => {
    describe("label", () => {
      it("Is the value of options.label", () => {
        const { result } = renderHook(() => useInput(name, options));
        expect(result.current.label).toBe(options.label);
      });
      it("Defaults to the name argument", () => {
        const { result } = renderHook(() => useInput(name));
        expect(result.current.label).toBe(name);
      });
    });
    describe("error", () => {
      it("Is the value of the error internal state", () => {
        const { result } = renderHook(() => useInput(name, options));
        expect(result.current.error).toBeDefined();
      });
      it("Is an empty string by default", () => {
        const { result } = renderHook(() => useInput(name));
        expect(result.current.error).toBe("");
      });
      it("Is an empty string if the value is valid", () => {
        const { result } = renderHook(() => useInput(name, options));
        act(() => {
          result.current.setValue("valid");
        });
        waitFor(() => expect(result.current.error).toBe(""));
      });
      it("Is message if the value is invalid", () => {
        const { result } = renderHook(() => useInput(name, options));
        act(() => {
          result.current.setValue("");
        });
        waitFor(() =>
          expect(result.current.error).toBe(
            `Debe tener al menos ${options.min} carácteres`
          )
        );
        act(() => {
          result.current.setValue("a".repeat(11));
        });
        waitFor(() =>
          expect(result.current.error).toBe(
            `Debe tener un máximo de ${options.max} carácteres`
          )
        );
      });
    });
    describe("props", () => {
      it("Is the props object that <Input {...props} /> woudl receive", () => {
        const { result } = renderHook(() => useInput(name, options));
        expect(result.current.props).toBeDefined();
      });
    });
    describe("setValue", () => {
      it("Changes the value of props.value", () => {
        const { result } = renderHook(() => useInput(name, options));
        act(() => {
          result.current.setValue("new value");
        });
        waitFor(() => expect(result.current.props.value).toBe("new value"));
      });
    });
  });
});
