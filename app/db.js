
import $ from 'jquery';
import _ from 'underscore';
import cache from 'cache';

function init(remoteApiUrl) {

	this.remoteApiUrl = remoteApiUrl;
	this.serverDayStart = '2015-08-31 00:00:00';
	this.serverDayStartConverted = new Date(this.serverDayStart);
}

// TODO: Break into functions
// TODO: We must make atleast one request to take the serverDayStart
// TODO: UI must have manually predefined min and max date or server handle this, otherwise there will be problems

function query(dataToQuery, fromDateTime, toDateTime, bypassCache) {

	var url, fromDateTimeConverted, toDateTimeConverted, cacheObj, cachedObjectsCollection = {},
	 dataQueryParams = '&query=', isThereDataToRequest = false, queryingOnlyTodayStats, promise;

	fromDateTimeConverted = new Date(fromDateTime);
	toDateTimeConverted = new Date(toDateTime);

	if(bypassCache == false) {
		dataToQuery.forEach(function(name) {

			// FIXME: For now we skip querying the cache if toDateTime is current day which statistics are still being gathered
			// We must implement feature to check if it can gather all statistics until day before and just current day statistics from server

			cachedObj = cache.query(name, fromDateTimeConverted, toDateTimeConverted);
			if(typeof cachedObj !== 'undefined') {
				cachedObjectsCollection[name] = cachedObj;
			} else {
				isThereDataToRequest = true;
			}

		});
	}

	if(isThereDataToRequest == false && bypassCache == false) {
		return new Promise(function(resolve, reject) {
			console.log("We got all info from cache - no request.");
			console.log(cachedObjectsCollection);
			resolve(cachedObjectsCollection);
		});
	}

	dataToQuery.forEach(function(name) {
		if(typeof cachedObjectsCollection[name] === 'undefined') {
			dataQueryParams += name + ',';
		}
	});

	dataQueryParams += '&from=' + fromDateTime + '&to=' + toDateTime;
	url = this.remoteApiUrl + dataQueryParams;

    promise = new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            method: 'GET',
            contentType: 'application/json',
            success: function(data) {

            	if(bypassCache == false) {
                    dataToQuery.forEach(function(name) {
            			if(typeof data[name] !== 'undefined') {
            				cache.store(name, data[name], fromDateTimeConverted, toDateTimeConverted);
            			}
            		});

            		if($.isEmptyObject(cachedObjectsCollection) == false) {
            			data = _.concentrateObjects(data, cachedObjectsCollection);	
            		}
            	}

          		console.log(data);
            	resolve(data);
            },
            error: function(err) {
             reject(err.responseText);
            }
        });
    });

    return promise;
}


export default {init, query};