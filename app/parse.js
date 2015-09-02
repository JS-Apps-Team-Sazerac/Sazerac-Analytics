function preparePieChart(title, theme, inputData) {
    var titleAddon = _datesToDateObject(inputData.fromDateTime,inputData.toDateTime).titleAddon;
    var outputData = {
        theme: theme,
        title: {
            text: title + titleAddon
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
        //seriesColors: ["#03a9f4", "#ff9800", "#fad84a", "#4caf50"],
        series: [{
            type: "pie",
            overlay: {
                gradient: "roundedBevel"
            },
            data: []
        }]
    };


    var dataSum = 0;
    inputData.Data.forEach(function (dataObject) {
        var i, j, dataObjectLen, outputSeriesDataLen, isAdded;
        for (i = 0, dataObjectLen = dataObject.length; i < dataObjectLen; i += 1) {
            isAdded = false;
            for (j = 0, outputSeriesDataLen = outputData.series[0].data.length; j < outputSeriesDataLen; j++) {
                if (dataObject[i].Name === outputData.series[0].data[j].category) {
                    outputData.series[0].data[j].value += dataObject[i].Count;
                    dataSum += dataObject[i].Count;
                    isAdded = true;
                    break;
                }
            }
            if (!isAdded) {
                outputData.series[0].data.push({
                    category: dataObject[i].Name,
                    value: dataObject[i].Count
                });
                dataSum += dataObject[i].Count;
            }
        }
    });

    //converting value(clicks) to value(%)
    var i, len;
    for (i = 0, len = outputData.series[0].data.length; i < len; i++) {
        outputData.series[0].data[i].value = Math.round((outputData.series[0].data[i].value / dataSum) * 100);
    }

    outputData.series[0].data.sort(function (firstDataEl, secondDataEl) {
        return secondDataEl.value - firstDataEl.value;
    })

    return outputData;
}

function prepareBarChart(title, theme, inputData) {
    var titleAddon = _datesToDateObject(inputData.fromDateTime,inputData.toDateTime).titleAddon;
    var outputData = {
        theme: theme,
        title: {
            text: title + titleAddon
        },
        legend: {
            position: "bottom"
        },
        seriesDefaults: {
            type: "column",
            stack: false
        },
        series: [],
        valueAxis: {
            line: {
                visible: false
            }
        },
        categoryAxis: {
            categories: [],
            majorGridLines: {
                visible: false
            }
        },
        tooltip: {
            visible: true,
            format: "{0}"
        }
    }
    

    var date = _datesToDateObject(inputData.fromDateTime,inputData.toDateTime).dateFrom;
    var names = [];
    inputData.Data.forEach(function (dataObject,dataIndex) {
        {
            if (isNaN(date)) {
                outputData.categoryAxis.categories.push('Day '+ (dataIndex + 1));
            }else {
                outputData.categoryAxis.categories.push(date.toLocaleDateString());
                date.setDate(date.getDate()+1);
            }
        }

        var i, dataObjectLen;
        for (i = 0, dataObjectLen = dataObject.length; i < dataObjectLen; i += 1) {
            if (names.indexOf(dataObject[i].Name) < 0) {
                names.push(dataObject[i].Name);
            }
        }
    });
    names = names.sort();
    names.forEach(function (name) {
        outputData.series.push({
            name: name,
            data: []
        });
    })

    outputData.series.forEach(function (nameObj) {
        inputData.Data.forEach(function (dataObject) {
            var i, dataObjectLen, added = false;
            for (i = 0, dataObjectLen = dataObject.length; i < dataObjectLen; i += 1) {
                if (nameObj.name === dataObject[i].Name) {
                    nameObj.data.push(dataObject[i].Count);
                    added = true;
                    break;
                }
            }
            if (!added) {
                nameObj.data.push(0);
            }
        });
    })

    return outputData;
}

function _datesToDateObject(dateFrom,dateTo){
    var dates ={
        from: new Date(dateFrom),
        to: new Date(dateTo),
    }
    var titleAddon;
    if (isNaN(dates.from)||isNaN(dates.to)) {
        titleAddon = ' data\n' + dateFrom + ' - ' + dateTo;
    }else {
        titleAddon= ' data\n' + dates.from.toLocaleDateString() + ' - ' + dates.to.toLocaleDateString();
    }
    return {
        titleAddon: titleAddon,
        dateFrom: dates.from,
        dateTo: dates.to
    };
}

export default{preparePieChart, prepareBarChart };