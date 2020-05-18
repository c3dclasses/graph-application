import GraphApplicationState from "./graphapplicationstate";
import { GraphApplicationActionsInstance as gaa } from "./graphapplicationactions";
import CGraphicsGraph from "../libs/cgraphicsgraph/cgraphicsgraph";
import "../libs/cgraphicsgraph/cgraphicsgraph.prototype";

// get data store in local storage
/*
const labeltype = localStorage.getItem("label-type");
const profiletype = localStorage.getItem("profile-type");
const bshort = localStorage.getItem("bshort");
const saved_vertices = localStorage.getItem("saved-vertices");
const saved_vertices_data = localStorage.getItem("saved-vertices-data");
const saved_edges = localStorage.getItem("saved-edges");
const saved_edges_data = localStorage.getItem("saved-edges-data");
*/

export default function GraphApplicationReducer(state=GraphApplicationState, action) {
    let newstate = {...state};
    switch(action.type) {
        case gaa.INIT:
            window.cgraphicsgraph = new CGraphicsGraph(action.data);
            newstate.m_cgraphicsgraph = window.cgraphicsgraph;
            newstate.m_cgraphicsgraph.loadFromLocalStorage();
        break;
        case gaa.LAYOUT:
            newstate.m_cgraphicsgraph.layoutVerticesInCircle();
        break;
        case gaa.GRID:
           newstate.m_bshowgrid = newstate.m_cgraphicsgraph.toggleGridLayout();   
        break;
        case gaa.GRIDROW:
            newstate.m_cgraphicsgraph.setGridRows(action.data); 
        break;
        case gaa.GRIDCOL:
            newstate.m_cgraphicsgraph.setGridColumns(action.data);
            newstate.m_cgraphicsgraph.drawAnimationFrame();
        break;
        
        case gaa.LABELTYPE:
            newstate.m_cgraphicsgraph.setLabelType(action.data);
            newstate.m_cgraphicsgraph.drawAnimationFrame();
            newstate.m_labeltype = action.data;
            localStorage.setItem("label-type", action.data);
        break;
        case gaa.PROFILETYPE:
            newstate.m_cgraphicsgraph.setProfileType(action.data);
            newstate.m_cgraphicsgraph.drawAnimationFrame();
            newstate.m_profiletype = action.data;
            localStorage.setItem("profile-type", action.data);
        break;
        case gaa.CLEAR:
            newstate.m_cgraphicsgraph.clearAll();
        break;
        case  gaa.SCREENSHOT:
            newstate.m_cgraphicsgraph.screenshot();
        break;
        case gaa.GETPROPERTIES:
            newstate.m_numvertices = newstate.m_cgraphicsgraph.getNumOfVertices();
            newstate.m_vertices = newstate.m_cgraphicsgraph.toStringVertices(" ");
            newstate.m_numedges = newstate.m_cgraphicsgraph.getNumOfEdges(false);
            newstate.m_edges = newstate.m_cgraphicsgraph.toStringEdges(" ","\n");
            updateProfiles(newstate);
            console.log("saving to local storage")
            newstate.m_cgraphicsgraph.saveToLocalStorage();
        break;

        case gaa.SETPROPERTIES:
              if(action.data.type === "v")
                updateVertices(newstate, action.data.vertices);
            else if(action.data.type === "e")
                updateEdges(newstate, action.data.edges);
            
        break;

        case gaa.GETPROFILE:
        break;
        
        case gaa.SETSHORTPROFILE:
            newstate.m_profiles = {...newstate.m_profiles};
            newstate.m_profiles.m_bshort = action.data.bshort;
            localStorage.setItem("bshort", action.data.bshort);
        break;
        
        case gaa.SETSHOWPROFILE:
            let sequences = newstate.m_profiles.m_sequences[action.data.index]
            newstate.m_profiles.m_sequences[action.data.index] = {...sequences};
            newstate.m_profiles.m_sequences[action.data.index].m_bshow = action.data.bshow;
            alert(action.data.bshow);
        break;

        default:
            break;

    }
    return newstate;
}

// helper functions
function updateVertices(newstate, strvertices) {
    let bupdate = false;
    if(strvertices) {
        bupdate = newstate.m_cgraphicsgraph.updateVertices(strvertices.trim().split(" "));
        newstate.m_vertices = strvertices;
        if(bupdate) {
            newstate.m_numvertices = newstate.m_cgraphicsgraph.getNumOfVertices();
            newstate.m_cgraphicsgraph.drawAnimationFrame();
        }
    }
    else {
        newstate.m_cgraphicsgraph.clearAll();
        newstate.m_vertices = "";
        newstate.m_numvertices = 0;
    }
    return bupdate;
}

function updateEdges(newstate, stredges) {
    let bupdate = false;
    if(stredges) {
        let nedges = newstate.m_cgraphicsgraph.parseEdges(stredges);
        bupdate = newstate.m_cgraphicsgraph.updateEdges(nedges);
        newstate.m_edges = stredges;
        if(bupdate) {
            newstate.m_numedges = newstate.m_cgraphicsgraph.getNumOfEdges(false);
            newstate.m_cgraphicsgraph.drawAnimationFrame();
        }
    }
    else {
        newstate.m_cgraphicsgraph.clearAll();
        newstate.m_edges = "";
        newstate.m_numedges = 0;
    }
    return bupdate;
}

function updateProfiles(newstate) {
    let cgraphicsgraph = newstate.m_cgraphicsgraph;
    let seq = cgraphicsgraph.getSequences();
    newstate.m_profiles.m_sequences = [...newstate.m_profiles.m_sequences];
    let sequences = newstate.m_profiles.m_sequences;
    for(let i=0; i<sequences.length; i++) {
        sequences[i] = {...sequences[i]};
        sequences[i].m_long = seq.long[i];
        sequences[i].m_short = seq.short[i];
    }
}