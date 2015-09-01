function preparePieChart(title, inputData, theme) {
    var outputData = {
        theme: theme,
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

    //sorting by value
    outputData.series[0].data.sort(function (firstDataEl, secondDataEl) {
        return secondDataEl.value - firstDataEl.value;
    })

    return outputData;
}

export default{ preparePieChart };