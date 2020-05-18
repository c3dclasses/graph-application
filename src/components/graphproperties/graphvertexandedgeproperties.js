import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as gaa } from "../../reducers/graphapplicationactions";
import "./graphproperties.css";

export default function GraphVertexAndEdgeProperties() {
    const numvertices = useSelector(state=>state.m_numvertices);
    const vertices = useSelector(state=>state.m_vertices);
    const numedges = useSelector(state=>state.m_numedges);
    const edges = useSelector(state=>state.m_edges);
    const dispatch = useDispatch();
    return (
        <div className="graph-properties">
            <label>Vertices ({numvertices}):</label><br />
            <textarea id="vertices" onChange={(e)=>{dispatch(gaa.setProperties(e.target.value,null,"v"))}} key="1" name="vstr" value={vertices} /><br /> 
            <label>Edges ({numedges}):</label><span className="sidenote">Maximum #: ({(numvertices*(numvertices-1))/2})</span><br />
            <textarea id="edges" key="2" onChange={(e)=>{dispatch(gaa.setProperties(null,e.target.value,"e"))}} name="estr" value={edges}></textarea> 
        </div>
    );
} // end GraphVertexAndEdgeProperties