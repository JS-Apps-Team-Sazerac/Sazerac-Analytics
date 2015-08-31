
import $ from 'jquery';
import cache from 'cache';


function init(remoteApiUrl) {

	this.remoteApiUrl = remoteApiUrl;
}

// TODO: Move to separete module
function concentrateObjects() {
	var p, len, i, ret = {};
  	len = arguments.length;
  	for (i = 0; i < len; i += 1) {
    	for (p in arguments[i]) {
    		if (arguments[i].hasOwnProperty(p)) {
        		ret[p] = arguments[i][p];
      		}
    	}
  	}
  	return ret;
}

// TODO: Break into functions
// TODO: We must make atleast one request to take the serverDayStart
// TODO: UI must have manually predefined min and max date or server handle this, otherwise there will be problems

function query(dataToQuery, fromDateTime, toDateTime) {

	var url, fromDateTimeConverted, toDateTimeConverted, cacheObj, cachedObjectsCollection = {},
	 dataQueryParams = '&query=', isThereDataToRequest = false, promise;

	fromDateTimeConverted = new Date(fromDateTime);
	toDateTimeConverted = new Date(toDateTime);

	dataToQuery.forEach(function(name) {

		// FIXME: For now we skip querying the cache if toDateTime is current day which statistics are still being gathered
		// We must implement feature to check if it can gather all statistics until day before and just current day statistics from server

		if(toDateTime === this.serverDayStart) {
			cacheObj = undefined;
		} else {
			cachedObj = cache.query(name, fromDateTimeConverted, toDateTimeConverted);
		}

		if(typeof cachedObj !== 'undefined') {
			cachedObjectsCollection[name] = cachedObj;
		} else {
			isThereDataToRequest = true;
			dataQueryParams += name + ':';
		}
	});

	if(isThereDataToRequest == false) {
		return new Promise(function(resolve, reject) {
			console.log("We got all info from cache - no request.");
			console.log(cachedObjectsCollection);
			resolve(cachedObjectsCollection);
		});
	}

	dataQueryParams += '&from=' + fromDateTime + '&to=' + toDateTime;
	url = this.remoteApiUrl + dataQueryParams;

    promise = new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            method: 'GET',
            contentType: 'application/json',
            success: function(data) {

            	this.serverDayStart = data.serverDayStart;

            	dataToQuery.forEach(function(name) {
            		if(typeof data[name] !== 'undefined') {
            			cache.store(name, data[name], fromDateTimeConverted, toDateTimeConverted);
            		}
            	});

            	if($.isEmptyObject(cachedObjectsCollection) == false) {
            		data = concentrateObjects(data, cachedObjectsCollection);	
            	}
          		console.log(data);
            	resolve(data);
            },
            error: function(err) {
              reject(JSON.parse(err.responseText));
            }
        });
    });

    return promise;
}


export default {init, query};