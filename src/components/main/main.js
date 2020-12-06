import React from "react";
import Content from "../content/content";
import LeftSidebar from "../leftsidebar/leftsidebar";
import RightSidebar from "../rightsidebar/rightsidebar";
import "./main.css";

export default function Main() {
    return (
        <main>
            <LeftSidebar/>
            <Content />
            <RightSidebar />
        </main>
    );
}