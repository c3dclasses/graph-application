import React from "react";
import "./graphoperations.css";
import { useDispatch, useSelector } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";

export default function GraphOperations() {
    const vlabeltype = useSelector(state=>state.m_vlabeltype);
    const vprofiletype = useSelector(state=>state.m_vprofiletype);
    const profilesequences = useSelector(state=>state.m_profilesequences);
    const bshowgrid = useSelector(state=>state.m_bshowgrid);
    const ngridrows = useSelector(state=>state.m_ngridrows);
    const ngridcols = useSelector(state=>state.m_ngridcols);
    const ewidth = useSelector(state=>state.m_ewidth);
    const vradius = useSelector(state=>state.m_vradius);
    const dispatch = useDispatch();	


    return (
        <div className="graph-operations">
            <div className="menu btn-group op1">
                <button name="clear" alt="clear" title="clear" onClick={()=>{dispatch(__.clear());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="clear" className="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>
                </button>
                <button name="layoutVerticesInCircle"  title="layout" alt="arrange" onClick={()=>{dispatch(__.layout());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="layoutVerticesInCircle" className="glyphicon glyphicon-unchecked"></span>
                </button>
                <button name="screenshot"  title="screenshot" onClick={()=>{dispatch(__.saveScreenshot());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="screenshot" className="glyphicon glyphicon-picture" aria-hidden="true"></span>
                </button>
            {/*
                <button name="restore-position"  title="restore-position" onClick={()=>{dispatch(__.restorePosition());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="restore-position" className="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                </button>

                <button name="save-position"  title="save-position" onClick={()=>{dispatch(__.savePosition());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="restore-position" className="glyphicon glyphicon-save" aria-hidden="true"></span>
                </button>
            */}

            </div>
            <div className="menu btn-group op2 graph-operations">         
                <button  title="vertex label" type="button" className="btn btn-default btn-sm">
                    <span><b>Label:</b></span> <select value={vlabeltype} onChange={(e)=>{dispatch(__.setLabelType(e.currentTarget.value));}} className="custom-select custom-select-lg mb-3">
                        <option value="">none</option>
                        <option value="letters">letters</option>
                        <option value="numbers">numbers</option>
                    </select>
                </button>
                <div className="btn-group">
                    <button className="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <b>Profile</b> <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {profilesequences.map((sequence, i) => {
                            return (
                                <li className="profile" key={i}>                                
                                    <>
                                        <input 
                                            type="checkbox" 
                                            value={i} 
                                            checked={(vprofiletype && vprofiletype[i])?true:false}
                                            name={sequence.m_shortname} 
                                            onChange={(e)=>{dispatch(__.setProfileType({id:parseInt(e.currentTarget.value), checked:e.currentTarget.checked}));}}
                                        />
                                        <span>{sequence.m_shortname}</span>
                                    </>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            {/*
            <div className="menu btn-group op2 graph-operations">         
                <button className="btn btn-default btn-sm">
                    <label>Radius:</label>&nbsp;
                    <input type="number" value={vradius} onChange={(e)=>{dispatch(__.setVertexRadius(e.target.value));}} className="" min="1" max="1000" placeholder="" />
                </button>
                <button className="btn btn-default btn-sm">
                    <label>Width:</label>&nbsp;
                    <input type="number" value={ewidth} onChange={(e)=>{dispatch(__.setEdgeWidth(e.target.value));}} className="" min="1" max="1000" placeholder="" />
                </button>
            </div>
            */}
            {
            <div className="graph-options grid-ops btn-group op3 graph-operations">
                <button name="toggleGridLayout"  title="grid" onClick={()=>{dispatch(__.toggleGrid());}} type="button" className="btn btn-default btn-sm" aria-label="Left Align">
                    <span name="toggleGridLayout" className="glyphicon glyphicon-th" aria-hidden="true"></span>
                </button>
                {(bshowgrid)?<>
                <button className="btn btn-default btn-sm">
                    <label>Size:</label>&nbsp;
                    <input 
                        type="number" 
                        value={parseInt(ngridrows)} 
                        onChange={(e)=>{
                            dispatch(__.setGridRows(e.target.value));
                            dispatch(__.setGridColumns(e.target.value));
                        }} 
                        className="" 
                        name="nrows" 
                        min="1" 
                        max="1000" 
                        placeholder="" 
                    />
                </button>
                    {/*
                <button className="btn btn-default btn-sm">
                    <label>Columns:</label>&nbsp;
                    <input type="number" value={ngridcols} onChange={(e)=>{dispatch(__.setGridColumns(e.target.value));}} className="" name="ncols" min="1" max="1000" placeholder="" />
                </button>
                    */}
                </> : (<></>)
                }
            </div>
            }
        </div>

    );
} // end GraphOperations
