import { getRandomNumber, collidePoint2Circle, collidePoint2LineSegment, triggerEvent, handleEvent } from "../utility/utility";
import CGraphics from "../cgraphics/cgraphics";
import CGraph from "../cgraph/cgraph";
import "./cgraphicsgraphvertex";
import "./cgraphicsgraphedge";
import CEdgeData, {CNewEdgeDataLine} from "./cedgedata";
import CVertexData from "./cvertexdata";

export default class CGraphicsGraph extends CGraph {
	constructor(elecanvas) { 	
		super();
		this.init(elecanvas);
	}

	init(elecanvas) {
		this.m_bgcolor = "#e6e6e6";
		this.m_cnewedgeline = new CNewEdgeDataLine();
		this.m_cgraphics = new CGraphics(elecanvas, true);
		this.m_canvas = this.m_cgraphics.getCanvas();
		this.m_vlabeltype = "letters";
		this.m_vprofiletype = 0;
		this.m_numDrawCalls = 0;
		this.m_vradius = 18;
		this.m_ewidth = 5;
		this.draw = this.draw.bind(this);
		this.disableSelection();
		this.initEventHandlers();
	} 

	// label and profile type
	setLabelType(labeltype) { this.m_vlabeltype = labeltype; }
	setProfileType(profiletype) { this.m_vprofiletype = profiletype; }
	
	/////////////////////////////////
	// get / set graph properties
	
	getCGraphics() { return this.m_cgraphics; }
	
	getBGColor() { return this.m_bgcolor; }

	//////////////////////////////////////////
	// adding and removing vertices and edges
	load(data) {
		if(!data)
			return false;
		if(!data.vertices)
			return false;
		let vertices = data.vertices;
		let vdata = data.vertices_data;
		for(let i=0; i<vertices.length; i++) {
			let cvertexdata = new CVertexData();
			if(!vdata || !vdata[i])
				cvertexdata.init(this.getInitParams());
			else cvertexdata.loadParams(vdata[i]);
			super.addCGraphVertexWithLabel(cvertexdata, vertices[i]);
		} // end for
		if(!data.edges)
			return false;
		let edges = data.edges;
		for(let i=0; i<edges.length; i++) {
			this.addMultiEdge(edges[i][0],edges[i][1]);
		} // end for
		this.triggerLoad();
		return true;
	} // end load()

	addVertexAtClientPos(cx,cy) { 
		return super.addCGraphVertex(new CVertexData({x:cx,y:cy,r:this.m_vradius}));
	} 
	
	addVertexAtRandomClientPos(label) { 
		return super.addCGraphVertexWithLabel(new CVertexData(this.getInitParams()),label);
	} 
	
	removeVertex(vindex) { 
		super.removeVertex(vindex); 
	} 
	
	addMultiEdge(vindex1, vindex2) { 
		return  super.addMultiCGraphEdge(vindex1, vindex2, new CEdgeData(this, vindex1, vindex2));
	} 

	removeMultiEdge(vindex1, vindex2) { super.removeMultiEdge(vindex1, vindex2); }

	addNewEdgeAtXY(x,y) {
		let v = this.getSelectedVertex();
		if(!v || !v.getData())
			return;
		v = v.getData();
		this.m_cnewedgeline.setStartPos(v.m_x,v.m_y);
		this.m_cnewedgeline.setEndPos(x,y);
	} // end addNewEdgeAtXY()

	///////////////////////
	// selection
	
	getSelectedVertex() { return this.m_selectedVertex; }
	
	enableSelection(x,y) {
		this.m_selectedVertex = this.collidePoint2CGraphVertex(x,y);
		this.m_bMouseDown = true;
	} // end enableSelection()

	disableSelection() {
		this.m_selectedVertex = null;
		this.m_bMouseDown = false;
	} // end disableSelection()

	//////////////////
	// drawing
	draw() { 
		if(this.m_numDrawCalls === 1) {
			this.drawGraph(); 
			this.m_numDrawCalls = 0;
		}
		else this.m_numDrawCalls--;
	}

	drawAnimationFrame() { 
		requestAnimationFrame(this.draw);
		this.m_numDrawCalls++;
	}

	drawGraph() {
		this.m_cgraphics.clear(this.m_bgcolor, 0.0);
		this.drawNewEdge();
		this.drawEdges();
		this.drawVertices();
	} // end drawGraph()

	drawNewEdge() {
		if(this.m_bMouseDown && this.getSelectedVertex())
			this.m_cnewedgeline.draw(this.m_cgraphics);
	} // end drawNewEdge()
	
	drawEdges() {
		let edges = this.getEdges();
		if(edges)
			for(let v1 in edges)
				for(let v2 in edges[v1]) 
					edges[v1][v2].draw(this.m_cgraphics);
		return;
	} // end drawEdges()
	
	drawVertices() {
		let vertices = this.getVertices();
		if(vertices)
			for(let v in vertices)
				vertices[v].draw(this.m_cgraphics);
		return;
	} // end drawVertices()
	
