(function() {

	if(document.cookie.indexOf("__vsa") >= 0) {
		return;
	}

	var httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = function() {
 		if (httpRequest.readyState==4) {
  			if (httpRequest.status==200) {
    			alert(httpRequest.responseText);
  			} else {
   				/* Error occured */
  			}
 		}
	}

	//HINT: When adding more values use encodeURIComponent
	var screenWidth = screen.width;
	var screenHeight = screen.height;
	var getReportData = '?visitor=&width='+screenWidth+'&height='+screenHeight;
	httpRequest.open('GET', 'gate.php'+getReportData, true);
	httpRequest.send(null);
}());
