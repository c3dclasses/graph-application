import { 
	getRandomNumber, 
	collidePoint2LineSegment, 
	triggerEvent, 
	handleEvent,
	distOfPoints
} from "../utility/utility";
import CGraphics from "../cgraphics/cgraphics";
import CGraph from "../cgraph/cgraph";
import "./cgraphicsgraphvertex";
import "./cgraphicsgraphedge";
import CEdgeData, {CNewEdgeDataLine} from "./cedgedata";
import CVertexData, {CNewVertexSize} from "./cvertexdata";

export default class CGraphicsGraph extends CGraph {
	static m_instance = CGraphicsGraph.m_instance || new CGraphicsGraph();
	constructor() { 	
		super();
		this.draw = this.draw.bind(this);
		this.m_numdrawcalls = 0;
		this.m_bcreated = false;
		this.m_bmousedown = false;
		this.m_mousedown_coldata = null;
		this.m_version = 6.9;
		this.m_bstoregraph = true;
		this.m_properties = null;
		this.loadFromLocalStorage();
		if(!this.m_properties) {
			this.m_properties = {};
			this.setProperties({m_version:this.m_version});
			this.initDefaults();
			this.initDefaults2();
		}
	}

	create(elecanvas) {
		this.m_cnewedgeline = new CNewEdgeDataLine();
		this.m_cnewvertexsize = new CNewVertexSize();
		this.m_cgraphics = new CGraphics(elecanvas, true);
		this.m_canvas = this.m_cgraphics.getCanvas();
		this.disableMouseUp();
		this.initEventHandlers();
		this.triggerUpdate();
		this.m_bcreated = true;
		return true;
	}

	initDefaults() {
		this.setProperties(
			{
				m_bgcolor: "#e6e6e6",
				m_vlabeltype: "letters",
				m_vprofiletype: {},
				m_vradius: 15,
				m_ewidth: 10,
				m_busevradius: false,
				m_buseewidth: true,
				m_props: null,
			}
		)
	}

	setProperties(properties) {
		for(let propname in properties)
			this.m_properties[propname] = properties[propname];
		this.saveToLocalStorage2();
		if(this.m_bcreated)
			this.drawAnimationFrame();
	}

	getProperties() { 
		return this.m_properties;
	}

	// label and profile type
	//setLabelType(labeltype) { this.m_properties.m_vlabeltype = labeltype; }
	//setProfileType(profiletype) { this.m_properties. = profiletype; }
	//setVertexRadius(radius) { this.m_properties.m_vradius = radius;}
	//setEdgeWidth(width) { this.m_properties.m_ewidth = width;}
	
	
	/////////////////////////////////
	// get / set graph properties
	
	getCGraphics() { return this.m_cgraphics; }
	
	//getBGColor() { return this.m_bgcolor; }

	addVertexAtClientPos(cx,cy) { 
		let d = this.m_cgraphics.getWH();
		return super.addCGraphVertex(new CVertexData({x:cx, y:cy, w:d.w, h:d.h, r:this.m_properties.m_vradius}));
	} 
	
	addVertexAtRandomClientPos(label) { 
		return super.addCGraphVertexWithLabel(new CVertexData(this.getCVertexDataParams()),label);
	} 
	
	removeVertex(vindex) { 
		super.removeVertex(vindex); 
	} 
	
	addMultiEdge(vindex1, vindex2, cedgedata) { 
		return  super.addMultiCGraphEdge(vindex1, vindex2, cedgedata);
	} 

	removeMultiEdge(vindex1, vindex2) { super.removeMultiEdge(vindex1, vindex2); }

	addNewEdgeAtXY(x,y) {
		let v = this.getOnMouseDownVertex();
		if(!v || !v.getData())
			return;
		v = v.getData();
		this.m_cnewedgeline.setStartPos(v.m_x,v.m_y);
		this.m_cnewedgeline.setEndPos(x,y);
	} // end addNewEdgeAtXY()
	
	adjustNewVertexSize(x,y) {
		let v = this.m_selectedvertex;
		if(!v || !v.getData())
			return;
		v = v.getData();
		
		console.log("distOfPoints(v.m_x, v.m_y, x, y) = " + distOfPoints(v.m_x, v.m_y, x, y))
		v.setRadius(distOfPoints(v.m_x, v.m_y, x, y))
		console.log("v.getRadius()= " + v.getRadius());

		//this.m_cnewvertexsize.setPos(v.m_x, v.m_y);
		//this.m_cnewvertexsize.setRadius(Math.abs(x-v.m_x), Math.abs(y-v.m_y));
	}

	///////////////////////
	// selection
	
