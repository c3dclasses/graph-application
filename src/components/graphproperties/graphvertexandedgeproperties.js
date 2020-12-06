import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import "./graphproperties.css";

export default function GraphVertexAndEdgeProperties() {
    //const numvertices = useSelector(state=>state.m_numvertices);
    const vdata = useSelector(state=>state.m_vdata);
    const edata = useSelector(state=>state.m_edata);
    
    console.log("vdata: ", vdata)
    console.log("edata: ", edata)
    
    //const numvertices = vdata[0].length;
    //const numedges = edata[0].length;
    //const dispatch = useDispatch();

    return (
        <div className="graph-properties">
            {/*}
            <label>Vertices ({numvertices}):</label><br />
            
            <textarea id="vertices" onChange={(e)=>{dispatch(__.setVerticesFromInput(e.target.value,null,"v"))}} key="1" name="vstr" value={vertices} /><br /> 
    */}
            {/*
            <label>Edges ({numedges}):</label><span className="sidenote">Maximum #: ({(numvertices*(numvertices-1))/2})</span><br />
            <textarea id="edges" key="2" onChange={(e)=>{dispatch(__.setEdgesFromInput(null,e.target.value,"e"))}} name="estr" value={edges}></textarea>
            */} 
        </div>
    );
} // end GraphVertexAndEdgeProperties