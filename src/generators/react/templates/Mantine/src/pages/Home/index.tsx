import React from "react";
<% if (i18next) { %>import { useTranslation } from "react-i18next";<% } %>

export default () => {
    <% if (i18next) { %>const { t } = useTranslation();<% } %>

    return (
        <div>
            <% if (i18next) { %>
            <h1>{t("home")}</h1>
            <% } else { %>
            <h1>Home</h1>
            <% } %>
        </div>
    );
};
