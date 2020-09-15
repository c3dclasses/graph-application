import  React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as gaa } from "../../reducers/graphapplicationactions";
import { getProfileSequence } from "../../reducers/graphapplicationreducer"
import "./graphproperties.css";

export default function GraphProfileProperties() {
    const dispatch = useDispatch();
    const profilesequences = useSelector(state=>state.m_profilesequences);
    const bprofileshort = useSelector(state=>state.m_bprofileshort);
    
    return (
        <div className="profile-section">
            <div className="profile-controls">
                {
                    profilesequences.map((sequence, i)=>(
                        <div class="profile-sequence" key={i}>
                             <b>{sequence.m_shortname}:</b> <input type="checkbox" onChange={(e)=>{dispatch(gaa.setShowProfile(i, e.target.checked))}} checked={sequence.m_bshow}/>
                        </div>
                    ))
                }
            </div>
            <div className="profile-output">
                {
                   profilesequences.map((sequence, i)=>(
                        (sequence.m_bshow===true) ? 
                            <div key={i}>
                                <input type="hidden" value={bprofileshort} />
                                <span className="lab">{sequence.m_shortname}:</span> {toJSXSequence(sequence, bprofileshort)}
                            </div> : ""
                    ))
                }   
            </div>
            <div id="profile-short-notation">
                <b>short: </b>
                <input type="checkbox" onChange={(e)=>{dispatch(gaa.setShortProfile(e.target.checked));}} checked={bprofileshort} />
            </div><br />
        </div>       
    );
} // end GraphProfileProperties

function toJSXSequence(seqinfo, bshort) { 
    let sequence = seqinfo.m_sequence
    if(!sequence || sequence.length == 0)
        return <span className="degree"></span>;
    if(!bshort)
        return (<span className="degree">{sequence.sort((a,b)=>b-a).join(" ")}</span>);
    let short = {};
    for(var i=0; i<sequence.length; i++) {
        let key = sequence[i]+"";
        if(isNaN(key))
            key="NaN";

        if(!short[key]) 
            short[key]=0;
        short[key]++;
    }
    
    console.log("short: ", short)
    //return <span className="degree"></span>;
    
    let degs = Object.keys(short).sort((a,b)=>b-a);
    return degs.map((deg, i)=>{
        return <span key={i} className="degree">{deg}<sup className="count">{short[deg]}</sup></span>
    });
} // toJSXSequence()