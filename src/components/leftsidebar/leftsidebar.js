import React, {useEffect} from "react";
import SidebarSection from "../sidebarsection/sidebarsection";
import GraphVertexAndEdgeProperties from "../graphproperties/graphvertexandedgeproperties";
import GraphProfileProperties from "../graphproperties/graphprofileproperties";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import "./leftsidebar.css";

function LeftSidebar() {
    const bclose = useSelector(state=>state.m_bleftsidebar);
    const dispatch = useDispatch();
    useEffect(()=>{ window.dispatchEvent(new Event("resize"));}, [bclose]);
    useEffect(()=>{ window.dispatchEvent(new Event("resize"));}, [bclose]);
    let iconClasses = (bclose) ? "glyphicon glyphicon-chevron-right" : "glyphicon glyphicon-chevron-left";
    let leftsidebarClasses = (bclose) ? "leftsidebarclose" : "";     
    return (
        <aside className={`leftsidebar ${leftsidebarClasses}`}>
            <div className="tab">
                <button onClick={()=>{dispatch(__.toggleLeftSidebar())}} className="btn btn-default btn-sm"><span className={iconClasses}></span></button>
            </div>        
            <div className="leftsidebarcontent">
                {/*
                <SidebarSection headerName="Graph Properties">
                    <GraphVertexAndEdgeProperties />
                </SidebarSection>
                */}
                <SidebarSection headerName="Profile Sequences">
                    <GraphProfileProperties />
                </SidebarSection>
            </div>
        </aside>
    );
}

export default LeftSidebar;