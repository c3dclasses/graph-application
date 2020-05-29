import CGraphVertex from "../cgraph/cgraphvertex";
import { median } from "../utility/utility";

// constants
CGraphVertex.prototype.DEG = 0;
CGraphVertex.prototype.IMIN = 1;
CGraphVertex.prototype.EMIN = 2;
CGraphVertex.prototype.IMAX = 3;
CGraphVertex.prototype.EMAX = 4;

// functions to attach to the CGraphVertex objects
CGraphVertex.prototype.draw = function(cgraphics) {
	let label = [];
	let data = this.getData();
	let i = this.getIndex();

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
	let edges = this.getEdges();
	let deg1 =  (edges == null) ? 0 : this.getIndices().length;
	let imin = deg1;
	let imax = deg1;
	let emax = 0;
	let emin = (deg1 <= 0) ? 0 : this.m_cgraph.getNumOfVerticesCreated();
	let esum = 0;
	let isum = deg1;
	let freq = {};
	if(edges && deg1 > 0) {
		for(let vindex in edges) {
			let cgraphvertex = this.m_cgraph.getCGraphVertex(vindex);
			let deg2 = cgraphvertex.getDegree();
			esum += deg2;
			esum += deg2;
			if(!freq && !freq[deg2]) freq[deg2] = 1;
			else freq[deg2]++;
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
	this.m_profiles.push(isum);
	this.m_profiles.push(esum);
	console.log((deg1>0) ? (isum/(deg1+1)):0);
	console.log((deg1>0) ? (esum/(deg1+1)):0);
	
	this.m_profiles.push((deg1>0) ? (isum/(deg1+1)) : 0);
	this.m_profiles.push((deg1>0) ? (esum/deg1) : 0);

	let efre = -1;
	for(let deg in freq) 
		if(freq[deg] >= efre)
			efre = freq[deg];
	
	let ediv = freq.length;
	let emed = median(Object.keys(freq));
	
	if(!freq || !freq[deg1]) freq[deg1]=1
	else freq[deg1]++;

	let imed = median(Object.keys(freq));
	let idiv = freq.length;
	let ifre = (freq[deg1] > efre) ? freq[deg1] : efre;

	this.m_profiles.push(efre);
	this.m_profiles.push(ifre);
	this.m_profiles.push(idiv);
	this.m_profiles.push(ediv);
	this.m_profiles.push(imed);
	this.m_profiles.push(emed);
	
	return;
}

CGraphVertex.prototype.getProfiles = function() { return this.m_profiles; }

CGraphVertex.prototype.getProfile = function(i) { return this.m_profiles[i]; }

export const ProfileSequences = [
	{m_name: "degree", m_shortname:"deg", m_long:"", m_short:"", m_bshow:true},
	{m_name: "inclusive-minimum", m_shortname:"imin", m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-minimum", m_shortname:"emin", m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-maximum", m_shortname:"imax", m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-maximum", m_shortname:"emax", m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-sum", m_shortname:"isum", m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-sum", m_shortname:"esum", m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-average", m_shortname:"iavg", m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-average", m_shortname:"eavg", m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-frequency", m_shortname:"ifre", m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-frequency", m_shortname:"efre", m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-diversity", m_shortname:"idiv", m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-diversity", m_shortname:"ediv", m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-median", m_shortname:"imed", m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-median", m_shortname:"emed", m_long:null, m_short:null, m_bshow:true}
];