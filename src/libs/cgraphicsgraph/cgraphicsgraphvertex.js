import CGraphVertex from "../cgraph/cgraphvertex";

// constants
CGraphVertex.prototype.DEG = 0;
CGraphVertex.prototype.IMIN = 1;
CGraphVertex.prototype.EMIN = 2;
CGraphVertex.prototype.IMAX = 3;
CGraphVertex.prototype.EMAX = 4;

// functions to attach to the CGraphVertex objects
CGraphVertex.prototype.draw = function(cgraphics) {
	var label = [];
	var data = this.getData();
	var i = this.getIndex();

	// determine the label type
	if(this.m_cgraph.m_vlabeltype === "letters") 
		label.push(window._n2l[i]); // convert the index to a letter
	else if(this.m_cgraph.m_vlabeltype === "numbers") 
		label.push(i); // just use the index
	
	if(this.m_cgraph.m_vprofiletype > -1 && this.m_profiles) 
		label.push("" + this.m_profiles[this.m_cgraph.m_vprofiletype]);
	
	console.log(this.m_cgraph.m_vprofiletype);

	// set the label 
	data.setLabel(label.join("-"));
	
	// draw the node
	data.draw(cgraphics);
} // end draw()

// computes the profile of the vertex 
CGraphVertex.prototype.computeProfile = function() { 
	var edges = this.getEdges();
	var deg1 =  (edges == null) ? 0 : this.getIndices().length;
	var imin = deg1;
	var imax = deg1;
	var emax = 0;
	var emin = (deg1 <= 0) ? 0 : this.m_cgraph.getNumOfVerticesCreated();
	if(edges && deg1 > 0) {
		for(var vindex in edges) {
			var cgraphvertex = this.m_cgraph.getCGraphVertex(vindex);
			var deg2 = cgraphvertex.getDegree();
			if(deg2<imin) imin = deg2;
			if(deg2<emin) emin = deg2;
			if(deg2>imax) imax = deg2;
			if(deg2>emax) emax = deg2;
		} // end for
	} // end if
	this.m_profiles = [];
	this.m_profiles.push(deg1);
	this.m_profiles.push(imin);
	this.m_profiles.push(emin);
	this.m_profiles.push(imax);
	this.m_profiles.push(emax);
	return;
}

CGraphVertex.prototype.getProfiles = function() { return this.m_profiles; }

CGraphVertex.prototype.getProfile = function(i) { return this.m_profiles[i]; }