	//getSelectedVertex() { return this.m_selectedvertex; }
	getOnMouseDownVertex() { return this.m_onmousedownvertex; }

	enableMouseDown(x,y) {
		this.enableSelectedVertex(x,y);
		//this.enableSelectedEdge(x,y);
	} // end enableSelection()

	enableSelectedVertex(x,y) {
		if(this.m_selectedvertex) {
			this.m_selectedvertex.setSelected(false);
			this.m_selectedvertex = null;
		}

		let coldata = this.collidePoint2CGraphVertex(x,y);
		this.m_selectedvertex = this.m_onmousedownvertex = (coldata) ? coldata.cgraphvertex : null;
		this.m_mousedown_coldata = coldata;
		this.m_bmousedown = true;
		if(this.m_selectedvertex)
			this.m_selectedvertex.setSelected(true);
	}

	enableSelectedEdge(x,y) {
		if(this.m_selectededge) {
			this.m_selectededge.setSelected(false);
			this.m_selectededge = null;
		}

		let coldata = this.collidePoint2CGraphVertex(x,y);
		this.m_selectededge = this.m_onmousedownedge = (coldata) ? coldata.m_selectededge : null;
		this.m_mousedown_coldata = coldata;
		this.m_bmousedown = true;
		if(this.m_selectededge)
			this.m_selectededge.setSelected(true);
	}

	disableMouseUp() {
		this.m_onmousedownvertex = null;
		this.m_bmousedown = false;
		this.m_mousedown_coldata = null;
	} // end disableSelection()

	//////////////////
	// drawing
	draw() { 
		this.drawGraph();
		this.m_numdrawcalls = 0;
	}

	drawAnimationFrame() { 
		if(this.m_numdrawcalls === 0)
			requestAnimationFrame(this.draw);
		this.m_numdrawcalls++;
	}

	drawNewEdge() {
		if(this.m_bmousedown && this.getOnMouseDownVertex()&& !this.isVertexResizing())
			this.m_cnewedgeline.draw(this.m_cgraphics);
	} // end drawNewEdge()

