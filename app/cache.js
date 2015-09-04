
var prefixDataCache = "vsa_spa_cache_";

function store(cacheName, cacheData, fromDateTime, toDateTime) {

	var cacheContainer, cacheDataEntry, i, cacheObj,
		fromDateTimeCacheObjConverted, toDateTimeCacheObjConverted;

	cacheContainer = localStorage.getItem(prefixDataCache + cacheName);

	if(cacheContainer !== null) {

		cacheContainer = JSON.parse(cacheContainer);

		for(i = 0; i < cacheContainer.length; i += 1) {

			cacheObj = cacheContainer[i];
			fromDateTimeCacheObjConverted = new Date(cacheObj.fromDateTime);
			toDateTimeCacheObjConverted = new Date(cacheObj.toDateTime);

			if(fromDateTime >= fromDateTimeCacheObjConverted && toDateTimeCacheObjConverted >= toDateTime) {

                // Data for that period is already cached so we skip

                console.log("Data for that period is already cached so we skip");

				break;

			} else if(fromDateTimeCacheObjConverted >= fromDateTime && toDateTime >= toDateTimeCacheObjConverted) {

				// Data that we want to cache is for period longer than existing cache entry, so replace

				console.log("Data that we want to cache is for period longer than existing cache entry, so replace");

				cacheContainer[i][cacheName] = cacheData;
				localStorage.setItem(prefixDataCache + cacheName, JSON.stringify(cacheContainer));
			}
		}

	} else {

		cacheContainer = [];
		cacheContainer.push(cacheData);
		console.log('Storing new cache');
		console.log(cacheContainer);
		localStorage.setItem(prefixDataCache + cacheName, JSON.stringify(cacheContainer));
	}
}

function query(cacheName, fromDateTime, toDateTime) {

	var data, i, cacheContainer, cacheObj,
		fromDateTimeCacheObjConverted, toDateTimeCacheObjConverted;

	cacheContainer = localStorage.getItem(prefixDataCache + cacheName);

	if(cacheContainer !== null) {

		cacheContainer = JSON.parse(cacheContainer);

		for(i = 0; i < cacheContainer.length; i += 1) {

			cacheObj = cacheContainer[i];
			fromDateTimeCacheObjConverted = new Date(cacheObj.fromDateTime);
			toDateTimeCacheObjConverted = new Date(cacheObj.toDateTime);

			console.log('CacheObje');
			console.log(fromDateTimeCacheObjConverted + ' ' + toDateTimeCacheObjConverted);
			console.log(fromDateTime + ' ' + toDateTime);
			if(fromDateTimeCacheObjConverted <= fromDateTime && toDateTime <= toDateTimeCacheObjConverted) {

				while(fromDateTimeCacheObjConverted < fromDateTime) {
					cacheObj.Data.pop();
					fromDateTimeCacheObjConverted.setDate(fromDateTimeCacheObjConverted.getDate() + 1);
				}

				while(toDateTimeCacheObjConverted > toDateTime) {
					cacheObj.Data.shift();
					toDateTimeCacheObjConverted.setDate(toDateTimeCacheObjConverted.getDate() - 1);
				} 
				
				data = cacheObj;
			} 
			
		}
	}

	return data;
}

export default { query, store };