import $ from 'jquery';
import kendo from 'kendo';
import heatmap from 'heatmap';
import themeScripts from 'themeScripts';
import parse from 'parse';

var currentDataToDisplay;

function init(dataToDisplay, datePickerInputHandler, error) {

    $(document).ready(function () {
        currentDataToDisplay = dataToDisplay;
        displayTemplate(error);
        initKendoDatePicker(datePickerInputHandler);
    });
}

function initKendoDatePicker(datePickerInputHandler) {

    var fromDate, toDate, format = { format: 'yyyy-MM-dd' }, hoursMinsSeconds = ' 00:00:00',
        startDatePickerId = '#start-date', endDatePickerId = '#end-date',
        datePickerSubmitId = '#date-submit', formDatePickerId = '#date-picker';

    $(startDatePickerId).kendoDatePicker(format);
    $(endDatePickerId).kendoDatePicker(format);
    
    // validate startDate < endDate
    var container = $(formDatePickerId);
    kendo.init(container);
    container.kendoValidator({
        rules: {
            greaterdate: function (input) {
                if (input.is("[data-greaterdate-msg]") && input.val() != "") {                                    
                    var date = kendo.parseDate(input.val()),
                        otherDate = kendo.parseDate($("[name='" + input.data("greaterdateField") + "']").val());
                    return otherDate == null || otherDate.getTime() < date.getTime();
                }

                return true;
            }
        }
    });
    
    $(datePickerSubmitId).on('click', function(e) {
        
        var validator = $(formDatePickerId).data("kendoValidator");

        if (!validator.validate()) {
            alert("Invalid date interval !");
        }

        fromDate = $(startDatePickerId).val();
        // if(fromDate.length === 0) {
        //     alert("Please select start date.");
        //     return false;
        // }
        fromDate += hoursMinsSeconds;

        toDate = $(endDatePickerId).val();
        // if(toDate.length === 0) {
        //     alert("Please select end date.");
        //     return false;
        // }
        toDate += hoursMinsSeconds;

        datePickerInputHandler(fromDate, toDate);

        e.preventDefault();
    });
}

function drawPieChart(divElementID, dataTitle, inputData) {
    $(divElementID).kendoChart(parse.preparePieChart(dataTitle, "office365", inputData));
};

function drawBarChart(divElementID, dataTitle, inputData) {
    $(divElementID).kendoChart(parse.prepareBarChart(dataTitle, "office365", inputData));
};

function updateTemplatesData(data) {

    currentDataToDisplay = data;

    drawPieChart("#pie-chart-browsers","Browsers", data.browser);
    drawPieChart("#pie-chart-systems","Systems", data.system);
    drawPieChart("#pie-chart-countries","Countries", data.country);
    drawPieChart("#pie-chart-referrers","Referrers", data.referrer);

    drawBarChart("#bar-chart-browsers","Browsers", data.browser);
    drawBarChart("#bar-chart-systems","Systems", data.system);
    drawBarChart("#bar-chart-countries","Countries", data.country);
    drawBarChart("#bar-chart-referrers","Referrers", data.referrer);
}

function displayClicksTemplate(clicksData) {

    var heatmapConfig, heatmapPreparedData, heatmapDataPoint, heatmapView,
    heatmapFrame, clicksData, clickX, clickY;
    
    heatmapFrame = $('#heatmapFrame');
    
    heatmapConfig = {
        container: document.getElementById('heatmapArea'),
        radius: 10,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
    };
    
    heatmapView = heatmap.create(heatmapConfig);
    
    heatmapPreparedData = {
        max: 1,
        min: 0,
        data: []
    };
    
    clicksData.forEach(function(clickData) {
    
		clickX = parseFloat(clickData.x) / 100;
		clickY = parseFloat(clickData.y) / 100;
		
		clickX *= heatmapFrame.contents().find(clickData.path).outerWidth();
		clickY *= heatmapFrame.contents().find(clickData.path).outerHeight();
		
		clickX += heatmapFrame.contents().find(clickData.path).offset().left;
		clickY += heatmapFrame.contents().find(clickData.path).offset().top;
		
		heatmapDataPoint = { 
			x: clickX,
			y: clickY,
			value: 100
		};
		
		heatmapPreparedData.max++;
		heatmapPreparedData.data.push(heatmapDataPoint);
    
    });
    
    heatmapView.setData(heatmapPreparedData);
}

function displayTemplate(error) {

    var template_url;

    if(error === true) {

        template_url = 'templates/error.html';

    } else {

        template_url = location.hash.replace(/^#/, '');

        if (template_url.length < 1) {
            template_url = 'templates/browsers.html';
        }
    }

    $('.show-sidebar').on('click', function (e) {
        e.preventDefault();
        $('div#main').toggleClass('sidebar-show');
    });


    themeScripts.LoadAjaxContent(template_url);

    if(typeof currentDataToDisplay !== 'undefined') {
        updateTemplatesData(currentDataToDisplay);  
    }

    $('.main-menu').on('click', 'a', function (e) {
        var parents = $(this).parents('li');
        var li = $(this).closest('li.dropdown');
        var another_items = $('.main-menu li').not(parents);
        another_items.find('a').removeClass('active');
        another_items.find('a').removeClass('active-parent');
        if ($(this).hasClass('dropdown-toggle') || $(this).closest('li').find('ul').length == 0) {
            $(this).addClass('active-parent');

            var current = $(this).next();

            if (current.is(':visible')) {
                li.find("ul.dropdown-menu").slideUp('fast');
                li.find("ul.dropdown-menu a").removeClass('active')
            }
            else {
                another_items.find("ul.dropdown-menu").slideUp('fast');
                current.slideDown('fast');
            }
        } else {
            if (li.find('a.dropdown-toggle').hasClass('active-parent')) {

                var pre = $(this).closest('ul.dropdown-menu');

                pre.find("li.dropdown").not($(this).closest('li'))
                    .find('ul.dropdown-menu').slideUp('fast');
            }
        }
        if ($(this).hasClass('active') == false) {
            $(this).parents("ul.dropdown-menu").find('a').removeClass('active');
            $(this).addClass('active')
        }

        if ($(this).hasClass('ajax-link')) {
            e.preventDefault();

            if(typeof currentDataToDisplay !== 'undefined') {

                if ($(this).hasClass('add-full')) {
                    $('#content').addClass('full-content');
                } else {
                    $('#content').removeClass('full-content');
                }

                var url = $(this).attr('href');
                window.location.hash = url;
                themeScripts.LoadAjaxContent(url);

                updateTemplatesData(currentDataToDisplay);
            }
        }

        if ($(this).attr('href') == '#') {
            e.preventDefault();
        }
    });
}

export default{ init, updateTemplatesData, displayClicksTemplate };