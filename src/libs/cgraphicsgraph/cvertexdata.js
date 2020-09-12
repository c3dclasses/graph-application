import {CGraphicsGraphInstance as cggi} from "./cgraphicsgraph";

export default class CVertexData {
	constructor(params=null) { 
		if(params) 
			this.initParams(params); 
	}

	initParams(params) {
		this.setPos(params.x,params.y);
		this.setOriginalPos(params.x,params.y);
		this.setRadius(params.r);
		this.setOriginalWH(params.w, params.h);
		this.setLabel("");
		this.setLabelOffset(0,0);
		this.setBgColor("#000000");
		this.setFgColor("#ffffff");
		this.setStrokeColor("#000000");
		this.setSelStrokeColor("#ff0000");
		this.setFontType("Arial");
		this.setFontSize(12);
	} // end init()

	loadParams(initparams) {
		let _this = this;
		for(let param in initparams)
			_this[param] = initparams[param];
	}

	setPos(x,y) { this.m_x = x; this.m_y = y;}	
	setOriginalPos(x,y) { this.m_ox = x; this.m_oy = y;}	
	setOriginalWH(w,h) { this.m_ow = w; this.m_oh = h;}	
	setRadius(r) { this.m_r = r;}
	setBgColor(color) { this.m_bgColor = color;}
	setFgColor(color) { this.m_fgColor = color;}
	setStrokeColor(color) { this.m_stkColor = color;}
	setSelStrokeColor(color) { this.m_selStkColor = color;}
	setLabelOffset(x,y) { this.m_lx=x; this.m_ly=y;}
	setLabel(label) { this.m_label = label;}
	setFontType(fontType) { this.m_fontType = fontType;}
	setFontSize(fontSize) { this.m_fontSize = fontSize;}

	restorePos(w,h) {
		this.m_x = this.m_ox;
		this.m_y = this.m_oy;
		let sw = w/this.m_ow;
		let sh = h/this.m_oh;
		this.reposition(sw, sh, w, h);
	}

	savePos(w,h) {
		this.m_ox = this.m_x;
		this.m_oy = this.m_y;
		this.m_ow = w;
		this.m_oh = h;
	}

	reposition(sw, sh, nw, nh) {
		let x = this.m_x;
		let y = this.m_y;
		let r = this.m_r;
		x *= sw;
		y *= sh;
		if(x-r <= 0) 
			x = r;
		else if(x+r >= nw) 
			x = nw-r;
		if(y-r <= 0) 
			y = r;
		else if(y+r >= nh) 
			y = nh-r;
		this.m_x = x;
		this.m_y = y;
		this.m_r = r;
	}

	getRadius() { return (cggi && cggi.m_properties.m_busevradius) ? cggi.m_properties.m_vradius : this.m_r; }

	draw(cgraphics) { 
		cgraphics.drawCircle(this.m_x, this.m_y, this.getRadius(), this.m_bgColor, this.m_stkColor);
		cgraphics.drawText(this.m_x, this.m_y, this.m_label, this.m_fgColor, this.m_bgColor, this.m_fontSize, this.m_fontType, "", "");
	} // end draw()
} // end CVertexData