import _ from 'underscore';

function init() {
	_.mixin({
		concentrateObjects: function() {
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
	});
}

export default{init};