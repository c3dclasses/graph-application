class GraphApplicationActions {
    static m_instance = GraphApplicationActions.instance || new GraphApplicationActions();
    
    // constants
    constructor() {
        this.INIT = 0;
        this.CLEAR = 0;
        this.LAYOUT = 0;
        this.TOGGLEGRID = 0;
        this.SETGRIDROW = 0;
        this.SETGRIDCOL = 0; 
        this.SCREENSHOT = 0;
        this.LABELTYPE = 0;
        this.PROFILETYPE = 0;
        this.GETPROPERTIES = 0;
        this.SETPROPERTIES = 0;
        this.GETPROFILE = 0;
        this.SETSHORTPROFILE = 0;
        this.SETSHOWPROFILE = 0;
        this.SHOWLOADSPINNER = 0;
        this.TOGGLEHEADER = 0;
        this.TOGGLELEFTSIDEBAR = 0;
        this.TOGGLERIGHTSIDEBAR = 0;
        this.EDGEWIDTH = 0;
        this.VERTEXRADIUS = 0;
        this.SAVEPOSITION = 0;
        this.RESTOREPOSITION = 0;
        this.UPDATEPROFILESEQUENCES = 0;
        
        // assign a value
        let i = 0;
        for(let prop in this) {
            this[prop] = i;
            i++;
        }
    } 
    
    // functions
    init(cgraph) { return { type: this.INIT, data:cgraph }; }
    clear() { return {type: this.CLEAR }; }
    layout() { return { type: this.LAYOUT }; }
    saveScreenshot() { return { type: this.SCREENSHOT }; }
    setLabelType(vlabeltype) { return { type: this.LABELTYPE, data:vlabeltype }; }
    setProfileType(vprofiletype) { return { type: this.PROFILETYPE, data:vprofiletype }; }
    toggleHeader() {return { type: this.TOGGLEHEADER } }
    toggleLeftSidebar() { return { type: this.TOGGLELEFTSIDEBAR } }
    toggleRightSidebar() {return { type: this.TOGGLERIGHTSIDEBAR } }
    savePosition() { return {type: this.SAVEPOSITION } }
    restorePosition() { return {type: this.RESTOREPOSITION } }
    toggleGrid() { return { type: this.TOGGLEGRID }; }
    setGridRows(row){ return { type: this.SETGRIDROW, data:row }; }
    setGridColumns(col){ return { type: this.SETGRIDCOL, data:col }; }
    setVertexRadius(radius) { return { type: this.VERTEXRADIUS, data:radius } }
    setEdgeWidth(width) { return { type: this.EDGEWIDTH, data:width } }
    setShowProfile(index,bshow) { return { type: this.SETSHOWPROFILE, data:{ index, bshow } }; }
    updateProfileSequences() { return { type: this.UPDATEPROFILESEQUENCES }; }
    setShortProfile(bshort) { return {type: this.SETSHORTPROFILE, data:bshort } }
    
    /*
    setProfileType(profiletype) { return { type: this.PROFILETYPE, data:profiletype }; }
    getProperties() { return { type: this.GETPROPERTIES } }
    setProperties(vertices, edges, type) { return { type: this.SETPROPERTIES, data:{ vertices, edges, type } } }
    getProfile() { return { type: this.GETPROFILE } }
    setShortProfile(bshort) { return {type: this.SETSHORTPROFILE, data:bshort } }
    setShowProfile(index,bshow) { return { type: this.SETSHOWPROFILE, data:{index, bshow } }; }
    showLoadSpinner(bshowspinner) { return { type: this.SHOWLOADSPINNER, data:bshowspinner }; }
    */
}

export const GraphApplicationActionsInstance = GraphApplicationActions.m_instance;