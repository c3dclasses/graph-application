import GraphOperations from "../graphoperations/graphoperations";
import React, {useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import "./header.css";
import { handleCGraphicsGraphLoad } from "../../libs/cgraphicsgraph/cgraphicsgraph";

function Header() {
    const bclose = useSelector(state=>state.m_bheader);
    const version = useSelector(state=>state.m_version);
    const dispatch = useDispatch();
    
    let iconClasses = (bclose) ? "glyphicon glyphicon-chevron-down" : "glyphicon glyphicon-chevron-up";
    let headerClasses = (bclose) ? " header-close" : "";
    //let version = "5.0";

    useEffect(()=>{ 
        window.dispatchEvent(new Event("resize"));
    }, [bclose]);

    function handleClick() {
        dispatch(__.toggleHeader());
        let main = document.getElementsByTagName("main");
        if(!main || main.length === 0)
            return;
        main = main[0];
        if(bclose)
            main.classList.add("main-resize");
        else main.classList.remove("main-resize"); 
    }
    
    return (
        <header className={`header ${headerClasses}`}> 
            <div className="tab">
                <button onClick={handleClick} className="btn btn-default btn-sm">
                    <span className="rflex">
                        <span className="title">Graph Application {version}</span><span className={iconClasses}></span>
                    </span>
                </button>
            </div>
            <div className="headercontent">
                <div className="logo rflex">
                    <h1>Graph Application</h1>
                    <span className="emp">version {version}</span> 
                </div>
                <div className="graph-controls">
                    <GraphOperations />
                </div>
                <button onClick={handleClick} className="btn btn-default btn-sm">
                    <span className={iconClasses}></span>
                </button>
            </div>
        </header>
    );
}

export default Header;