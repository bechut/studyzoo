import React from "react";
import { Route, Routes } from 'react-router-dom';
import { metadata } from "./metadata";

export default function Routers() {
    return (
        <Routes>
            {metadata.map((meta) => <Route
            key={meta.path}
            path={meta.path}
            element={meta.element}
        />)}
        </Routes>
    )
}