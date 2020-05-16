import React, {useState, useEffect} from "react";
import SidebarSection from "../sidebarsection/sidebarsection";
//import DegreeSequences from "../degreesequences/degreesequences";
//import GraphProperties from "../graphproperties/graphproperties";
//import $ from "jquery";
import "./sidebar.css";

function Sidebar(props) {
    function handleClick() {  _setState({"bclose":!_state.bclose}); }
    const [_state, _setState] = useState({bclose:true}) 
    let iconClasses = (_state.bclose) ? "glyphicon glyphicon-menu-right" : "glyphicon glyphicon-menu-left";
    let sidebarClasses = (_state.bclose) ? "sidebarclose" : "";  
    useEffect(()=>{ 
       // $(".sidebar").on("transitionend", function(e){ 
        //    $(window).resize();
      //  });
    }, [_state.bclose]);
    return (
        <aside className={`sidebar ${sidebarClasses}`}>
            <div className="tab">
                <button onClick={handleClick} className="btn btn-default btn-sm"><span className={iconClasses}></span></button>
            </div>        
            <div className="sidebarcontent">
                <SidebarSection headerName="Graph Properties">
                   {
                    //<GraphProperties />
                   }
                </SidebarSection>
                <SidebarSection headerName="Degree Sequences">
                    {
                    //<DegreeSequences/>
                    }
                </SidebarSection>
            </div>
        </aside>
    );
}

export default Sidebar;