import {CGraphicsGraphInstance as cggi} from "./cgraphicsgraph";

export default class CEdgeData {
	static m_minwidth = 1000;
	static m_maxwidth = 0;
	
	constructor(params=null) { 
		this.initParams(params || {c:"#ff0000", w:5, label:""});
	}
	
	initParams({w,c,label}) {
		this.m_color=c;
		this.m_label=label;
		this.m_width=w; 
		CEdgeData.m_minwidth = Math.min(CEdgeData.m_minwidth, this.m_width);
		CEdgeData.m_maxwidth = Math.max(CEdgeData.m_maxwidth, this.m_width);
	} 

	loadParams(initparams) {
		let _this = this;
		for(let param in initparams)
			_this[param] = initparams[param];
	}

	setColor(color) { this.m_color = color; }
	setWidth(width) { this.m_width = width; }
	setLabel(label) { this.m_label = label; }
	getWidth() { return (cggi && cggi.m_properties.m_buseewidth) ? cggi.m_properties.m_ewidth : this.m_width; }
} // end CEdgeData

export class CNewEdgeDataLine {
	constructor() { this.init(); } 
	init() {
	//	console.log("CEdgeData.m_maxwidth: " + CEdgeData.m_maxwidth)

		this.m_width = 5;
		this.m_color = "#0000ff";
		this.setEndPos(0,0);
		this.setStartPos(0,0);
	} // end init()
	setColor(color){this.m_color = color; }
	setWidth(width){this.m_width = width; }
	setStartPos(x,y) { this.m_sx = x; this.m_sy = y; }
	setEndPos(x,y) { this.m_ex = x; this.m_ey = y; }
	draw(cgraphics) {
		cgraphics.drawLine(this.m_sx, this.m_sy, this.m_ex, this.m_ey, this.m_width, this.m_color);
		cgraphics.drawCircle(this.m_ex, this.m_ey, this.m_width, this.m_color, this.m_color); 
		return;
	} // end draw()
} // end CNewEdgeDataLine