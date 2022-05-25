import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
<% if (core) { %>import { MantineProvider, TypographyStylesProvider } from "@mantine/core";<% } %>
import App from "./components/App/App";
<% if (i18next) { %>import "./i18n";<% } %>

const root = createRoot(document.getElementById("root")!);
root.render(
    <StrictMode>
        <% if (core) { %><TypographyStylesProvider><MantineProvider withNormalizeCSS withGlobalStyles><% } %>
            <App />
        <% if (core) { %></MantineProvider></TypographyStylesProvider><% } %>
    </StrictMode>
);
