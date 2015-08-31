function display(divElementID) {
    function pieChart(dataType, inputData) {
        $(divElementID).kendoChart(
            parse().pieChart(dataType, inputData, "office365"));
    };

    return {
        pieChart: pieChart
    }
};
