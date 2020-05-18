import CGraphicsGraph, { handleCGraphicsGraphUpdate } from "./cgraphicsgraph";
import CGraphics from "../cgraphics/cgraphics";

const prevInit = CGraphicsGraph.prototype.init;
CGraphicsGraph.prototype.init = function(elecanvas) {
	prevInit.call(this, elecanvas);
	this.m_bshowgrid = false;
	this.m_ngridrows = 3;
	this.m_ngridcols = 3;
	this.m_gridpadding = 20;
	this.m_gridwidth = 1;
	this.m_gridheight = 1;
	this.m_gridcolor = "#5e5e5e";
}

CGraphicsGraph.prototype.setGridRows = function(rows) { 
	this.m_ngridrows = rows; 
	this.drawAnimationFrame();
}
CGraphicsGraph.prototype.setGridColumns = function(cols) { 
	this.m_ngridcols = cols; 
	this.drawAnimationFrame();
}

CGraphicsGraph.prototype.getGridCellPosFromPos = function(p) {		
	return this.m_cgraphics.getGridRowColPosFromPos(p.x, p.y, 
		this.m_ngridrows, this.m_ngridcols, this.m_gridpadding, true);
}

CGraphicsGraph.prototype.toggleGridLayout = function() {
	this.m_bshowgrid = !this.m_bshowgrid;
	this.drawAnimationFrame();
	return this.m_bshowgrid;
}

CGraphicsGraph.prototype.getGridRowColPos = function(irow, icol, bcenter) {
	return this.m_cgraphics.getGridRowColPos(irow, icol, this.m_ngridrows, this.m_ngridcols, 
		this.m_gridpadding, bcenter);
}

CGraphicsGraph.prototype.getGridCellPos = function(i, bcenter) {
	let icol = i%this.m_ngridcols;
	let irow = Math.floor(i/this.m_ngridcols);
	return this.getGridRowColPos(irow, icol, bcenter);
}

