import CGraphVertex from "../cgraph/cgraphvertex";
import { 
	median, 
	collidePoint2Circle, 
} from "../utility/utility";
import { maxHeaderSize } from "http";

/*
// functions to attach to the CGraphVertex objects
CGraphVertex.profileDistribution = null;
CGraphVertex.getProfileDistribution = function() {
	return CGraphVertex.profileDistribution;
} // end profileDistribution()

CGraphVertex.resetProfileDistributionCount = function() {
	CGraphVertex.profileDistribution = {};
} // end resetProfileDistributionCount()

CGraphVertex.tallyProfileDistributionCount = function(profiletype, profilenum) {
	let pd = CGraphVertex.profileDistribution;
	if(!pd[profiletype])
		pd[profiletype] = {}
	if(!pd[profiletype][profilenum])
		pd[profiletype][profilenum] = 0
	pd[profiletype][profilenum] += 1
} // end tallyProfileDistributionCount()
*/


window.CGraphVertex = CGraphVertex;

CGraphVertex.prototype.collide = function(x, y) { return this.getData().collide(x,y); }

CGraphVertex.prototype.setSelected = function(bselected) { this.getData().setSelected(bselected); }

CGraphVertex.prototype.draw = function(cgraphics) {
	let label = [];
	let data = this.getData();
	let i = this.getIndex();
	let di = this.getDrawIndex();

	// determine the label type
	if(this.m_cgraph.m_properties.m_vlabeltype === "letters") 
		label.push(window._n2l[di]); // convert the index to a letter
	else if(this.m_cgraph.m_properties.m_vlabeltype === "numbers") 
		label.push(di); // just use the index
	
	if(this.m_cgraph.m_properties.m_vprofiletype && this.m_profiles) {
		for(let id in this.m_cgraph.m_properties.m_vprofiletype) {
			label.push("" + this.m_profiles[id]);
		}
	}
	
	// set the label 
	data.setLabel(label.join("-"));
	
	// draw the node
	data.draw(cgraphics);
} // end draw()

const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

function freq(degfreq) {
	let freqdeg = [];
	let max = -1;
	for(let deg in degfreq)
		if(degfreq[deg] > max) {
			max = degfreq[deg];
			freqdeg = [parseInt(deg)];
		}
		else if(degfreq[deg] == max)
			freqdeg.push(parseInt(deg))
	if(max == -1)
		return 0;
	return (freqdeg.length > 1) ? arrAvg(freqdeg) : freqdeg[0];
}

