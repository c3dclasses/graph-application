import React, {useEffect} from "react";
import SidebarSection from "../sidebarsection/sidebarsection";
import GraphVertexAndEdgeProperties from "../graphproperties/graphvertexandedgeproperties";
import GraphProfileProperties from "../graphproperties/graphprofileproperties";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as gaa } from "../../reducers/graphapplicationactions";
import "./sidebar.css";

function Sidebar() {
    const bclose = useSelector(state=>state.m_bleftsidebar);
    const dispatch = useDispatch();
    useEffect(()=>{ window.dispatchEvent(new Event("resize"));}, [bclose]);
    useEffect(()=>{ window.dispatchEvent(new Event("resize"));}, [bclose]);
    let iconClasses = (bclose) ? "glyphicon glyphicon-menu-right" : "glyphicon glyphicon-menu-left";
    let sidebarClasses = (bclose) ? "sidebarclose" : "";     
    return (
        <aside className={`sidebar ${sidebarClasses}`}>
            <div className="tab">
                <button onClick={()=>{dispatch(gaa.toggleLeftSidebar())}} className="btn btn-default btn-sm"><span className={iconClasses}></span></button>
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