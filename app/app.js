
import $ from 'jquery';
import _ from 'underscore';
import _ext from 'underscoreExt';
import db from 'db';
import display from 'display';

_ext.init();
display.init();

  var dataObjectToParse = JSON.stringify({
            "serverDayStart": "2015-08-31 00:00:00",
            "browsers": {
                "fromDateTime": "2015-08-29 00:00:00",
                "toDateTime": "2016-08-30 00:00:00",
                "Data": [
                    [
                        {
                            "Name": "Internet Explorer",
                            "Count": 10
                        },
                        {
                            "Name": "Firefox",
                            "Count": 54
                        },
                        {
                            "Name": "Opera",
                            "Count": 78
                        }
                    ],
                    [
                        {
                            "Name": "Safari",
                            "Count": 22
                        },
                        {
                            "Name": "Chrome",
                            "Count": 134
                        },
                        {
                            "Name": "Internet Explorer",
                            "Count": 12
                        }
                    ]
                ]
            },
            "systems": {
                "fromDateTime": "2015-08-29 00:00:00",
                "toDateTime": "2016-08-30 00:00:00",
                "Data": [
                    [
                        {
                            "Name": "Windows XP",
                            "Count": 10
                        },
                        {
                            "Name": "Windows 8.1",
                            "Count": 54
                        },
                        {
                            "Name": "Windows 7",
                            "Count": 78
                        }
                    ],
                    [
                        {
                            "Name": "Windows 10",
                            "Count": 22
                        },
                        {
                            "Name": "Windows XP",
                            "Count": 134
                        },
                        {
                            "Name": "Windows 8",
                            "Count": 12
                        }
                    ]
                ]
            },
            "countries": {
                "fromDateTime": "2015-08-29 00:00:00",
                "toDateTime": "2016-08-30 00:00:00",
                "Data": [
                    [
                        {
                            "Name": "Czech Republic",
                            "Count": 10
                        },
                        {
                            "Name": "United States Of America",
                            "Count": 54
                        },
                        {
                            "Name": "Venezuela",
                            "Count": 78
                        }
                    ],
                    [
                        {
                            "Name": "Bulgaria",
                            "Count": 222
                        },
                        {
                            "Name": "Russia",
                            "Count": 134
                        },
                        {
                            "Name": "Romania",
                            "Count": 123
                        }
                    ]
                ]
            }
        });

display.drawPieChart("#pie-chart-browsers","browsers", JSON.parse(dataObjectToParse).browsers);
display.drawPieChart("#pie-chart-systems","Systems", JSON.parse(dataObjectToParse).systems);
display.drawPieChart("#pie-chart-countries","Countries", JSON.parse(dataObjectToParse).countries);
display.drawBarChart("#bar-chart-countries","Countries", JSON.parse(dataObjectToParse).countries);

