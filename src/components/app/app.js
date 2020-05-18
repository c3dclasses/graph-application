import React, { useEffect } from "react";
import "./app.css";
import Header from "../header/header";
import Main from "../main/main";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as gaa } from "../../reducers/graphapplicationactions";
import { handleCGraphicsGraphUpdate } from "../../libs/cgraphicsgraph/cgraphicsgraph";

export default function App(){
    const labeltype = useSelector(state=>state.m_labeltype);
    const profiletype = useSelector(state=>state.m_profiletype);
    const dispatch = useDispatch();	
    useEffect(()=>{ 
        dispatch(gaa.labelType(labeltype));
        dispatch(gaa.profileType(profiletype)); 
        handleCGraphicsGraphUpdate(()=>{dispatch(gaa.getProperties());})
    },[]);
    return (
        <div id="app">
            <Header /> 
            <Main />
        </div>
    ); 
}