import React, {useEffect} from "react";
import { useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as gaa } from "../../reducers/graphapplicationactions";
import "./graph.css";

// constants
const SEL_CANVAS_ELEMENT = "graph";
const Graph = () => {
/*
    const dispatch = useDispatch();
    useEffect(() => { 
        dispatch(gaa.init(document.getElementById(SEL_CANVAS_ELEMENT)));
        alert("loaded the graph");
    }, []);
 */   
    return (
        <canvas id={SEL_CANVAS_ELEMENT}></canvas>
    );
} 



export default Graph;