// computes the profile of the vertex 
CGraphVertex.prototype.computeProfile = function() { 
	let edges = this.getEdges();
	let deg =  (edges == null) ? 0 : this.getIndices().length;
	let imin = deg;
	let imax = deg;
	let emax = 0;
	let emin = (deg <= 0) ? 0 : this.m_cgraph.getNumOfVerticesCreated();
	let esum = 0;
	let isum = deg;
	//let ifreq = deg;
	//let efreq = 0;
	let degtypes = {};
	let degrees = []
	if(edges && deg > 0) {
		for(let vindex in edges) {
			let cgraphvertex = this.m_cgraph.getCGraphVertex(vindex);
			let deg2 = cgraphvertex.getDegree();
			degrees.push(deg2)
			isum += deg2;
			esum += deg2;
			if(!degtypes || !degtypes[deg2]) 
				degtypes[deg2] = 0;
			degtypes[deg2]++;
			if(deg2<imin) imin = deg2;
			if(deg2<emin) emin = deg2;
			if(deg2>imax) imax = deg2;
			if(deg2>emax) emax = deg2;
			//efreq = Math.max(efreq,deg2);
		} // end for
	} // end if
	//ifreq = Math.max(ifreq, efreq);

	this.m_profiles = [];
	this.m_profiles.push(deg);
	this.m_profiles.push(imin);
	this.m_profiles.push(emin);
	this.m_profiles.push(imax);
	this.m_profiles.push(emax);
	this.m_profiles.push(isum);
	this.m_profiles.push(esum);
	let iavg = (deg>0) ? (isum/(deg+1)) : 0;
	let eavg = (deg>0) ? (esum/deg) : 0
	this.m_profiles.push(iavg);
	this.m_profiles.push(eavg);
	
	let ndegrees = Object.keys(degtypes);
	let ndegfreq = Object.values(degtypes);
	let ediv = ndegrees.length;
	let emed = median(degrees);
	ndegfreq.sort(function(a,b) {return b - a;});
	let efreq =  freq(degtypes);//(ndegfreq.length>0) ? ndegfreq[0] : 0;
	
	//console.log("ndegfreq1:", ndegfreq);

	if(!degtypes[deg])
		degtypes[deg] = 0;
	degtypes[deg]++;
	degrees.push(deg);
	
	ndegrees = Object.keys(degtypes);
	ndegfreq = Object.values(degtypes);
	let idiv = ndegrees.length;
	let imed = median(degrees);

	ndegfreq.sort(function(a,b) {return b - a;});
	//console.log("ndegfreq2:", ndegfreq);
	
	//let ifreq = (ndegfreq.length>0) ? ndegfreq[0] : 0;
	let ifreq =  freq(degtypes);//(ndegfreq.length>0) ? ndegfreq[0] : 0;
	

	this.m_profiles.push(ifreq);
	this.m_profiles.push(efreq);
	this.m_profiles.push(idiv);
	this.m_profiles.push(ediv);
	this.m_profiles.push(imed);
	this.m_profiles.push(emed);
	this.m_profiles.push(imax-imin);
	this.m_profiles.push(emax-emin);
	this.m_profiles.push(deg-eavg);
/*
	CGraphVertex.tallyProfileDistributionCount("deg", deg);
	CGraphVertex.tallyProfileDistributionCount("imin", imin);
	CGraphVertex.tallyProfileDistributionCount("emin", emin);
	CGraphVertex.tallyProfileDistributionCount("imax", imax);
	CGraphVertex.tallyProfileDistributionCount("emax", emax);
	CGraphVertex.tallyProfileDistributionCount("isum", isum);
	CGraphVertex.tallyProfileDistributionCount("esum", esum);
	CGraphVertex.tallyProfileDistributionCount("iavg", iavg);
	CGraphVertex.tallyProfileDistributionCount("eavg", eavg);
	CGraphVertex.tallyProfileDistributionCount("ifreq", ifreq);
	CGraphVertex.tallyProfileDistributionCount("efreq", efreq);
	CGraphVertex.tallyProfileDistributionCount("idiv", idiv);
	CGraphVertex.tallyProfileDistributionCount("ediv", ediv);
	CGraphVertex.tallyProfileDistributionCount("imed", imed);
	CGraphVertex.tallyProfileDistributionCount("emed", emed);
	CGraphVertex.tallyProfileDistributionCount("iran", imax-imin);
	CGraphVertex.tallyProfileDistributionCount("eran", emax-emin);
	CGraphVertex.tallyProfileDistributionCount("eran", deg-eavg);
*/
	return;
}

CGraphVertex.prototype.getProfiles = function() { return this.m_profiles; }

CGraphVertex.prototype.getProfile = function(i) { return (this.m_profiles) ? this.m_profiles[i] : null; }

export const ProfileSequences = [
	{m_name: "degree", m_shortname:"deg", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-minimum", m_shortname:"imin", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-minimum", m_shortname:"emin", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-maximum", m_shortname:"imax", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-maximum", m_shortname:"emax", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-sum", m_shortname:"isum", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-sum", m_shortname:"esum", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-average", m_shortname:"iavg", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-average", m_shortname:"eavg", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-frequency", m_shortname:"ifre", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-frequency", m_shortname:"efre", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-diversity", m_shortname:"idiv", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-diversity", m_shortname:"ediv", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-median", m_shortname:"imed", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-median", m_shortname:"emed", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "inclusive-range", m_shortname:"iran", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "exclusive-range", m_shortname:"eran", m_sequence:null, m_long:null, m_short:null, m_bshow:true},
	{m_name: "happiness", m_shortname:"hap", m_sequence:null, m_long:null, m_short:null, m_bshow:true}
];