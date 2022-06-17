import React from "react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from ".";

describe("App", () => {
    describe("render", () => {
        it("renders without crashing", async () => {
            await act(async () => {
                render(<App />);
            });
        });
    });
});
