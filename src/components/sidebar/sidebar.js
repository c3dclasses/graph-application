import React, {useState, useEffect} from "react";
import SidebarSection from "../sidebarsection/sidebarsection";
//import DegreeSequences from "../degreesequences/degreesequences";
import GraphVertexAndEdgeProperties from "../graphproperties/graphvertexandedgeproperties";
import GraphProfileProperties from "../graphproperties/graphprofileproperties";


import "./sidebar.css";

function Sidebar(props) {
    function handleClick() {  _setState({"bclose":!_state.bclose}); }
    const [_state, _setState] = useState({bclose:true}) 
    let iconClasses = (_state.bclose) ? "glyphicon glyphicon-menu-right" : "glyphicon glyphicon-menu-left";
    let sidebarClasses = (_state.bclose) ? "sidebarclose" : "";  
    useEffect(()=>{ 
        window.dispatchEvent(new Event("resize"));
    }, [_state.bclose]);
    return (
        <aside className={`sidebar ${sidebarClasses}`}>
            <div className="tab">
                <button onClick={handleClick} className="btn btn-default btn-sm"><span className={iconClasses}></span></button>
            </div>        
            <div className="sidebarcontent">
                <SidebarSection headerName="Graph Properties">
                    <GraphVertexAndEdgeProperties />
                </SidebarSection>
                <SidebarSection headerName="Profile Sequences">
                    <GraphProfileProperties />
                </SidebarSection>
            </div>
        </aside>
    );
}

export default Sidebar;