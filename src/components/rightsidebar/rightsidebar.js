import React, {useEffect} from "react";
import SidebarSection from "../sidebarsection/sidebarsection";
//import {ErdorRenyi} from "../erdosrenyi/erdosrenyi";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import "./rightsidebar.css";

function RightSidebar(props) {
    const bclose = useSelector(state=>state.m_brightsidebar);
    const dispatch = useDispatch();
    useEffect(()=>{ window.dispatchEvent(new Event("resize"));}, [bclose]);
    let iconClasses = (bclose) ? "glyphicon glyphicon-chevron-left" : "glyphicon glyphicon-chevron-right";
    let sidebarClasses = (bclose) ? "rightsidebarclose" : "";  
    return (
        <aside className={`rightsidebar ${sidebarClasses}`}>
            <div className="tab">
                <button onClick={()=>{dispatch(__.toggleRightSidebar())}} className="btn btn-default btn-sm"><span className={iconClasses}></span> {props.tabLabel}</button>
            </div>        
            <div className="rightsidebarcontent">
                <SidebarSection className="er" headerName="Erdős–Rényi">
                    {
                    /*<ErdorRenyi />*/
                    }
                </SidebarSection>
            </div>
        </aside>
    );
}

export default RightSidebar;