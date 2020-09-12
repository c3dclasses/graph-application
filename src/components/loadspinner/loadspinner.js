import React from "react";
import {useSelector} from "react-redux";
import "./loadspinner.css";

export function LoadSpinner() {
    const bshowloadspinner = useSelector(state=>state.m_bshowloadspinner);
    const loadspinnermsg = useSelector(state=>state.m_loadspinnermsg);
    const berror = useSelector(state=>state.m_berror);
    let bshow = (bshowloadspinner) ? "show-spinner" : "";
    return (
        <div className={`load-spinner-container ${bshow}`}>
            <div className="load-spinner"></div>
            <div className="load-spinner-message">{loadspinnermsg}</div>
            { 
                berror && <div className="load-spinner-action">
                <button onClick={()=>{window.location.reload();}}>
                <span className="glyphicon glyphicon-refresh"></span> Try Again
                </button></div> 
            }
        </div>
    );
}

export default LoadSpinner;