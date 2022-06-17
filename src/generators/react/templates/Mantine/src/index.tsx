import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
<% if (hooks) { %>import { useColorScheme } from "@mantine/hooks";<% } %>
<% if (i18next) { %>import "./i18n";<% } %>
import App from "./components/App";
import DebugTools from "./components/DebugTools";
import Fonts from "./components/Fonts";
import GlobalStyles from "./components/GlobalStyles";

const root = createRoot(document.getElementById("root")!);

const Root = () => {
    <% if (hooks) { %>
    const [colorScheme, setColorScheme] = useState<ColorScheme>(
        useColorScheme()
    );
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(
            (current) => value || (current === "dark" ? "light" : "dark")
        );
    <% } %>

    return (
        <% if (hooks) { %>
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
        <% } %>
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <DebugTools />
                <Fonts />
                <GlobalStyles />
                <App />
            </MantineProvider>
        <% if (hooks) { %>
        </ColorSchemeProvider>
        <% } %>
    );
};

root.render(
    <StrictMode>
        <Root />
    </StrictMode>
);
