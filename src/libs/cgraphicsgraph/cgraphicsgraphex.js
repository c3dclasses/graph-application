import CGraphicsGraph, { handleCGraphicsGraphUpdate } from "./cgraphicsgraph";
import CGraphics from "../cgraphics/cgraphics";

/*
export default class CGraphicsGraphEx extends CGraphicsGraph {
	//static m_instance = CGraphicsGraphEx.m_instance || new CGraphicsGraphEx();

	initDefaults() {
		super.initDefaults();
		this.setProperties({
			m_bshowgrid:false,
			m_ngridrows:3,
			m_ngridcols:3,
			m_gridpadding:20,
			m_gridwidth:1,
			m_gridheight:1,
			m_gridcolor:"#5e5e5e"
		});
	}
	
	getGridCellPosFromPos(p) {		
		return this.m_cgraphics.getGridRowColPosFromPos(p.x, p.y, 
			this.m_properties.m_ngridrows, this.m_properties.m_ngridcols, this.m_properties.m_gridpadding, true);
	}

	toggleGridLayout() {
		this.m_properties.m_bshowgrid = !this.m_properties.m_bshowgrid;
		this.drawAnimationFrame();
		return this.m_properties.m_bshowgrid;
	}

	getGridRowColPos(irow, icol, bcenter) {
		return this.m_cgraphics.getGridRowColPos(irow, icol, this.m_properties.m_ngridrows, this.m_properties.m_ngridcols, 
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

	drawGraph() {
		this.m_cgraphics.clear(this.m_properties.m_bgcolor, 0.0);
		this.drawNewEdge();
		this.drawEdges();
		if(this.m_properties.m_bshowgrid) {
			this.m_cgraphics.drawGrid(this.m_properties.m_ngridrows, this.m_properties.m_ngridcols, 
				this.m_properties.m_gridwidth, this.m_properties.m_gridcolor, this.m_gridpadding);
		}
		this.drawVertices();
	} // end drawGraph()

	drawGrid(rows, cols, w, color, padding) { 
		//this.drawGridBorder(rows, cols, w, color, padding); 
		this.drawGridPoints(rows, cols, w, color, padding); 
	}

	drawGridPoints(rows, cols, w, color, padding) {
		if(rows <= 0 || cols <= 0)
			return;
		console.log(rows, cols);
		w = 3;
		color = "black";
		padding = 0;
		console.log("draw grid points")
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
		this.triggerUpdate();
	}
	
	computeVertexProfiles() {
		let vertices = this.getVertices();
		if(vertices)
			for(let v in vertices)
				vertices[v].computeProfile();
	} 
}

handleCGraphicsGraphUpdate (function(cgraph) { cgraph.computeVertexProfiles(); });
//CGraphicsGraphEx.m_instance = CGraphicsGraphEx.m_instance || new CGraphicsGraphEx();
//export const CGraphicsGraphInstance = CGraphicsGraphEx.m_instance;
*/