function display(divElementID) {
    function pieChart(dataType, inputData) {
        $(divElementID).kendoChart(
            parse().pieChart(dataType, inputData));
    };

    return {
        pieChart: pieChart
    }
};
