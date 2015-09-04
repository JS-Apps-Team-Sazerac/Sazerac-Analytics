
import $ from 'jquery';
import _ from 'underscore';
import _ext from 'underscoreExt';
import db from 'db';
import display from 'display';

(function() {
	
	var serverDayStart, serverDayStartConverted, datePickerStart, datePickerEnd,
	generalQueryDataNames = ["browser", "system", "referrer", "country"];


	function loadInitialData() {
		db.query(generalQueryDataNames, serverDayStart, serverDayStart, true).then(function(response) {
			if(typeof response[generalQueryDataNames[0]] === 'undefined') {
				response = undefined;
			}
    		display.init(response, menuInputCallback, datePickerInputCallback, false);
    	}, function(response) {
    		display.init(undefined, menuInputCallback, datePickerInputCallback, true);
    	});
	}

	function datePickerInputCallback(fromDate, toDate) {

		var fromDateConverted, toDateConverted, queryFromCacheAndServer, queryFromServer, promises = [];

		fromDateConverted = new Date(fromDate);
		toDateConverted = new Date(toDate);

		if(toDateConverted < fromDateConverted) {
			alert("Start date cant be greater than end date.");
			return;
		}

		datePickerStart = fromDate;
		datePickerEnd = toDate;

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

			if(typeof totalResponse[generalQueryDataNames[0]] !== 'undefined') {
				display.updateTemplatesData(totalResponse);
			}
		});
	}

	function menuInputCallback(url) {
		var fromDate, toDate, executeDefault = true;

		if(url.indexOf('click') >= 0) {

			executeDefault = false;

			if(typeof datePickerStart !== 'undefined' && typeof datePickerEnd !== 'undefined') {
				fromDate = datePickerStart;
				toDate = datePickerEnd;
			} else {
				fromDate = serverDayStart;
				toDate = serverDayStart;
			}

			if(typeof fromDate !== 'undefined' && typeof toDate !== 'undefined') {
				db.query(["click"], fromDate, toDate, true).then(function(response) {
					if(typeof response.click !== 'undefined') {
						display.displayClicksTemplate(response.click.Data);
					}
				});
			}
		}

		return executeDefault;
	}

	_ext.init();
	db.init('http://avalkov.com/vsa/server/info.php?app=');

	if(typeof serverDayStart === 'undefined') {
    	db.query([], "", "", true).then(function(response) {
    		serverDayStart = response.serverDayStart;
    		serverDayStartConverted = new Date(serverDayStart);
    		loadInitialData();
    	}, function(response) {
    		display.init(undefined, menuInputCallback, datePickerInputCallback, true);
    	});
	}

}());
