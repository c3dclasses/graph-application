export default class CEdgeData{
	constructor(params=null) { 
		if(params) 
			this.initParams(params); 
		this.setColor("#ff0000");
		this.setWidth(5);
	}
	
	initParams(params) {
		this.setWidth(params.w); 
		this.setColor(params.c);
		this.setLabel(params.label);
	} 

	setColor(color) { this.m_color = color; }
	setWidth(width) { this.m_width = width; }
	setLabel(label) { this.m_label = label; }
} // end CEdgeData

export class CNewEdgeDataLine {
	constructor() { this.init(); } 
	init() {
		this.m_w = 5;
		this.m_color = "#0000ff";
		this.setEndPos(0,0);
		this.setStartPos(0,0);
	} // end init()
	setColor(color){this.m_color = color; }
	setWidth(width){this.m_width = width; }
	setStartPos(x,y) { this.m_sx = x; this.m_sy = y; }
	setEndPos(x,y) { this.m_ex = x; this.m_ey = y; }
	draw (cgraphics) {
		cgraphics.drawLine(this.m_sx,this.m_sy,this.m_ex,this.m_ey,this.m_w,this.m_color);
		cgraphics.drawCircle(this.m_ex,this.m_ey,this.m_w,this.m_color,this.m_color); 
		return;
	} // end draw()
} // end CNewEdgeDataLine
