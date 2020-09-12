import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as gaa } from "../../reducers/graphapplicationactions";
import Header from "../header/header";
import Main from "../main/main";
import LoadSpinner from "../loadspinner/loadspinner";
import "./app.css";
//import {handleCGraphicsGraphUpdate, handleCGraphicsGraphLoad} from "../../libs/cgraphicsgraph/cgraphicsgraph";

export default function App(){
    const dispatch = useDispatch();	
    useEffect(()=>{ 
        dispatch(gaa.init(document.getElementById("graph")));
    },[]);

    return (
        <div id="app">
            <Header />
            <Main />
            <LoadSpinner />
        </div>
    ); 
}