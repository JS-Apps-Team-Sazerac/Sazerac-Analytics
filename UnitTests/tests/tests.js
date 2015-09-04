var expect = require('chai').expect;
var jq = require('jquery');
var sinon = require('sinon');
var system = require('system');
//var parse = require('../../app/parse')();
import parse from '../../app/parse';

var dataObjectToParse = JSON.stringify({
    serverDayStart: "2015-08-31 00:00:00",
    browsers: {
        fromDateTime: "2015-08-29 00:00:00",
        toDateTime: "2016-08-30 00:00:00",
        Data: [
            [
                {
                    Name: "Internet Explorer",
                    Count: 10
                },
                {
                    Name: "Firefox",
                    Count: 54
                },
                {
                    Name: "Opera",
                    Count: 78
                }
            ],
            [
                {
                    Name: "Safari",
                    Count: 22
                },
                {
                    Name: "Chrome",
                    Count: 134
                },
                {
                    Name: "Internet Explorer",
                    Count: 12
                }
            ]
        ]
    },
    systems: {
        fromDateTime: "2015-08-29 00:00:00",
        toDateTime: "2016-08-30 00:00:00",
        Data: [
            [
                {
                    Name: "Windows XP",
                    Count: 10
                },
                {
                    Name: "Windows 8.1",
                    Count: 54
                },
                {
                    Name: "Windows 7",
                    Count: 78
                }
            ],
            [
                {
                    Name: "Windows 10",
                    Count: 22
                },
                {
                    Name: "Windows XP",
                    Count: 134
                },
                {
                    Name: "Windows 8",
                    Count: 12
                }
            ]
        ]
    },
    countries: {
        fromDateTime: "2015-08-29 00:00:00",
        toDateTime: "2016-08-30 00:00:00",
        Data: [
            [
                {
                    Name: "Czech Republic",
                    Count: 10
                },
                {
                    Name: "United States Of America",
                    Count: 54
                },
                {
                    Name: "Venezuela",
                    Count: 78
                }
            ],
            [
                {
                    Name: "Bulgaria",
                    Count: 222
                },
                {
                    Name: "Russia",
                    Count: 134
                },
                {
                    Name: "Romania",
                    Count: 123
                }
            ]
        ]
    }
})

describe('preparePieChart Tests', function () {
    
    it('expect preparePieChart to give correct result with browsers test data', function () {
        var expectedResult = JSON.stringify({
            theme:"office365",
            title:{
                text:"Browsers data\n2015-08-29 - 2016-08-30"
            },
            legend:{
                position:"bottom"
            },
            seriesDefaults:{
                labels:{
                    visible:true,
                    format:"{0}%"
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
        expect(result).to.equal(expectedResult);
    });
    it('expect preparePieChart to give correct result with systems test data', function () {
        var expectedResult = JSON.stringify({
            theme:"office365",
            title:{
                text:"Systems data\n2015-08-29 - 2016-08-30"
            },
            legend:{
                position:"bottom"
            },
            seriesDefaults:{
                labels:{
                    visible:true,
                    format:"{0}%"
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
      category:"Windows XP",
      value:46
  },
  {
      category:"Windows 7",
      value:25
  },
  {
      category:"Windows 8.1",
      value:17
  },
  {
      category:"Windows 10",
      value:7
  },
  {
      category:"Windows 8",
      value:4
  }
                   ]
               }
            ]
        });

        var result = JSON.stringify(parse.preparePieChart("Systems", "office365", JSON.parse(dataObjectToParse).systems));
        expect(result).to.equal(expectedResult);
    });
    it('expect preparePieChart to give correct result with countries test data', function () {
        var expectedResult = JSON.stringify({
            theme:"office365",
            title:{
                text:"Countries data\n2015-08-29 - 2016-08-30"
            },
            legend:{
                position:"bottom"
            },
            seriesDefaults:{
                labels:{
                    visible:true,
                    format:"{0}%"
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
      category:"Bulgaria",
      value:36
  },
  {
      category:"Russia",
      value:22
  },
  {
      category:"Romania",
      value:20
  },
  {
      category:"Venezuela",
      value:13
  },
  {
      category:"United States Of America",
      value:9
  },
  {
      category:"Czech Republic",
      value:2
  }
                   ]
               }
            ]
        });

        var result = JSON.stringify(parse.preparePieChart("Countries", "office365", JSON.parse(dataObjectToParse).countries));
        expect(result).to.equal(expectedResult);
    });

});

