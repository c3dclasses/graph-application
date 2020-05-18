import { delayFunctionCall, getOffsetOfElement } from "../utility/utility";

class CGraphics {
	constructor(element, bresizeable) {
		// try to get the canvas object and it's graphics context
		let canvas = element;		
		let graphics = canvas.getContext("2d");
		
		// set the members
		this.m_fnresize = null;
		this.m_binitsize = false;
		this.m_canvas = canvas;
		this.m_graphics = graphics;

		// check if this is a resizeble graphics object
		if(bresizeable) {
			window.addEventListener("resize", delayFunctionCall(this.handleResize.bind(this),300));
			window.dispatchEvent(new Event("resize"));
		}
	} // end constructor

	// set and get methods
	setWidth(w) { this.m_canvas.width = w; }
	setHeight(h) { this.m_canvas.height = h; }
	setOnResize(fnresize) {this.m_fnresize = fnresize;}
	setGraphics(graphics) { this.m_graphics = graphics; }
	getCanvas() { return this.m_canvas; }
	getWH() { return { w:this.m_canvas.width, h:this.m_canvas.height}; }
	getXY() { 
		let offset = getOffsetOfElement(this.m_canvas); 
		return { x:offset.left, y:offset.top}; 
	}
	getXYFromClientXY(cx,cy) { let p=this.getXY(); return {x:(cx-p.x), y:(cy-p.y)}; }
	getGraphics() { return this.m_graphics; }

	// other
	//saveScreenShot() { window.Canvas2Image.saveAsPNG(this.m_canvas); }

	saveScreenShot() {
		let pdf = new window.jsPDF();
		pdf.addImage(this.m_canvas.toDataURL(),'jpeg',0,0,160,180);
		pdf.save('download.pdf');
	}
	
	// event handlers methods
	handleResize(e) { this.resize(this.m_canvas.offsetWidth, this.m_canvas.offsetHeight); }
	resize(nw, nh) {
		// set the old size of the canvass
		let ow = this.m_canvas.width; 
		let oh = this.m_canvas.height;

		// if not init let the ow and oh be nw and nh
		if(!this.m_binitsize) {
			ow = nw;
			oh = nh;
			this.m_binitsize = true;
		}

		// set the width and height of the graphics area and get updated graphics object
		this.setWidth(nw);
		this.setHeight(nh);
		this.setGraphics(this.m_canvas.getContext("2d"));
		
		// call the resize callback if it's set
		if(this.m_fnresize)
			this.m_fnresize(ow,oh,nw,nh);
	} // end resize

	// drawing methods
	clear(color, alpha) { 
		let d = this.getWH(); 
		this.m_graphics.fillStyle = color; 
		this.m_graphics.globalAlpha = alpha;
		this.m_graphics.clearRect(0, 0, d.w,d.h);
		this.m_graphics.globalAlpha = 1.0;
	} // end clear 
	
	drawCircle(x, y, radius, color, stkcolor) { 
		this.m_graphics.beginPath();
		this.m_graphics.arc(x, y, radius, 0, 2 * Math.PI, false);
		this.m_graphics.fillStyle = color;
		this.m_graphics.fill();
		this.m_graphics.lineWidth = 1;
		this.m_graphics.strokeStyle = stkcolor;
		this.m_graphics.stroke();
	} 
	
	drawText(x, y, strtext, color, bgcolor, fontsize, fontname, valign, halign) { 
		this.m_graphics.font = [fontsize , "px" , " " , ((fontname === "") ? "Arial" : fontname)].join("");
		this.m_graphics.textAlign = (halign === "") ? "center" : halign;
		this.m_graphics.textBaseline = (valign === "") ? "middle" : valign;
		this.m_graphics.fillStyle = bgcolor;
		let w = this.m_graphics.measureText(strtext).width + 4;
		let h = fontsize + 4;
		this.m_graphics.fillRect(x-(w*0.5),y-(h*0.5),w,h);
		this.m_graphics.fillStyle = color;
		this.m_graphics.fillText(strtext,x,y);
	} 

	drawLine(x1, y1, x2, y2, w, color) {
		this.m_graphics.beginPath(); 
		this.m_graphics.moveTo(x1, y1);
		this.m_graphics.lineTo(x2, y2);
		this.m_graphics.strokeStyle = color;
		this.m_graphics.lineWidth = w;
		this.m_graphics.stroke();
	}
} // end CGraphics


export default CGraphics;