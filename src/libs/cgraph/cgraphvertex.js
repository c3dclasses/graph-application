export default class CGraphVertex {
	constructor(cgraph, vindex, vdata) { 
		this.init(cgraph, vindex, vdata);
	}
	init(cgraph, vindex, vdata) {
		this.setCGraph(cgraph); 
		this.setIndex(vindex); 
		this.setData(vdata);
	} // end init()
	setIndex(index) { this.m_index = index; }
	getIndex() { return this.m_index; }
	getDegree() { var indices = this.getIndices(); return (!indices) ? 0 : indices.length; }
	getEdges() { return this.m_cgraph.getVertexEdges(this.m_index); }
	getIndices() { return Object.keys(this.getEdges()); }
	setData(data) { this.m_data = data; }
	getData() { return this.m_data; }
	setCGraph(cgraph) { this.m_cgraph = cgraph; }
	getCGraph() { return this.m_cgraph; }
} // end CGraphVertex