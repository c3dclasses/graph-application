export default class GraphApplicationActions {
    static instance = GraphApplicationActions.instance || new GraphApplicationActions();
    
    // constants
    constructor() {
        this.INIT = 0;
        this.CLEAR = 1;
        this.LAYOUT = 2;
        this.GRID = 3;
        this.GRIDROW = 4;
        this.GRIDCOL = 5;
        this.SCREENSHOT = 6;
        this.LABELTYPE = 7;
        this.PROFILETYPE = 8;
        this.GETPROPERTIES = 9;
        this.SETPROPERTIES = 10;
        this.GETPROFILE = 11;
        this.SETSHORTPROFILE = 12;
        this.SETSHOWPROFILE = 13;
        this.SHOWLOADSPINNER = 14;
        this.TOGGLELEFTSIDEBAR = 15;
        this.TOGGLERIGHTSIDEBAR = 16;
    } 
    
    // functions
    init(cgraph) { return {type:this.INIT, data:cgraph}; }
    clear() { return {type:this.CLEAR}; }
    layout() { return {type:this.LAYOUT}; }
    grid() { return {type:this.GRID}; }
    setGridRows(row){return {type:this.GRIDROW, data:row}; }
    setGridColumns(col){return {type:this.GRIDCOL, data:col}; }
    screenshot() { return {type:this.SCREENSHOT}; }
    labelType(labeltype) { return {type:this.LABELTYPE, data:labeltype}; }
    profileType(profiletype) { return {type:this.PROFILETYPE, data:profiletype}; }
    getProperties() { return {type:this.GETPROPERTIES} }
    setProperties(vertices, edges, type) { return {type:this.SETPROPERTIES, data:{vertices,edges,type}} }
    getProfile() {return {type:this.GETPROFILE}}
    setShortProfile(bshort) { return {type:this.SETSHORTPROFILE, data:bshort}}
    setShowProfile(index,bshow) {return {type:this.SETSHOWPROFILE, data:{index, bshow}}}
    showLoadSpinner(bshowspinner) {return {type:this.SHOWLOADSPINNER, data:bshowspinner}}
    toggleLeftSidebar(){return {type:this.TOGGLELEFTSIDEBAR}}
    toggleRightSidebar(){return {type:this.TOGGLERIGHTSIDEBAR}}
}

export const GraphApplicationActionsInstance = GraphApplicationActions.instance;