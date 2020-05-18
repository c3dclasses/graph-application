import React from "react";
import "./header.css";
import GraphOperations from "../graphoperations/graphoperations";

function Header() {
    return (
        <header className="header"> 
            <div className="logo rflex">
                <h1>Graph Application</h1>
                <span className="emp">version 5.0</span> 
            </div>
            <div className="graph-controls">
                <GraphOperations />
            </div>
        </header>
    );
}

export default Header;