	//////////////////////////
	// collision detection
	
	collidePoint2CGraphVertex(x,y) {
		let vertices = this.getVertices();
		if(vertices == null)
			return null;
		for(let v in vertices) {
			let cgraphvertex = vertices[v];
			let data = cgraphvertex.getData();
			if(collidePoint2Circle(x, y, data.m_x, data.m_y, data.m_r + 20)) {
				return cgraphvertex;
			}
		} // end for
		return null;
	} // end collidePoint2CGraphVertex()
	
	collidePoint2CGraphEdge(x,y) {
		let edges = this.getEdges();
		if(edges == null)
			return null;
		for(let v1 in edges) {
			for(let v2 in edges[v1]) {
				let cgraphedge = edges[v1][v2]; 
				let vdata1 = cgraphedge.getCGraphVertex1().getData();
				let vdata2 = cgraphedge.getCGraphVertex2().getData();
				if(collidePoint2LineSegment(x,y,vdata1.m_x,vdata1.m_y,vdata2.m_x,vdata2.m_y,8))
					return cgraphedge;
			} // end for
		} // end for
		return null;
	} // end collidePoint2CGraphEdge()

	getInitParams() {
		let d = this.m_cgraphics.getWH();
		let r = this.m_vradius;
		return {
			r: r, 
			x: getRandomNumber(r, d.w-r),
			y: getRandomNumber(r, d.h-r)
		}
	} // end getInitParams()

	////////////////////////////
	// event handlers methods
	
	initEventHandlers() {
		this.m_cgraphics.setOnResize(this.handleResize.bind(this));
		this.m_canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
		this.m_canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
		this.m_canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.m_canvas.addEventListener("contextmenu", this.handleContextMenu.bind(this));
	} // end initEventHandlers()

	handleResize(ow,oh,nw,nh) {
		this.repositionVertices(ow, oh, nw, nh); 
		//this.drawGraph();	
		this.drawAnimationFrame();
	}
	
	handleMouseDown(e) {
		if(e.which === 3)
			return;
		let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
		this.enableSelection(p.x,p.y);
	} // end handleMouseDown()
	
	handleMouseUp(e) {
		if(this.m_bMouseDown === false)
			return;
		let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
		let cgraphvertex_start = this.getSelectedVertex();
		let cgraphvertex_end = this.collidePoint2CGraphVertex(p.x,p.y);
		if(!cgraphvertex_start && !cgraphvertex_end) {
			this.addVertexAtClientPos(p.x,p.y);
			this.triggerUpdate();
		}
		else if(cgraphvertex_start && !cgraphvertex_end) {
			cgraphvertex_start.getData().setPos(p.x,p.y);
			this.triggerUpdate();
		}
		else if(cgraphvertex_start && cgraphvertex_end && cgraphvertex_start !== cgraphvertex_end) {
			this.addMultiEdge(cgraphvertex_start.getIndex(), cgraphvertex_end.getIndex());
			this.triggerUpdate();
		}
		this.disableSelection();
		this.drawAnimationFrame();
	} // end handleMouseUp()
	
	handleMouseMove(e) {
		if(this.m_bMouseDown) {
			let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
			this.addNewEdgeAtXY(p.x,p.y);
			//this.drawGraph();
			//requestAnimationFrame(this.draw);
			this.drawAnimationFrame();
		} // end if
	} // end handleMouseMove()
	
	handleContextMenu(e) {
		e.preventDefault();
		let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
		let cgraphvertex = this.collidePoint2CGraphVertex(p.x,p.y);
		if(cgraphvertex) {
			this.removeVertex(cgraphvertex.getIndex());
			this.drawAnimationFrame();
			this.triggerUpdate();
			return;
		} // end if
		let cgraphedge = this.collidePoint2CGraphEdge(p.x,p.y);
		if(cgraphedge) {
			this.removeMultiEdge(cgraphedge.getVertexIndex1(), cgraphedge.getVertexIndex2());
			this.triggerUpdate();
		}
		this.drawAnimationFrame();
	} // end handleContextMenu()

	/////////////////
	// other 

	repositionVertices(ow,oh,nw,nh) {
		if(ow === 0 || oh === 0)
			return;
		let sw = nw/ow;
		let sh = nh/oh;
		let vertices = this.getVertices();
		if(vertices == null)
			return;
		for(let v in vertices) {
			let vdata = vertices[v].getData();
			vdata.reposition(sw,sh,nw,nh);
		} // end for
	} // end repositionVertices()

	screenshot() { this.m_cgraphics.saveScreenShot(); }

	triggerUpdate() { triggerEvent("cgraphicsgraph.update", this); }
	
	triggerLoad() { triggerEvent("cgraphicsgraph.load", this); }	
} // end CGraphicsGraph

export function handleCGraphicsGraphUpdate(fnhandler) {
	handleEvent("cgraphicsgraph.update", fnhandler);
}

export function handleCGraphicsGraphLoad(fnhandler) {
	handleEvent("cgraphicsgraph.load", fnhandler);
}