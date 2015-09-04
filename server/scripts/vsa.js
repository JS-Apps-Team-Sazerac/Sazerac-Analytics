(function() {

	function mouseTarget(e) {
		var targ;
	
		if (!e) {
			e = window.event;
		}
	
		if (e.target) {
			targ = e.target;
		} else if (e.srcElement) {
			targ = e.srcElement;
		}
	
		if (targ.nodeType == 3) {
			targ = targ.parentNode;
		}
	
		return targ;
	}
	
	function mousePositionDocument(e) {
		var posx = 0, posy = 0, width = 0, height = 0;
	
		if (!e) {
			e = window.event;
		}
	
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
	
		return {
			x : posx,
			y : posy,
		};
	}
	
	function findPos(obj) {
		var curleft = 0, curtop = 0;
	
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
	
		return {
			left : curleft,
			top : curtop
		};
	}
	
	function mousePositionElement(e) {
		var mousePosDoc, target, targetPos,
			posx, posy;
	
		mousePosDoc = mousePositionDocument(e);
		target = mouseTarget(e);
		if(document.body.scrollWidth != target.offsetWidth) {
			targetPos = findPos(target);
			posx = mousePosDoc.x - targetPos.left;
			posy = mousePosDoc.y - targetPos.top;
			posx = (posx / target.offsetWidth) * 100;
			posy = (posy / target.offsetHeight) * 100;
		}
		
		return {
			x : posx,
			y : posy
		}; 
	}
	
	function getCookie(cname) {
		var name = cname + "=", ca, c, i;
		ca = document.cookie.split(';');
		for(i=0; i<ca.length; i++) {
			c = ca[i];
			while (c.charAt(0)==' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	
	function previousElementSibling (element) {
		if (element.previousElementSibling !== 'undefined') {
			return element.previousElementSibling;
		} else {
			while (element = element.previousSibling) {
				if (element.nodeType === 1) {
					return element;
				}
			}
		}
	}
	
	function getCSSPath (element) {
		var path = [], selector, sibling, siblingSelectors;
		
		if (!(element instanceof HTMLElement)) { 
			return false; 
		}
		
		while (element.nodeType === Node.ELEMENT_NODE) {
			selector = element.nodeName;
			if (element.id) {
				selector += ('#' + element.id);
			} else {
				sibling = element;
				siblingSelectors = [];
				while (sibling !== null && sibling.nodeType === Node.ELEMENT_NODE) {
					siblingSelectors.unshift(sibling.nodeName);
					sibling = previousElementSibling(sibling);
				}
				if (siblingSelectors[0] !== 'HTML') {
					siblingSelectors[0] = siblingSelectors[0] + ':first-child';
				}
				selector = siblingSelectors.join(' + ');
			}
			path.unshift(selector);
			element = element.parentNode;
		}
		return path.join(' > ');
	}
	
	function reportToServer(reportData, async) {
	
		var httpRequest;
	
		httpRequest = new XMLHttpRequest();
		httpRequest.open('GET', '/vsa/server/gate.php'+reportData, async);
		httpRequest.send(null); 
	}
	
	function initialReport() {
	
		reportToServer('?visitor=&width='+screen.width+'&height='+screen.height, true);
	}
	
	function mouseClickReport(e) {
		var coords;
	
		coords = mousePositionElement(e);
		path = getCSSPath(e.target);
	
		if(typeof path !== 'undefined' && typeof coords.x !== 'undefined' && typeof coords.y !== 'undefined') {
			reportToServer('?click=' + encodeURIComponent(getCookie('vsa')) + '&path=' + encodeURIComponent(path) + '&x=' + encodeURIComponent(coords.x) + '&y=' + encodeURIComponent(coords.y), false);
		}
	}
	
	if(document.cookie.indexOf('vsa') === -1) {
		initialReport();
	}
	
	document.onclick = mouseClickReport;

}());
