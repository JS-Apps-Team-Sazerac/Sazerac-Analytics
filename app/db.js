
import $ from 'jquery';
import _ from 'underscore';
import cache from 'cache';

var remoteApiUrl;

function init(url) {

	remoteApiUrl = url;
}

function query(dataToQuery, fromDateTime, toDateTime, bypassCache) {

	var url, fromDateTimeConverted, toDateTimeConverted, cachedObj, cachedObjectsCollection = {},
	 dataQueryParams = '&query=', queryingOnlyTodayStats, promise;


	if(bypassCache == false) {
		fromDateTimeConverted = new Date(fromDateTime);
		toDateTimeConverted = new Date(toDateTime);

		dataToQuery.forEach(function(name) {
			cachedObj = cache.query(name, fromDateTimeConverted, toDateTimeConverted);
			if(typeof cachedObj !== 'undefined') {
				cachedObjectsCollection[name] = cachedObj;
			}
		});
	}

	if(bypassCache == false && typeof cachedObjectsCollection !== 'undefined') {

		return new Promise(function(resolve, reject) {
			console.log("We got all info from cache - no request.");
			console.log(cachedObjectsCollection);
			resolve(cachedObjectsCollection);
		});

	} else {

		dataToQuery.forEach(function(name) {

			dataQueryParams += name + ',';
		});
	}

	dataQueryParams += '&from=' + fromDateTime + '&to=' + toDateTime;
	url = remoteApiUrl + dataQueryParams;

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
            	}

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