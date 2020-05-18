class CGraphEdge {
	constructor(cgraph, vindex1, vindex2, data) { 
		this.init(cgraph, vindex1, vindex2, data); 
	}
	init(cgraph, vindex1, vindex2, data) {
		this.m_cgraph = cgraph;
		this.m_vindex1 = vindex1; 
		this.m_vindex2 = vindex2; 
		this.m_data = data;	
		this.m_bmultiedge = false;
	} // end init()
	getVertexIndex1() { return this.m_vindex1; }
	getVertexIndex2() { return this.m_vindex2; } 
	getData() { return this.m_data; }
	setData(data) { return this.m_data = data; }
	getCGraphVertex1() { return this.m_cgraph.getVertexData(this.m_vindex1); }
	getCGraphVertex2() { return this.m_cgraph.getVertexData(this.m_vindex2); } 
	getCGraph() { return this.m_cgraph; }
	toString() { return "(" + this.m_vindex1 + "," + this.m_vindex2 + ")=>" + this.getData().toString(); }
	setMultiEdge(bmultiedge)  {this.m_bmultiedge = bmultiedge; }
	isMultiEdge() { return this.m_bmultiedge; }
} // end CGraphEdge

export default CGraphEdge;