describe('prepareBarChart Tests', function () {

    it('expect prepareBarChart to give correct result with browsers test data', function () {
        var expectedResult = JSON.stringify({
            theme:"office365",
            title:{
                text:"Browsers data\n2015-08-29 - 2016-08-30"
            },
            legend:{
                position:"bottom"
            },
            seriesDefaults:{
                type:"column",
                stack:false
            },
            series:[{
                name:"Chrome",
                data:[0,134]
            },{
                name:"Firefox",
                data:[54,0]
            },{
                name:"Internet Explorer",
                data:[10,12]
            },{
                name:"Opera",
                data:[78,0]
            },{
                name:"Safari",
                data:[0,22]
            }],
            valueAxis:{
                line:{
                    visible:false
                }
            },
            categoryAxis:{
                categories:["2015-08-29","2015-08-30"],
                majorGridLines:{
                    visible:false
                }
            },
            tooltip:{
                visible:true,
                format:"{0}"
            }
        });

        var result = JSON.stringify(parse.prepareBarChart("Browsers", "office365", JSON.parse(dataObjectToParse).browsers));
        //console.log(result);
        expect(result).to.equal(expectedResult);
    });
    it('expect prepareBarChart to give correct result with systems test data', function () {
        var expectedResult = JSON.stringify({
            theme:"office365",
            title:{
                text:"Systems data\n2015-08-29 - 2016-08-30"
            },
            legend:{
                position:"bottom"
            },
            seriesDefaults:{
                type:"column",
                stack:false
            },
            series:[
                {
                    name:"Windows 10",
                    data:[0,22]
                },
                {
                    name:"Windows 7",
                    data:[78,0]
                },
                {
                    name:"Windows 8",
                    data:[0,12]
                },
                {
                    name:"Windows 8.1",
                    data:[54,0]
                },
                {
                    name:"Windows XP",
                    data:[10,134]
                }
            ],
            valueAxis:{
                line:{
                    visible:false
                }
            },
            categoryAxis:{
                categories:["2015-08-29","2015-08-30"                ],
                majorGridLines:{
                    visible:false
                }
            },
            tooltip:{
                visible:true,
                format:"{0}"
            }
        });

        var result = JSON.stringify(parse.prepareBarChart("Systems", "office365", JSON.parse(dataObjectToParse).systems));
        expect(result).to.equal(expectedResult);
    });
    it('expect prepareBarChart to give correct result with countries test data', function () {
        var expectedResult = JSON.stringify({
            theme:"office365",
            title:{
                text:"Countries data\n2015-08-29 - 2016-08-30"
            },
            legend:{
                position:"bottom"
            },
            seriesDefaults:{
                type:"column",
                stack:false
            },
            series:[
                {
                    name:"Bulgaria",
                    data:[0,222]
                },
                {
                    name:"Czech Republic",
                    data:[10,0]
                },
                {
                    name:"Romania",
                    data:[0,123]
                },
                {
                    name:"Russia",
                    data:[0,134]
                },
                {
                    name:"United States Of America",
                    data:[54,0]
                },
                {
                    name:"Venezuela",
                    data:[78,0]
                }
            ],
            valueAxis:{
                line:{
                    visible:false
                }
            },
            categoryAxis:{
                categories:["2015-08-29","2015-08-30"        ],
                majorGridLines:{
                    visible:false
                }
            },
            tooltip:{
                visible:true,
                format:"{0}"
            }
        });

        var result = JSON.stringify(parse.prepareBarChart("Countries", "office365", JSON.parse(dataObjectToParse).countries));
        expect(result).to.equal(expectedResult);
    });
    
});