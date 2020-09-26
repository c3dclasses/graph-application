import CGraphEdge from "./cgraphedge";
import CGraphVertex from "./cgraphvertex";

class CGraph { 
	constructor() {
		this.clear()
	}
	
	clear() { 
		this.m_vertices = {};
		this.m_edges = {};
		this.m_vertexcounter = 0;
		this.m_egdecounter = 0;
		this.m_numvertices = 0; 
		this.m_numedges = 0;
		this.m_numedges = 0;
	}
	
	vertexExist(vindex) { 
		return (this.m_vertices != null && this.m_vertices[vindex] != null); 
	} 

	addVertex(vdata) { 
		return this.addVertexWithLabel(vdata, this.m_vertexcounter + ""); 
	}

	addVertexWithLabel(vdata, vlabel) { 
		if(vlabel === "") 
			return false;
		this.m_vertices[vlabel]= vdata;
		this.m_vertexcounter++;
		this.m_numvertices++;
		return true;		
	}

	addCGraphVertex(vdata) { 
		return this.addCGraphVertexWithLabel(vdata, this.m_vertexcounter + ""); 
	}

	addCGraphVertexWithLabel(vdata, vlabel) {
		var cgraphvertex = new CGraphVertex(this, vlabel, vdata);
		return (cgraphvertex && this.addVertexWithLabel(cgraphvertex, vlabel)) ? cgraphvertex : null;
	}
	
	removeVertex(vindex) { 
		if(!this.vertexExist(vindex))
			return false;
		var edges = this.getVertexEdges(vindex);
		for(let vindex2 in edges) {
			this.removeEdge(vindex, vindex2);
			this.removeEdge(vindex2, vindex);
		} // end for
		delete this.m_vertices[vindex];
		this.m_numvertices--;
		return true; 
	}

	getVertexData(vindex) { return this.m_vertices[vindex]; }

	getCGraphVertex(vindex) { return this.m_vertices[vindex]; }

	setVertexData(vindex, vdata) { this.m_vertices[vindex] = vdata; }

	getVertices() { return this.m_vertices; }
	
	getVertexIndices() { return Object.keys(this.m_vertices); }

	getAllVerticesAndData() { 
		let data = [];
		for(let v in this.m_vertices)
			data.push(this.m_vertices[v].getData());
		return [Object.keys(this.m_vertices), data]; 
	}

	getNumOfVerticesCreated() { return this.m_vertexcounter; }

	getNumOfVertices() { return this.m_numvertices; }

	edgeExist(vindex1, vindex2) { 
		return this.vertexExist(vindex1) && 
				this.vertexExist(vindex2) && 
				this.m_edges != null &&
				this.m_edges[vindex1] != null &&
				this.m_edges[vindex1][vindex2] != null; 
	}

	multiEdgeExist (vindex1, vindex2) { return this.edgeExist(vindex1,vindex2) && this.edgeExist(vindex2,vindex1); }
	
	getEdgeData(vindex1, vindex2) { return (!this.edgeExist(vindex1, vindex2)) ? null : this.m_edges[vindex1][vindex2]; }

	getCGraphEdge(vindex1, vindex2) { return this.getEdgeData(vindex1,vindex2); }
	
	getAllEdgesAndData() {
		var edges = [];
		var edgesdata = [];
		for(var v1 in this.m_edges)
			for(var v2 in this.m_edges[v1]) {
				edges.push([v1,v2]);
				edgesdata.push(this.getEdgeData(v1,v2).getData());
			} // end for
		return [edges, edgesdata];
	}
	
	setEdgeData(vindex1, vindex2, edata) { 
		if(!this.edgeExist(vindex1, vindex2))
			return false;
		this.m_edges[vindex1][vindex2] = edata;
		return true; 
	}

	addEdge(vindex1, vindex2, edata) { 
		if(this.edgeExist(vindex1, vindex2)) // edge already exists
			return false;
		if(!this.vertexExist(vindex1) || !this.vertexExist(vindex2))
			return false;
		if(!this.m_edges[vindex1])
			this.m_edges[vindex1] = {};
		if(!this.m_edges[vindex1][vindex2])
			this.m_edges[vindex1][vindex2] = edata;
		this.m_numedges++;
		return true;
	}

	addMultiEdge(vindex1, vindex2, edata) { 
		return this.addEdge(vindex1, vindex2, edata) && this.addEdge(vindex2, vindex1, edata);
	}

	addCGraphEdge(vindex1, vindex2, edata) {
		var cegraphedge = new CGraphEdge(this,vindex1,vindex2,edata);
		return (cegraphedge && this.addEdge(vindex1,vindex2,cegraphedge)) ? cegraphedge : null;
	}

	addMultiCGraphEdge(vindex1, vindex2, edata) {
		var cgraphedge1 = this.addCGraphEdge(vindex1, vindex2, edata)
		var cgraphedge2 = this.addCGraphEdge(vindex2, vindex1, edata);
		if(!cgraphedge1 || !cgraphedge2)
			return null;
		cgraphedge1.setMultiEdge(true);
		return [cgraphedge1,cgraphedge2]; 
	}

	addSelfEdge(vindex, edata) { 
		return this.addEdge(vindex, vindex, edata);
	}

	removeEdge(vindex1, vindex2) {
		if(!this.edgeExist(vindex1, vindex2)) // edge doesn't exists
			return false;
		delete this.m_edges[vindex1][vindex2];
		this.m_numedges--;
		return true;
	}

	removeAllEdges() {
		for(var v in this.m_edges)
			this.m_edges[v] = {};	
	}

	removeMultiEdge(vindex1, vindex2) {
		return this.removeEdge(vindex1, vindex2) && this.removeEdge(vindex2, vindex1);
	}
	
	removeSelfEdge(vindex) { return this.removeEdge(vindex, vindex); }
	
	getEdges() { return this.m_edges; }
	
	getNumOfEdgesCreated() { return this.m_egdecounter; }

	getNumOfEdges(bmultiedges=true) { return (bmultiedges) ? this.m_numedges : (this.m_numedges / 2); }

	getEdgeIndices() {
		var edges = this.getEdges();
		var edgeindices = [];
		for(var v1 in edges)
			for(var v2 in edges[v1])
				if(edges[v1][v2].m_bskip)
					edgeindices.push([v1,v2]);
		return edgeindices;
	}
	
	getVertexEdges(vindex) { return this.m_edges[vindex]; }
	
	removeVertexEdges(vindex) { delete this.m_edges[vindex]; }
	
	toString() { return ["V:",this.m_vertices,"\n","E:",this.m_edges,"\n"].join(""); }

	toStringVertices(delimiter) {
		let vertices = this.getVertices();
		let str = [];
		for(let v in vertices)
			str.push(v);
		return str.join(delimiter);
	}

	toStringEdges(delimiter1, delimiter2) {
		var edges = this.getEdges();
		var str = [];
		for(var v1 in edges)
			for(var v2 in edges[v1])
				if(edges[v1][v2].isMultiEdge())
					str.push([v1,v2].join(delimiter1));
	//	console.log(edges);
	//	console.log(str);
		return str.join(delimiter2);
	}
}

export default CGraph;