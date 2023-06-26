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
  it("Defaults to a text input", () => {
    const { result } = renderHook(() => useInput(name));
    expect(result.current.props.type).toBe("text");
  });
  describe("Arguments", () => {
    it("Takes a name and options as arguments", () => {
      const { result } = renderHook(() => useInput(name, options));
      expect(result.current).toBeDefined();
    });
    describe("Options", () => {
      describe("validator", () => {
        it("Is called when value changes", async () => {
          const validator = jest.fn(() => "error message");
          const { result } = renderHook(() =>
            useInput(name, { ...options, validator })
          );
          act(() => {
            result.current.setValue("new value");
            result.current.props.onBlur?.(
              {} as unknown as React.FocusEvent<HTMLInputElement, Element>
            );
          });
          await waitFor(() => expect(validator).toBeCalledWith("new value"));
        });
        it("Can be async", () => {
          const validator = jest.fn(() => Promise.resolve("error message"));
          const { result } = renderHook(() =>
            useInput(name, { ...options, validator })
          );
          act(() => {
            result.current.setValue("new value");
            result.current.props.onBlur?.(
              {} as unknown as React.FocusEvent<HTMLInputElement, Element>
            );
          });
          waitFor(() => expect(validator).resolves.toBe("error message"));
        });
        it("Sets the error message if it returns a string", () => {
          const validator = jest.fn(() => "error message");
          const { result } = renderHook(() =>
            useInput(name, { ...options, validator })
          );
          act(() => {
            result.current.setValue("new value");
            result.current.props.onBlur?.(
              {} as unknown as React.FocusEvent<HTMLInputElement, Element>
            );
          });
          waitFor(() => expect(result.current.error).toBe("error message"));
        });
        it("Sets the error message if it returns a promise", () => {
          const validator = jest.fn(() => Promise.resolve("error message"));
          const { result } = renderHook(() =>
            useInput(name, { ...options, validator })
          );
          act(() => {
            result.current.setValue("new value");
            result.current.props.onBlur?.(
              {} as unknown as React.FocusEvent<HTMLInputElement, Element>
            );
          });
          waitFor(() => expect(result.current.error).toBe("error message"));
        });
        it("Sets the error message as an empty string if it returns null", () => {
          const validator = jest.fn(() => null);
          const { result } = renderHook(() =>
            useInput(name, { ...options, validator })
          );
          act(() => {
            result.current.setValue("new value");
            result.current.props.onBlur?.(
              {} as unknown as React.FocusEvent<HTMLInputElement, Element>
            );
          });
          waitFor(() => expect(result.current.error).toBe(""));
        });
        it("Sets the error message as an empty string if it resolves null", () => {
          const validator = jest.fn(() => Promise.resolve(null));
          const { result } = renderHook(() =>
            useInput(name, { ...options, validator })
          );
          act(() => {
            result.current.setValue("new value");
            result.current.props.onBlur?.(
              {} as unknown as React.FocusEvent<HTMLInputElement, Element>
            );
          });
          waitFor(() => expect(result.current.error).toBe(""));
        });
      });
    });
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
    describe("reset", () => {
      it("Resets the value to the default value", async () => {
        const { result } = renderHook(() => useInput(name, options));
        act(() => {
          result.current.setValue("new value");
        });
        await waitFor(() =>
          expect(result.current.props.value).toBe("new value")
        );
        act(() => {
          result.current.reset();
        });
        await waitFor(() =>
          expect(result.current.props.value).toBe(options.defaultValue)
        );
      });
      it("Resets the value to an empty string if no default value is provided", async () => {
        const { result } = renderHook(() => useInput(name));
        act(() => {
          result.current.setValue("new value");
        });
        await waitFor(() =>
          expect(result.current.props.value).toBe("new value")
        );
        act(() => {
          result.current.reset();
        });
        await waitFor(() => expect(result.current.props.value).toBe(""));
      });
    });
  });
});
