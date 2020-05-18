import React from "react";
import Content from "../content/content";
import Sidebar from "../sidebar/sidebar";
import "./main.css";

export default function Main() {
    return (
        <main>
            <Sidebar/>
            <Content />
        </main>
    );
}