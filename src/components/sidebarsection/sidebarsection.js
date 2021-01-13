import React from "react";
import "./sidebarsection.css";
export default function SidebarSection(props) {  
    return (
        <section className={`sidebarsection ${props.className}`}>
            <h4 className="sidebarsectionheader">{props.headerName}<button class="toggle-sidebarsectioncontent-btn btn btn-default btn-sm"><span class="glyphicon glyphicon-chevron-up"></span></button></h4>
            <div className="sidebarsectioncontent">
                {props.children}
            </div>
        </section>
    );
}