import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider  } from "@mantine/core";
import App from "./components/App/App";

const root = createRoot(document.getElementById("root")!);
root.render(
    <StrictMode>
        <MantineProvider withNormalizeCSS withGlobalStyles>
            <App />
        </MantineProvider>
    </StrictMode>
);
