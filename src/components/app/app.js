import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import Header from "../header/header";
import Main from "../main/main";
import LoadSpinner from "../loadspinner/loadspinner";
import "./app.css";
import { handleCGraphicsGraphUpdate } from "../../libs/cgraphicsgraph/cgraphicsgraph";

export default function App(){
    const dispatch = useDispatch();	

    useEffect(()=>{ 
        dispatch(__.init(document.getElementById("graph")));
        handleCGraphicsGraphUpdate(function(){dispatch(__.updateProfileSequences());});
    },[]);

    return (
        <div id="app">
            <Header />
            <Main />
            <LoadSpinner />
        </div>
    ); 
}