	drawNewVertexSize() {
		//if(this.m_bmousedown && this.getOnMouseDownVertex())
		this.m_cnewvertexsize.draw(this.m_cgraphics);
	}
	
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
		if(vertices) {
			let i=0;
			for(let v in vertices) {
				vertices[v].setDrawIndex(i++);
				vertices[v].draw(this.m_cgraphics);
			}
		} // end if
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
			let coldata = cgraphvertex.collide(x,y);
			if(coldata) {
				coldata.cgraphvertex = cgraphvertex
				return coldata;
			}
		} // end for
		return null;
	} // end collidePoint2CGraphVertex()
	
	collidePoint2CGraphEdge(x,y) {
		let edges = this.getEdges();
		if(edges == null)
			return null;
	//	console.log("go through all the edges")
		for(let v1 in edges) {
			for(let v2 in edges[v1]) {
				let cgraphedge = edges[v1][v2]; 
				if(cgraphedge.isMultiEdge())
					continue;
				let edata = cgraphedge.getData();
				let vdata1 = cgraphedge.getCGraphVertex1().getData();
				let vdata2 = cgraphedge.getCGraphVertex2().getData();
				if(collidePoint2LineSegment(x, y, vdata1.m_x, vdata1.m_y, vdata2.m_x, vdata2.m_y, edata.getWidth()))
					return cgraphedge;
			} // end for
		} // end for
		return null;
	} // end collidePoint2CGraphEdge()

	getCVertexDataParams() {
		let d = this.m_cgraphics.getWH();
		let r = this.m_properties.m_vradius;
		return {
			r: r, 
			w: d.w,
			h: d.h,
			x: getRandomNumber(r, d.w-r),
			y: getRandomNumber(r, d.h-r)
		}
	} // end getCVertexDataParams()

	getCEdgeDataParams() {
		return {
			w: this.m_ewidth, 
			c: "#ff0000",
			label: ""
		}
	}

	////////////////////////////
	// event handlers methods
	
	initEventHandlers() {
		this.m_cgraphics.setOnResize(this.handleResize.bind(this));
		this.m_canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
		this.m_canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
		this.m_canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.m_canvas.addEventListener("contextmenu", this.handleContextMenu.bind(this));
		handleCGraphicsGraphUpdate(this.handleUpdate.bind(this));
	} // end initEventHandlers()

	handleResize(ow,oh,nw,nh) {
		this.repositionVertices(ow, oh, nw, nh); 
		this.drawAnimationFrame();
	}
	
	handleMouseDown(e) {
		if(e.which === 3)
			return;
		let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
		this.enableMouseDown(p.x,p.y);
	} // end handleMouseDown()
	
	handleMouseUp(e) {
		if(e.which === 3)
			return;
		if(this.m_bmousedown === false)
			return;
		let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
		let cgraphvertex_start = this.getOnMouseDownVertex();
		let coldata = this.collidePoint2CGraphVertex(p.x,p.y);
		let cgraphvertex_end = (coldata) ? coldata.cgraphvertex : null;
		
		// create new vertex at pos
		
		let bColAtEdge = (this.m_mousedown_coldata && this.m_mousedown_coldata.dist < 3 && this.m_mousedown_coldata.dist > 0);
		console.log("on mousedown: ", this.m_mousedown_coldata)
		
		if(bColAtEdge){}
		else if(!cgraphvertex_start && !cgraphvertex_end) {
			this.addVertexAtClientPos(p.x,p.y);
			//this.triggerUpdate();
		}

		// move vertex to new position
		else if(cgraphvertex_start && !cgraphvertex_end) {
			if(cgraphvertex_start.collide(p.x,p.y))
				cgraphvertex_start.getData().setPos(p.x,p.y);
			//this.triggerUpdate();
		}

		// add an edge at new vertex
		else if(cgraphvertex_start && cgraphvertex_end && cgraphvertex_start !== cgraphvertex_end) {
			this.addMultiEdge(cgraphvertex_start.getIndex(), cgraphvertex_end.getIndex(), new CEdgeData());
			//this.triggerUpdate();
		}

		this.triggerUpdate();
		this.disableMouseUp();
		this.drawAnimationFrame();
	} // end handleMouseUp()
	
	isVertexResizing() {
		return (this.m_bmousedown && this.m_mousedown_coldata && this.m_mousedown_coldata.dist < 3 && this.m_mousedown_coldata.dist > 0);
	}

	handleMouseMove(e) {
		if(e.which === 3)
			return;
		let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
		let coldata = (this.m_selectedvertex) ? this.m_selectedvertex.collide(p.x, p.y) : null;
		this.handleCursorChange(coldata);

		let bColAtEdge = (this.m_mousedown_coldata && this.m_mousedown_coldata.dist < 3 && this.m_mousedown_coldata.dist > 0)
		if(this.m_bmousedown) {
			let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
			if(!bColAtEdge)
				this.addNewEdgeAtXY(p.x,p.y);
			else
				this.adjustNewVertexSize(p.x,p.y)
			this.drawAnimationFrame();
		} // end if
	} // end handleMouseMove()
	
	handleCursorChange(coldata) {
		if(!coldata) {
			this.m_cgraphics.setCursor("default");	
			return false;
		} // end if
		 
		let dx = coldata.dir.x;
		let dy = coldata.dir.y;
		let dist = coldata.dist;
		if(dist < 3 && dist > 0) {
			if((dx > 0 && dy > 0) || (dx < 0 && dy < 0))
				this.m_cgraphics.setCursor("se-resize");
			else this.m_cgraphics.setCursor("ne-resize");
			return true;
		}
		this.m_cgraphics.setCursor("all-scroll"); 
		return false;
	} // end handleCursorChange()

	handleContextMenu(e) {
		console.log("down3")
		e.preventDefault();
		let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
		let coldata = this.collidePoint2CGraphVertex(p.x,p.y);
		let cgraphvertex = (coldata) ? coldata.cgraphvertex : null;
		
		let cgraphedge = null;

		if(cgraphvertex)
			this.removeVertex(cgraphvertex.getIndex());
		else {
			cgraphedge = this.collidePoint2CGraphEdge(p.x,p.y);
			if(cgraphedge)
				this.removeMultiEdge(cgraphedge.getVertexIndex1(), cgraphedge.getVertexIndex2());
		}

		if(cgraphvertex || cgraphedge) {  
			this.triggerUpdate();
			this.drawAnimationFrame();
		}
	} // end handleContextMenu()

	
	handleUpdate(cgraphicsgraph) {
		this.saveToLocalStorage2();
		this.drawAnimationFrame();
	}


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
		this.triggerUpdate();
	} // end repositionVertices()

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

	restoreVertexPositions() {
		let vertices = this.getVertices();
		let d = this.m_cgraphics.getWH();
		if(vertices == null)
			return;
		for(let v in vertices) {
			let vdata = vertices[v].getData();
			vdata.restorePos(d.w,d.h);
		} // end for
		this.triggerUpdate();
		this.drawAnimationFrame();
	}

	saveVertexPositions() {
		let vertices = this.getVertices();
		let d = this.m_cgraphics.getWH();
		if(vertices == null)
			return;
		for(let v in vertices) {
			let vdata = vertices[v].getData();
			vdata.savePos(d.w,d.h);
		} // end for
		this.triggerUpdate();
		this.drawAnimationFrame();
	}

	saveScreenshot() { this.m_cgraphics.saveScreenshot(); }

	triggerUpdate() { triggerEvent("cgraphicsgraph.update", this); }
	
	triggerLoad() { triggerEvent("cgraphicsgraph.load", this); }	

	saveToLocalStorage2() {
		if(!this.m_bstoregraph) {
			localStorage.removeItem("CGraphicsGraph");
			return;
		}
		this.m_properties.m_vdata = this.getAllVerticesAndData();
		this.m_properties.m_edata = this.getAllEdgesAndData();
		localStorage.setItem("CGraphicsGraph", JSON.stringify(this.m_properties));
	}

	loadFromLocalStorage() {
		if(!this.m_bstoregraph) {
			localStorage.removeItem("CGraphicsGraph");
			return;
		}
		let properties = localStorage.getItem("CGraphicsGraph");
		if(properties === "")
			return;
		properties = JSON.parse(properties);
		if(!properties)
			return;

		if(!properties.m_version || this.m_version > properties.m_version) {
			localStorage.removeItem("CGraphicsGraph");
			this.m_properties = null;
			return;
		}
		else if(properties.m_vdata)
			this.loadFromGraphData(properties.m_vdata, properties.m_edata);
		
		this.m_properties = properties;
		return;
	}

	//////////////////////////////////////////
	// adding and removing vertices and edges
	loadFromGraphData(vdata, edata) {
		if(!vdata)
			return false;
		if(!vdata[0].length === 0)	// no vertices
			return false;
		let vertices = vdata[0];	// vertex labels 
		let vertices_data = vdata[1];	// vertex data per label
		for(let i=0; i<vertices.length; i++) {
			let cvertexdata = new CVertexData();
			if(!vertices_data || !vertices_data[i])
				cvertexdata.initParams(this.getCVertexDataParams());
			else cvertexdata.loadParams(vertices_data[i]);
			super.addCGraphVertexWithLabel(cvertexdata, vertices[i]);
		} // end for
		if(!edata)
			return false;
		let edges = edata[0];
		let edges_data = edata[1];
		for(let i=0; i<edges.length; i++) {
			let cedgedata = new CEdgeData();
			if(!edges_data || !edges_data[i])
				cedgedata.initParams(this.getCEdgeDataParams());
			else cedgedata.loadParams(edges_data[i])
			this.addMultiEdge(edges[i][0], edges[i][1], cedgedata);
		} // end for
		this.computeVertexProfiles();
		this.triggerLoad();
		this.triggerUpdate();
		return true;
	} // end load()


	///////////////////////////////////////////////////////////
	// more stuff

	
	initDefaults2() {
		this.setProperties({
			m_bshowgrid:false,
			m_ngridrows:3,
			m_ngridcols:3,
			m_gridpadding:20,
			m_bsquared:true,
			m_gridwidth:1,
			m_gridheight:1,
			m_gridcolor:"#5e5e5e"
		});
	}
	
	getGridCellPosFromPos(p) {		
		let gridsize = parseInt(this.m_properties.m_ngridrows) + 1;
		return this.m_cgraphics.getGridRowColPosFromPos(p.x, p.y, gridsize, gridsize, this.m_properties.m_gridpadding, true, this.m_properties.m_bsquared);
	}

	toggleGridLayout() {
		this.m_properties.m_bshowgrid = !this.m_properties.m_bshowgrid;
		this.drawAnimationFrame();
		return this.m_properties.m_bshowgrid;
	}

	getGridRowColPos(irow, icol, bcenter) {
		let gridsize = parseInt(this.m_properties.m_ngridrows) + 1;
		return this.m_cgraphics.getGridRowColPos(irow, icol, gridsize, gridsize, 
			this.m_properties.m_gridpadding, bcenter);
	}

	getGridCellPos(i, bcenter) {
		let icol = i%this.m_ngridcols;
		let irow = Math.floor(i/this.properties.m_ngridcols);
		return this.getGridRowColPos(irow, icol, bcenter);
	}

	layoutVerticesInGrid() {
		let vertices = this.getVertices();
		if(vertices == null)
			return;
		let indices = this.getVertexIndices();
		for(var i=0; i<indices.length; i++) {
			let pos = this.getGridCellPos(i,true); 
			if(pos) {
				let vd = vertices[indices[i]].getData();
				vd.setPos(pos.x, pos.y);
			}
		}
	}

	drawGrid() {
		let gridsize = parseInt(this.m_properties.m_ngridrows) + 1
		if(this.m_properties.m_bshowgrid && gridsize > 0) {
			this.m_cgraphics.drawGrid(
				gridsize,
				gridsize,
				this.m_properties.m_gridwidth, 
				this.m_properties.m_gridcolor, 
				this.m_properties.m_gridpadding,
				this.m_properties.m_bsquared
			);
		}
	}

	drawGraph() {
		this.m_cgraphics.clear(this.m_properties.m_bgcolor, 0.0);
		this.drawNewVertexSize();
		this.drawNewEdge();
		this.drawEdges();
		this.drawGrid();
		this.drawVertices();
	} // end drawGraph()
	
	layoutVerticesInCircle() {
		let d = this.m_cgraphics.getWH();
		let vertices = this.getVertices();
		if(vertices == null)
			return;
		let indices = this.getVertexIndices();
		if(indices == null)
			return;
		let cx = d.w * 0.5;
		let cy = d.h * 0.5;
		let rx = cx * 0.8;
		let ry = cy * 0.8;
		let nsteps = indices.length;
		let invnsteps = 1/nsteps;		
		for(let i=0; i<nsteps; i++) {
			let theta = 2*Math.PI*(i*invnsteps);
			let v = indices[i];
			let data = vertices[v].getData();
			let x = cx + (rx * Math.cos(theta));
			let y = cy + (ry * Math.sin(theta));
			data.setPos(x,y);
		} // end for
		this.drawAnimationFrame();
	} // end layoutVerticesInCircle()

	clearAll() {
		this.clear();
		this.drawAnimationFrame();
	}
	
	computeVertexProfiles() {
		let vertices = this.getVertices();
		if(vertices)
			for(let v in vertices)
				vertices[v].computeProfile();
	} 

	getProfileSequences(seqindex) {
		let vertices = this.getVertices();
		let profile = [];
		if(vertices)
			for(let v in vertices)
				profile.push(vertices[v].getProfile(seqindex));
	//	console.log(profile);
		return profile;
	}

	layoutVerticesInGrid() {
		let vertices = this.getVertices();
		if(vertices == null)
			return;
		let indices = this.getVertexIndices();
		for(var i=0; i<indices.length; i++) {
			let pos = this.getGridCellPos(i,true); 
			if(pos) {
				let vd = vertices[indices[i]].getData();
				vd.setPos(pos.x, pos.y);
			}
		}
	}
	
	
	handleMouseUp(e) {
		if(e.which === 3)
			return;
		if(this.m_bMousedown === false)
			return;
		let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
		let cgraphvertex_start = this.getOnMouseDownVertex();
		//let cgraphvertex_end = this.collidePoint2CGraphVertex(p.x,p.y);
		let coldata = this.collidePoint2CGraphVertex(p.x,p.y);
		let cgraphvertex_end = (coldata) ? coldata.cgraphvertex : null;
		
		let bColAtEdge = (this.m_mousedown_coldata && this.m_mousedown_coldata.dist < 3 && this.m_mousedown_coldata.dist > 0);
		console.log("on mousedown: ", this.m_mousedown_coldata)
		
		if(bColAtEdge){
		//	alert("collide at edge")
		}

		else if(!cgraphvertex_start && !cgraphvertex_end) {
			if(this.m_properties.m_bshowgrid)
				p = this.getGridCellPosFromPos(p);
			this.addVertexAtClientPos(p.x,p.y);
			this.triggerUpdate();
		}
		else if(cgraphvertex_start && !cgraphvertex_end) {
			if(this.m_properties.m_bshowgrid)
				p = this.getGridCellPosFromPos(p);
			cgraphvertex_start.getData().setPos(p.x,p.y);
			this.triggerUpdate();
		}
		else if(cgraphvertex_start && cgraphvertex_end && cgraphvertex_start !== cgraphvertex_end) {
			this.addMultiEdge(cgraphvertex_start.getIndex(), cgraphvertex_end.getIndex(), new CEdgeData());
			this.triggerUpdate();
		}
		this.disableMouseUp();
		this.drawAnimationFrame();
	} // end handleMouseUp()



} // end CGraphicsGraph

export function handleCGraphicsGraphUpdate(fnhandler) {
	handleEvent("cgraphicsgraph.update", fnhandler);
}

export function handleCGraphicsGraphLoad(fnhandler) {
	handleEvent("cgraphicsgraph.load", fnhandler);
}

export const CGraphicsGraphInstance = CGraphicsGraph.m_instance;
