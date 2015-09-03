var expect = require('chai').expect;
var jq = require('jquery');
var sinon = require('sinon');
var system = require('system');
//var parse = require('../../app/parse')();
import parse from '../../app/parse';


describe('preparePieChart Tests', function () {

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
    })

    
    it('expect preparePieChart to give correct result with browsers test data', function () {
        var expectedResult = JSON.stringify({
            theme:"office365",
            title:{
                "text":"Browsers data\n2015-08-29 - 2016-08-30"
            },
            legend:{
                position:"bottom"
            },
            seriesDefaults:{
                labels:{
                    "visible":true,
                    "format":"{0}%"
                }
            },
            series:[
               {
                   type:"pie",
                   overlay:{
                       gradient:"roundedBevel"
                   },
                   data:[
                      {
                          category:"Chrome",
                          value:43
                      },
                      {
                          category:"Opera",
                          value:25
                      },
                      {
                          category:"Firefox",
                          value:17
                      },
                      {
                          category:"Internet Explorer",
                          value:7
                      },
                      {
                          category:"Safari",
                          value:7
                      }
                   ]
               }
            ]
        });

        var result = JSON.stringify(parse.preparePieChart("Browsers", "office365", JSON.parse(dataObjectToParse).browsers));
        //console.log(result);
        expect(result).to.equal(expectedResult);
    });

});