import _ from 'underscore';

function init() {

_.mixin({
	mergeResponsesData: function(firstData, secondData) {
		var i, x, len, mergedData = [];
		
		len = firstData.length;
		for(i = 0; i < len; i += 1) {
			mergedData.push(firstData[i]);
		}
		
		if(typeof secondData !== 'undefined') {
			len = secondData.length;
			for(i = 0; i < len; i += 1) {
			mergedData.push(secondData[i]);
			}
		}
		
		return mergedData;
	}
});

_.mixin({
	mergeResponses: function(queriedDataNames, firstResponse, secondResponse) {
		var mergedResponse = {}, newerResponse, olderResponse, 
		firstResponseFromDateConverted, secondResponseFromDateConverted;
	
		queriedDataNames.forEach(function(name) {
	
		mergedResponse[name] = {};
	
		if(typeof firstResponse[name] === 'undefined' || typeof secondResponse[name] === 'undefined') {
	
			newerResponse = firstResponse[name] || secondResponse[name];
			mergedResponse[name].Data = _.mergeResponsesData(newerResponse.Data);
			mergedResponse[name].fromDateTime = newerResponse[name].fromDateTime;
			mergedResponse[name].toDateTime = newerResponse[name].toDateTime;
	
		} else {
	
			firstResponseFromDateConverted = new Date(firstResponse[name].Data[0].fromDateTime);
			secondResponseFromDateConverted = new Date(secondResponse[name].Data[0].fromDateTime);
	
			if(firstResponseFromDateConverted <= secondResponseFromDateConverted) {
	
			newerResponse = firstResponse;
			olderResponse = secondResponse;
	
			} else {
	
			newerResponse = secondResponse;
		  olderResponse = firstResponse;
		  }
	
			mergedResponse[name].Data = _.mergeResponsesData(newerResponse[name].Data, olderResponse[name].Data);
			mergedResponse[name].fromDateTime = olderResponse[name].fromDateTime;
			mergedResponse[name].toDateTime = newerResponse[name].toDateTime;
		}
	
		});
	
		return mergedResponse;
	}
});
  _.mixin()

  _.mixin({
    dateObjToFormattedString: function(date) {
      var yyyy, mm, dd;
      yyyy = date.getFullYear().toString();
      mm = (date.getMonth()+1).toString();
      dd  = date.getDate().toString();
      return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + " 00:00:00";
    }
  });

}

export default{init};