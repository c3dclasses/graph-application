export function delayFunctionCall(fn,ms) {  return function() { setTimeout(fn,ms); }  } 

export function getRandomNumber(min, max) { return Math.random() * (max - min) + min; } 

export function collidePoint2Circle(px, py, cx, cy, cr) {
	let dx = px - cx;
	let dy = py - cy;
	let d = Math.sqrt((dx*dx) + (dy*dy));
	return (d <= cr);
} // end collidePoint2Circle()

export function collidePoint2LineSegment (px, py, x1, y1, x2, y2, buffer) {
	let d1 = distOfPoints(px, py, x1, y1);
	let d2 = distOfPoints(px, py, x2, y2);  
	let lineLen = distOfPoints(x1, y1, x2, y2);
	return (d1 + d2) >= (lineLen-buffer) && (d1+d2) <= (lineLen+buffer)
} // end collidePoint2LineSegment()

export function distOfPoints(x1, y1, x2, y2) { 
	return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2)); 
} // end distOfPoints()

export function getOffsetOfElement(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
} // end getOffsetOfElement()

export function triggerEvent(eventname, data=null) {
	let event = new CustomEvent(eventname, {
		bubbles:true,
		cancelable:true,
		detail: data
	});
	document.dispatchEvent(event);
}

export function handleEvent(eventname, fnhandler) {
	document.addEventListener(eventname,(e)=>{
		if(fnhandler && typeof fnhandler == "function")
			fnhandler(e.detail);
	});
}