import React from "react";
<% if (router) { %>import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";<% } %>

// TODO: Add a Loading component to display while the app is loading
const Home = React.lazy(() => import("../../pages/Home"));

export default () => {
    return (
        <% if (router) { %>
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
        <% } else { %>
        <Home />
        <% } %>
    );
};
