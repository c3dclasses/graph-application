import React from "react";
import "./sidebarsection.css";

export default function SidebarSection(props) {  
    return (
        <section className={`sidebarsection ${props.className}`}>
            <h4 className="sidebarsectionheader">{props.headerName}</h4>
            <div className="sidebarsectioncontent">
                {props.children}
            </div>
        </section>
    );
}