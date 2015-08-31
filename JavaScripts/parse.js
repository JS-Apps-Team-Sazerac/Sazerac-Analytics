function parse() {
    function pieChart(title, inputData) {

        var objData = {
            title: {
                text: title + ' data \r\n[from: ' + inputData.fromDateTime + '; to: ' + inputData.toDateTime + ']'
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    format: "{0}%"
                }
            },
            series: [{
                type: "pie",
                data: []
            }]
        };


        var dataSum = 0;
        inputData.Data.forEach(function (dataObject) {
            var i, j, dataObjectLen, outputSeriesDataLen, isAdded;
            for (i = 0, dataObjectLen = dataObject.length; i < dataObjectLen; i += 1) {
                isAdded = false;
                for (j = 0, outputSeriesDataLen = objData.series[0].data.length; j < outputSeriesDataLen; j++) {
                    if (dataObject[i].Name === objData.series[0].data[j].category) {
                        objData.series[0].data[j].value += dataObject[i].Count;
                        dataSum += dataObject[i].Count;
                        isAdded = true;
                        break;
                    }
                }
                if (!isAdded) {
                    objData.series[0].data.push({
                        category: dataObject[i].Name,
                        value: dataObject[i].Count
                    });
                    dataSum += dataObject[i].Count;
                }
            }
        });

        //converting value(clicks) to value(%)
        var i, len;
        for (i = 0, len = objData.series[0].data.length; i < len; i++) {
            objData.series[0].data[i].value = Math.floor((objData.series[0].data[i].value / dataSum) * 100);
        }

        //sorting by value
        objData.series[0].data.sort(function (firstDataEl, secondDataEl) {
            return secondDataEl.value - firstDataEl.value;
        })

        var outputData = {
            title: {
                text: "Break-up of Spain Electricity Production for 2008"
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    format: "{0}%"
                }
            },
            series: [{
                type: "pie",
                data: [{
                    category: "Hydro",
                    value: 22
                }, {
                    category: "Solar",
                    value: 2
                }, {
                    category: "Nuclear",
                    value: 49
                }, {
                    category: "Wind",
                    value: 27
                }]
            }]

        }

        console.log(outputData.series);
        console.log(objData.series);
        return objData;
    }

    return {
        pieChart: pieChart
    }
};