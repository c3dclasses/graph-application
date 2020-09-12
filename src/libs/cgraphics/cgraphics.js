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
	saveScreenshot() {
		let pdf = new window.jsPDF({
			orientation: 'landscape',
			unit: 'px',
			format: [this.m_canvas.width, this.m_canvas.height]
		  });
		pdf.addImage(this.m_canvas.toDataURL(),'jpeg',0,0, this.m_canvas.width, this.m_canvas.height,);
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


	////////////////////////////////////////
	// other
	
	drawGrid(rows, cols, w, color, padding) { 
		//this.drawGridBorder(rows, cols, w, color, padding); 
		this.drawGridPoints(rows, cols, w, color, padding); 
	}

	drawGridPoints(rows, cols, w, color, padding) {
		if(rows <= 0 || cols <= 0)
			return;
		console.log(rows, cols, w, color, padding)
		console.log("draw grid points")
		let d = this.getWH();
		d.w -= padding*2;
		d.h -= padding*2;
		const x1 = padding;
		const y1 = padding;
		const x2 = x1 + d.w;
		const y2 = y1 + d.h;
		this.m_graphics.setLineDash([5, 3]);
		this.drawLine(x1,y1,x2,y1,w,color); // top side
		this.drawLine(x1,y2,x2,y2,w,color); // bottom side
		this.drawLine(x1,y1,x1,y2,w,color); // left side
		this.drawLine(x2,y1,x2,y2,w,color); // right side
		this.m_graphics.setLineDash([]);
		cols = d.w / cols;
		rows = d.h / rows;
		for(let x=x1+cols*0.5; x<d.w; x+=cols)
			for(let y=y1+rows*0.5; y<d.h; y+=rows)
				this.drawCircle(x,y,5,color,color);	
		return;
	}

	getGridRowColPosFromPos = function(x, y, nrows, ncols, padding, bcenter) {
		if(nrows <= 0 || ncols <= 0)
			return null;
		let d = this.getWH();
		x -= padding;
		y -= padding;
		d.w -= padding * 2;
		d.h -= padding * 2;
		let w = Math.floor(d.w / ncols);
		let h = Math.floor(d.h / nrows);
		let icol = Math.floor(x / w);
		let irow = Math.floor(y / h); 
		x = padding + (icol * w);
		y = padding + (irow * h);
		if(bcenter) {
			x += w*0.5;
			y += h*0.5;
		}
		return {x:x,y:y};
	}
	
	getGridRowColPos = function(irow, icol, nrows, ncols, padding, bcenter) {
		if(nrows <= 0 || ncols <= 0 || irow < 0 || icol < 0)
			return null;
		let d = this.getWH();
		let x = padding;
		let y = padding;
		d.w -= padding * 2;
		d.h -= padding * 2;
		let w = Math.floor(d.w / ncols);
		let h = Math.floor(d.h / nrows);
		x += (icol * w);
		y += (irow * h);
		if(bcenter) {
			x += w*0.5;
			y += h*0.5;
		}
		return {x:x,y:y};
	}
	

} // end CGraphics

export default CGraphics;