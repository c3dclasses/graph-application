import { Observable } from 'rxjs';

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

	console.log("d1: ", d1, " d2: ", d2, "lineLen: ", lineLen, "d1+d2: ", (d1+d2));
	console.log("lineLen + buffer: ", (lineLen + buffer), "lineLen - buffer: ", (lineLen - buffer),);


	return (Math.floor(d1+d2)) >= (lineLen-buffer) && (Math.floor(d1+d2)) <= (lineLen+buffer)
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

export function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

export function fetchFromNetworkX(requestParams) {
	const requestapi = "http://kevlewis.com/rest/graphapplication/networkx/request.php";     
	const options = {
		method: 'POST',
		header: {
			'Accept': 'application/json',
			'Content-type': 'aaplication/json'
		},
		body: JSON.stringify(requestParams)
	};
	const observable = new Observable(subscriber => {
		fetch(requestapi, options)
			.then(response=>response.json())
			.then(request=>{
				// send the request object
				if(request.m_berror === true) {
					subscriber.error(request);
					subscriber.complete();
					return;
				}
				subscriber.next(request);
				fetchMoreFromNetworkX(request, subscriber);			
			})
			.catch(error=>{
				subscriber.error(error); // delivers an error if it caught one
			});
	});
	return observable;
} // fetchFromNetworkX()

function fetchMoreFromNetworkX(responseParams, subscriber) {
	const responseapi = "http://kevlewis.com/rest/graphapplication/networkx/response.php";
	const options = {
		method: 'POST',
		header: {
			'Accept': 'application/json',
			'Content-type': 'application/json'
		},
		body: JSON.stringify(responseParams)
	}; // end options

	let _setTimeoutID = -1;
	function fetchMore() {
		fetch(responseapi, options)
			.then(response=>response.json())
			.then(response=>{
				console.log("response: ", response);
				if(_setTimeoutID > -1)
					clearInterval(_setTimeoutID);
				
				if(response && response.m_percentage===100) {
					subscriber.complete();
				}
				else if(response.m_berror) {
					subscriber.error(response.error);
					subscriber.complete();
				}
				else {
					subscriber.next(response);
					_setTimeoutID = setTimeout(fetchMore, 5000);
				}
			}) // end then
			.catch(error=>{
				if(_setTimeoutID > -1)
					clearInterval(_setTimeoutID);
				subscriber.error(error);	
				subscriber.complete();
			}); // end catch 
	} // end fetchMore()
	
	// call the fetch more function
	fetchMore();
} // fetchMoreFromNetworkX()
