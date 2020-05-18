import React, {useEffect} from "react";
import { useDispatch } from 'react-redux';
import "./graph.css";
import GraphApplicationActions from "../../reducers/graphapplicationactions";

// constants
const SEL_CANVAS_ELEMENT = "graph";
const gaa = GraphApplicationActions.instance;

const Graph = () => {
    const dispatch = useDispatch();
    useEffect(() => { 
        dispatch(gaa.init(document.getElementById(SEL_CANVAS_ELEMENT)));
    }, []);
    
    return (
        <canvas id={SEL_CANVAS_ELEMENT}></canvas>
    );
} 

export default Graph;