CGraphicsGraph.prototype.layoutVerticesInGrid = function() {
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

CGraphicsGraph.prototype.drawGraph = function() {
	this.m_cgraphics.clear(this.m_bgcolor, 0.0);
	this.drawNewEdge();
	this.drawEdges();
	if(this.m_bshowgrid) {
		this.m_cgraphics.drawGrid(this.m_ngridrows, this.m_ngridcols, 
			this.m_gridwidth, this.m_gridcolor, this.m_gridpadding);
	}
	this.drawVertices();
} // end drawGraph()

CGraphics.prototype.drawGrid = function(rows, cols, w, color, padding) { 
	//this.drawGridBorder(rows, cols, w, color, padding); 
	this.drawGridPoints(rows, cols, w, color, padding); 
}


CGraphicsGraph.prototype.updateVertices = function(vertices) {
	let nvertices={};
	let bupdate = false;
	for(let i=0; i < vertices.length; i++)
		nvertices[vertices[i]]=vertices[i];
	let overtices = this.getVertices()		
	for(let v in overtices) {
		if(!nvertices[v]) {
			this.removeVertex(v);
			bupdate = true;
		}
	}
	for(let vert in nvertices) {
		let v = vert.trim();
		if(v !== "" && v !== null)
		if(!overtices[v+""]) {
			this.addVertexAtRandomClientPos(v);
			bupdate = true;		
		} // end for
	}
	return bupdate;
} // end updateVertices()


CGraphicsGraph.prototype.getSequences = function() {
	let vertices = this.getVertices();
	if(!vertices)
		return null;
	
	let long_sequences = {};
	let short_sequences = {};
	for(let v in vertices) {
		let profiles = vertices[v].getProfiles();
		for(let p=0; p<profiles.length; p++) {
			let deg = vertices[v].m_profiles[p];
			if(!short_sequences[p]) 
				short_sequences[p] = {}
			if(!short_sequences[p][deg])
				short_sequences[p][deg]=0;
			if(!long_sequences[p])
				long_sequences[p] = [];
			long_sequences[p].push(deg);
			short_sequences[p][deg]++;
		} // end for
	} // end for

	return {long:long_sequences,short:short_sequences};
} // end getDegreeSequence()

CGraphicsGraph.prototype.saveToLocalStorage = function() {
	let vd = this.getAllVerticesAndData();
	let ed = this.getAllEdgesAndData();
	let graphdata = JSON.stringify({
		vertices: vd[0],
		vertices_data: vd[1], 
		edges: ed[0], 
		edges_data: ed[1]
	}); // end strdata()
	localStorage.setItem("graphdata", graphdata)
}

CGraphicsGraph.prototype.loadFromLocalStorage = function() {
	let graphdata = JSON.parse(localStorage.getItem("graphdata"));
	this.load(graphdata);      
	setTimeout(()=>{
		this.triggerUpdate();
		this.drawAnimationFrame();
	},1000)
	return;
}

CGraphicsGraph.prototype.haveEdge = function(v1,v2,edges) {
	return (edges[v1] && edges[v1][v2]) || (edges[v2] && edges[v2][v1]);
} // end haveEdge()

CGraphicsGraph.prototype.updateEdges = function(nedges) {
	if(!nedges) {
		this.removeAllEdges();
		return true;
	} // end if
	let oedges = this.getEdges();
	let bupdate = false;
	for(let v1 in oedges)
		for(let v2 in oedges[v1])
			if(!this.haveEdge(v1,v2,nedges)) {
				this.removeEdge(v1,v2);
				bupdate = true;
			}
	for(let v1 in nedges)
		for(let v2 in nedges[v1])
			if(!this.haveEdge(v1,v2,oedges)) {
				this.addMultiEdge(v1,v2);
				bupdate = true;
			}
	return bupdate;
} // end updateEdges()

CGraphicsGraph.prototype.parseEdges = function(value) {
	let pairs = value.trim();
	let nedges = null;
	if(pairs !== "") {
		pairs = pairs.split("\n");
		nedges = {};
		for(let i=0; i<pairs.length; i++) {
			let pair = pairs[i].split(" ");
			if(!pair || pair.length < 2)
				continue;
			let v1 = pair[0];
			let v2 = pair[1];
			if(!nedges[v1])
				nedges[v1] = {};
			if(!nedges[v2])
				nedges[v2] = {}
			nedges[v1][v2] = true;
		} // end for
	} // end if
	return nedges;
}

CGraphics.prototype.drawGridBorder = function(rows, cols, w, color, padding) {
	if(rows <= 0 || cols <= 0)
		return;
	let d = this.getWH();
	d.w -= padding*2;
	d.h -= padding*2;
	const x1 = padding;
	const y1 = padding;
	const x2 = x1 + d.w;
	const y2 = y1 + d.h;
	this.m_graphics.setLineDash([5, 3]);
	this.drawLine(x1,y1,x2,y1,w,color); // top side
	this.drawLine(x1,y2,x2,y2,w,color); // bottom side
	this.drawLine(x1,y1,x1,y2,w,color); // left side
	this.drawLine(x2,y1,x2,y2,w,color); // right side
	cols = d.w / cols;
	rows = d.h / rows;
	for(let x=cols+x1; x<d.w; x+=cols)
		this.drawLine(x,y1,x,y2,w,color);
	for(let y=rows+y1; y<d.h; y+=rows)
		this.drawLine(x1,y,x2,y,w,color);
	this.m_graphics.setLineDash([]);
	return;
}


CGraphics.prototype.drawGridPoints = function(rows, cols, w, color, padding) {
	if(rows <= 0 || cols <= 0)
		return;
	let d = this.getWH();
	d.w -= padding*2;
	d.h -= padding*2;
	const x1 = padding;
	const y1 = padding;
	const x2 = x1 + d.w;
	const y2 = y1 + d.h;
	this.m_graphics.setLineDash([5, 3]);
	this.drawLine(x1,y1,x2,y1,w,color); // top side
	this.drawLine(x1,y2,x2,y2,w,color); // bottom side
	this.drawLine(x1,y1,x1,y2,w,color); // left side
	this.drawLine(x2,y1,x2,y2,w,color); // right side
	this.m_graphics.setLineDash([]);
	cols = d.w / cols;
	rows = d.h / rows;
	for(let x=x1+cols*0.5; x<d.w; x+=cols)
		for(let y=y1+rows*0.5; y<d.h; y+=rows)
			this.drawCircle(x,y,5,color,color);	
	return;
}

CGraphics.prototype.getGridRowColFromPos = function(x, y, nrows, ncols, padding) {
	if(nrows <= 0 || ncols <= 0)
		return null;
	let d = this.getWH();
	x -= padding;
	y -= padding;
	d.w -= padding * 2;
	d.h -= padding * 2;
	let w = Math.floor(d.w / ncols);
	let h = Math.floor(d.h / nrows);
	return { row: Math.floor(x/w), col: Math.floor(y/h) }; 
}

CGraphics.prototype.getGridRowColPosFromPos = function(x, y, nrows, ncols, padding, bcenter) {
	if(nrows <= 0 || ncols <= 0)
	return null;
	let d = this.getWH();
	x -= padding;
	y -= padding;
	d.w -= padding * 2;
	d.h -= padding * 2;
	let w = Math.floor(d.w / ncols);
	let h = Math.floor(d.h / nrows);
	let icol = Math.floor(x / w);
	let irow = Math.floor(y / h); 
	x = padding + (icol * w);
	y = padding + (irow * h);
	if(bcenter) {
		x += w*0.5;
		y += h*0.5;
	}
	return {x:x,y:y};
}

CGraphics.prototype.getGridRowColPos = function(irow, icol, nrows, ncols, padding, bcenter) {
	if(nrows <= 0 || ncols <= 0 || irow < 0 || icol < 0)
		return null;
	let d = this.getWH();
	let x = padding;
	let y = padding;
	d.w -= padding * 2;
	d.h -= padding * 2;
	let w = Math.floor(d.w / ncols);
	let h = Math.floor(d.h / nrows);
	x += (icol * w);
	y += (irow * h);
	if(bcenter) {
		x += w*0.5;
		y += h*0.5;
	}
	return {x:x,y:y};
}


CGraphicsGraph.prototype.handleMouseUp = function(e) {
	if(this.m_bMouseDown === false)
		return;
	let p = this.m_cgraphics.getXYFromClientXY(e.clientX,e.clientY);
	let cgraphvertex_start = this.getSelectedVertex();
	let cgraphvertex_end = this.collidePoint2CGraphVertex(p.x,p.y);
	if(!cgraphvertex_start && !cgraphvertex_end) {
		if(this.m_bshowgrid)
			p = this.getGridCellPosFromPos(p);
		this.addVertexAtClientPos(p.x,p.y);
		this.triggerUpdate();
	}
	else if(cgraphvertex_start && !cgraphvertex_end) {
		if(this.m_bshowgrid)
			p = this.getGridCellPosFromPos(p);
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

CGraphicsGraph.prototype.layoutVerticesInCircle = function() {
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

CGraphicsGraph.prototype.clearAll = function() {
	this.clear();
	this.drawAnimationFrame();
}

CGraphicsGraph.prototype.computeVertexProfiles = function() {
	let vertices = this.getVertices();
	if(vertices)
		for(let v in vertices)
			vertices[v].computeProfile();
} 

/*
CGraphicsGraph.prototype.toStringVertices = function(delimiter) {
    let str = [];
    for(let i=0; i<vindices.length; i++) {
        //if(window.m_cgraphicsgraph.m_bshowvabc)
        //    str.push(window._n2l[vindices[i]]);
        //else 
        str.push(vindices[i]);
    } // end for
    return str.join(delimiter);
}*/


handleCGraphicsGraphUpdate (function(cgraph) { cgraph.computeVertexProfiles();});