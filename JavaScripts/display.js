function display(divElementID) {
    function pieChart(inputData) {
        $(divElementID).kendoChart(
            parse().pieChart(inputData) );
    }

    return {
        pieChart: pieChart
    }
};
