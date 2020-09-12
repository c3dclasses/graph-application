import GraphApplicationState from "./graphapplicationstate";
import { GraphApplicationActionsInstance as __ } from "./graphapplicationactions";
import { CGraphicsGraphInstance } from "../libs/cgraphicsgraph/cgraphicsgraph";
import { ProfileSequences } from "../libs/cgraphicsgraph/cgraphicsgraphvertex"; 

let cgraphicsgraph = null;
export default function GraphApplicationReducer(state=GraphApplicationState, action) {
    let newstate = {...state};
    switch(action.type) {
        case __.INIT:
            newstate = initGraphApplication(action.data, newstate);
        break;
        case __.LAYOUT:
            cgraphicsgraph.layoutVerticesInCircle();
        break;
        case __.CLEAR:
            cgraphicsgraph.clearAll();
        break;
        case __.SCREENSHOT:
            cgraphicsgraph.saveScreenshot();
        break;

        case __.LABELTYPE:
            cgraphicsgraph.setProperties({m_vlabeltype:action.data});
            newstate.m_vlabeltype = action.data;
        break;

        case __.PROFILETYPE:
            newstate.m_vprofiletype = {...newstate.m_vprofiletype};
            if(action.data.checked)
                newstate.m_vprofiletype[action.data.id] = true;
            else delete newstate.m_vprofiletype[action.data.id];
            console.log(newstate.m_vprofiletype)
            cgraphicsgraph.setProperties({m_vprofiletype:newstate.m_vprofiletype});
            //newstate.m_vprofiletype[action.data] = action.data;
        break;

        case __.TOGGLEHEADER:
            if(cgraphicsgraph) {
                newstate.m_bheader = !newstate.m_bheader; 
                cgraphicsgraph.setProperties({m_bheader:newstate.m_bheader});     
            }
        break;
        
        case __.TOGGLERIGHTSIDEBAR:
            if(cgraphicsgraph) {
                newstate.m_brightsidebar = !newstate.m_brightsidebar; 
                cgraphicsgraph.setProperties({m_brightsidebar:newstate.m_brightsidebar});     
            }
        break;

        case __.TOGGLELEFTSIDEBAR:
            if(cgraphicsgraph) {
                newstate.m_bleftsidebar = !newstate.m_bleftsidebar; 
                cgraphicsgraph.setProperties({m_bleftsidebar:newstate.m_bleftsidebar});     
            }
        break;

        case __.RESTOREPOSITION:
            if(cgraphicsgraph)
                cgraphicsgraph.restoreVertexPositions();
        break;

        case __.SAVEPOSITION:
            if(cgraphicsgraph)
                cgraphicsgraph.saveVertexPositions();
        break;

        case __.TOGGLEGRID:
            if(cgraphicsgraph) {
                newstate.m_bshowgrid = !newstate.m_bshowgrid; 
                cgraphicsgraph.setProperties({m_bshowgrid:newstate.m_bshowgrid});     
            }
        break;

        case __.SETGRIDROW:
            newstate.m_ngridrows = action.data;
            cgraphicsgraph.setProperties({m_ngridrows:newstate.m_ngridrows});     
        break;
        
        case __.SETGRIDCOL:
            newstate.m_ngridcols = action.data;
            cgraphicsgraph.setProperties({m_ngridcols:newstate.m_ngridcols});     
        break;

        case __.EDGEWIDTH:
            if(cgraphicsgraph) {
                newstate.m_ewidth = action.data; 
                cgraphicsgraph.setProperties({m_ewidth:newstate.m_ewidth});     
            }
        break;
        case __.VERTEXRADIUS:
            if(cgraphicsgraph) {
                newstate.m_vradius = action.data; 
                cgraphicsgraph.setProperties({m_vradius:newstate.m_vradius});     
            }
        break;
        default:
        break;
    }
    return newstate;
}

///////////////////////////////
// reducer helper functions
function initGraphApplication(data, newstate) {
    try {
        newstate.m_bshowloadspinner = true;
        newstate.m_berror = false;
        newstate.m_loadspinnermsg = "Initializing the Graph Application...";
        cgraphicsgraph = CGraphicsGraphInstance;
        cgraphicsgraph.create(data);
        window.cgraphicsgraph = cgraphicsgraph;
        newstate = {...newstate, ...cgraphicsgraph.getProperties()};
        newstate.m_bshowloadspinner = false;
    } // end try
    catch(error) {
        newstate.m_berror = true;
        newstate.m_loadspinnermsg = "ERROR (initGraphApplication) - " + error;
    } // end catch
    return newstate;
} // end initGraphApplication()

