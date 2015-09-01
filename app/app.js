
import $ from 'jquery';
import _ from 'underscore';
import _ext from 'underscoreExt';
import db from 'db';
import display from 'display';

_ext.init();
display.init();
db.init('http://avalkov.com/vsa/server/info.php?app=');

db.query(["browser", "system", "country"], "2015-09-01 00:00:00", "2015-09-01 00:00:00")
.then(function(response) {
	display.drawPieChart("#pie-chart-browsers","Browsers", response.browser);
	display.drawPieChart("#pie-chart-systems","Systems", response.system);
	display.drawPieChart("#pie-chart-countries","Countries", response.country);
	display.drawBarChart("#bar-chart-countries","Countries", response.country);
}, function(response) {
	console.log("Error boy.");
	console.log(response);
});
