import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "./App";

describe("App", () => {
    describe("render", () => {
        it("renders without crashing", () => {
            act(() => {
                render(<App />);
            });
        });
    });

    describe("content", () => {
        it("should display 'Hello World!' in a Button", () => {
            act(() => {
                render(<App />);
            });
            expect(screen.getByRole("button")).toHaveTextContent(
                "Hello world!"
            );
        });
    });
});
