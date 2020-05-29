import React from "react";
import "./graphoperations.css";
import { useDispatch, useSelector } from 'react-redux';
import { GraphApplicationActionsInstance as gaa } from "../../reducers/graphapplicationactions";

export default function GraphOperations() {
    const dispatch = useDispatch();	
    const labeltype = useSelector(state=>state.m_labeltype);
    const profiletype = useSelector(state=>state.m_profiletype);
    const sequences = useSelector(state=>state.m_profiles.m_sequences);
    const bshowgrid = useSelector(state=>state.m_bshowgrid);
    //const ngridrows = useSelector(state=>state.m_ngridrows);
    //const ngridcols = useSelector(state=>state.m_ngridcols);
    

    return (
        <div className="graph-operations">
            <div className="menu btn-group op1">
                <button name="clear" alt="clear" title="clear" onClick={()=>{dispatch(gaa.clear());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="clear" className="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>
                </button>
                <button name="layoutVerticesInCircle"  title="layout" alt="arrange" onClick={()=>{dispatch(gaa.layout());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="layoutVerticesInCircle" className="glyphicon glyphicon-unchecked"></span>
                </button>
                <button name="screenshot"  title="screenshot" onClick={()=>{dispatch(gaa.screenshot());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="screenshot" className="glyphicon glyphicon-picture" aria-hidden="true"></span>
                </button>
            </div>
               
            <div className="menu btn-group op2">         
                <button  title="vertex label" type="button" className="btn btn-default btn-sm">
                    <span><b>Label:</b></span> <select value={labeltype} onChange={(e)=>{dispatch(gaa.labelType(e.currentTarget.value));}} className="custom-select custom-select-lg mb-3">
                        <option value="">none</option>
                        <option value="letters">letters</option>
                        <option value="numbers">numbers</option>
                    </select>
                </button>
                <button title="vertex attributes" type="button" className="btn btn-default btn-sm">
                    <label>Profile:</label> <select value={profiletype} onChange={(e)=>{dispatch(gaa.profileType(parseInt(e.currentTarget.value)));}} className="custom-select custom-select-lg mb-3">
                        <option value="-1">none</option>
                        {sequences.map((sequence, i)=>{
                            return <option key={i} value={i}>{sequence.m_shortname}</option>
                        })}
                    </select>
                </button>
            </div>

            <div className="graph-options grid-ops btn-group op3">
                <button name="toggleGridLayout"  title="grid" onClick={()=>{dispatch(gaa.grid());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="toggleGridLayout" className="glyphicon glyphicon-th" aria-hidden="true"></span>
                </button>
                {(bshowgrid)?<>
                <button className="btn btn-default btn-sm">
                    <label>Rows:</label>&nbsp;
                    <input type="number" defaultValue="3" onChange={(e)=>{dispatch(gaa.setGridRows(e.target.value));}} className="" name="nrows" min="1" max="1000" placeholder="" />
                </button>
                <button className="btn btn-default btn-sm">
                    <label>Columns:</label>&nbsp;
                    <input type="number" defaultValue="3" onChange={(e)=>{dispatch(gaa.setGridColumns(e.target.value));}} className="" name="ncols" min="1" max="1000" placeholder="" />
                </button>
                </> : (<></>)
                }
            </div>
        </div>
    );
} // end GraphOperations
