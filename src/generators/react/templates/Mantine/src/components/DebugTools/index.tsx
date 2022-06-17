import React from "react";
import { useMantineColorScheme } from "@mantine/core";
<% if (i18next) { %>import { changeLanguage } from "i18next";<% } %>

export default () => {
    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    const { toggleColorScheme } = useMantineColorScheme();

    React.useEffect(() => {
        (window as any).toggleColorScheme = toggleColorScheme;
        <% if (i18next) { %>(window as any).changeLanguage = changeLanguage;<% } %>
    }, [toggleColorScheme]);

    return null;
};
