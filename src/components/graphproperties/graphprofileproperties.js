import  React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as gaa } from "../../reducers/graphapplicationactions";
import "./graphproperties.css";

export default function GraphProfileProperties() {
    const dispatch = useDispatch();
    const bshort = useSelector(state=>state.m_profiles.m_bshort);
    const profiles = useSelector(state=>state.m_profiles);
    const sequences = useSelector(state=>state.m_profiles.m_sequences);
    const bshow = [];
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[0].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[1].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[2].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[3].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[4].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[5].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[6].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[7].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[8].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[9].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[10].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[11].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[12].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[13].m_bshow));
    bshow.push(useSelector(state=>state.m_profiles.m_sequences[14].m_bshow));
    return (
        <div className="profile">
            <div className="profile-controls">
                {
                    sequences.map((sequence, i)=>(
                        <div key={i}>
                            <b>{sequence.m_shortname}:</b> <input type="checkbox" onChange={(e)=>{dispatch(gaa.setShowProfile(i, e.target.checked))}} checked={sequence.m_bshow}/>
                        </div>
                    ))
                }
            </div>
            <div className="profile-output">
                {
                    sequences.map((sequence, i)=>(
                        (sequence.m_bshow===true) ? 
                            <div key={i}>
                                <input type="hidden" value={profiles.m_bshort} />
                                <span className="lab">{sequence.m_shortname}:</span> {toJSXSequence(sequence, profiles.m_bshort)}
                            </div> : ""
                    ))
                }   
            </div>
            <div id="profile-short-notation">
                <b>short: </b>
                <input type="checkbox" onChange={(e)=>{dispatch(gaa.setShortProfile(e.target.checked))}} checked={profiles.m_bshort} />
            </div><br />
        </div>       
    );
} // end GraphProfileProperties

function toJSXSequence(sequence, bshort) { 
    if(!bshort)
        return (<span className="degree">{(sequence.m_long) ? sequence.m_long.sort((a,b)=>b-a).join(" ") : ""}</span>);
    if(!sequence.m_short)
        return <span className="degree"></span>;
    let degs = Object.keys(sequence.m_short).sort();
    return degs.map((deg, i)=>{
        return <span key={i} className="degree">{deg}<sup className="count">{sequence.m_short[deg]}</sup></span>
    });
} // toJSXSequence()