function parse() {
    function pieChart(inputData) {

        //inputData -> output data
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

        return outputData;
    }

    return {
        pieChart: pieChart
    }
};