
import $ from 'jquery';
import _ from 'underscore';
import _ext from 'underscoreExt';
import db from 'db';
import display from 'display';

(function() {
	
	var serverDayStart, serverDayStartConverted,
	generalQueryDataNames = ["browser", "system", "referrer", "country"];


	function loadInitialData() {
		db.query(generalQueryDataNames, serverDayStart, serverDayStart, true).then(function(response) {
    		display.init(response, datePickerInputHandler, false);
    	}, function(response) {
    		display.init(undefined, datePickerInputHandler, true);
    	});
	}

	function datePickerInputHandler(fromDate, toDate) {

		var fromDateConverted, toDateConverted, queryFromCacheAndServer, queryFromServer, promises = [];

		fromDateConverted = new Date(fromDate);
		toDateConverted = new Date(toDate);

		if(toDateConverted < fromDateConverted) {
			alert("Start date cant be greater than end date.");
			return;
		}

		if(fromDateConverted < serverDayStartConverted && toDateConverted >= serverDayStartConverted) {

			toDateConverted.setDate(toDateConverted.getDate() - 1);

			promises.push(db.query(generalQueryDataNames, fromDate, _.dateObjToFormattedString(toDateConverted), false));

			fromDate = toDate;
		}

		promises.push(queryFromServer = db.query(generalQueryDataNames, fromDate, toDate, true));

		Promise.all(promises).then(function(responses) {

			var totalResponse;

			if(typeof responses[1] !== 'undefined') {

				totalResponse = _.mergeResponses(generalQueryDataNames, responses[0], responses[1]);

			} else {

				totalResponse = responses[0];
			}

			display.updateTemplatesData(totalResponse);
		});
	}


	_ext.init();
	db.init('http://192.168.40.1/vsa/server/info.php?app=');

	console.log(generalQueryDataNames);
	if(typeof serverDayStart === 'undefined') {
    	db.query([], "", "", true).then(function(response) {
    		serverDayStart = response.serverDayStart;
    		serverDayStartConverted = new Date(serverDayStart);
    		loadInitialData();
    	}, function(response) {
    		display.init(undefined, datePickerInputHandler, true);
    	});
	}

}());
