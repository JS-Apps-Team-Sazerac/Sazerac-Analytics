import $ from 'jquery';
import kendo from 'kendo';
import themeScripts from 'themeScripts';
import parse from 'parse';
import db from 'db';

function drawPieChart(divElementID, dataTitle, inputData) {
    $(divElementID).kendoChart(parse.preparePieChart(dataTitle, "office365", inputData));
};

function drawBarChart(divElementID, dataTitle, inputData) {
    $(divElementID).kendoChart(parse.prepareBarChart(dataTitle, "office365", inputData));
};

function updateTemplatesData(){
    db.query(["browser", "system", "country"], "2015-09-01 00:00:00", "2015-09-01 00:00:00")
                .then(function(response) {
                    drawPieChart("#pie-chart-browsers","Browsers", response.browser);
                    drawPieChart("#pie-chart-systems","Systems", response.system);
                    drawPieChart("#pie-chart-countries","Countries", response.country);
                    drawBarChart("#bar-chart-browsers","Browsers", response.browser);
                    drawBarChart("#bar-chart-systems","Systems", response.system);
                    drawBarChart("#bar-chart-countries","Countries", response.country);
                }, function(response) {
                    console.log("Error boy.");
                    console.log(response);
                });
}

function initKendoDatePicker(){
    $('#start-date').kendoDatePicker();
    $('#end-date').kendoDatePicker();
}

function init() {

    $(document).ready(function () {
        displayTemplate();
        initKendoDatePicker();
    });
}

function displayTemplate() {

    var template_url = location.hash.replace(/^#/, '');

    if (template_url.length < 1) {
        template_url = 'templates/browsers.html';
    }

    $('.show-sidebar').on('click', function (e) {
        e.preventDefault();
        $('div#main').toggleClass('sidebar-show');
    });


    themeScripts.LoadAjaxContent(template_url);
    updateTemplatesData();    

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
        }
        else {
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

            if ($(this).hasClass('add-full')) {
                $('#content').addClass('full-content');
            }
            else {
                $('#content').removeClass('full-content');
            }

            var url = $(this).attr('href');

            window.location.hash = url;

            themeScripts.LoadAjaxContent(url);
            
            ////
            ////  here put for templates
            ////
            updateTemplatesData();
                
            ////
        }
        if ($(this).attr('href') == '#') {
            e.preventDefault();
        }
    });
}

export default{ init, drawPieChart, drawBarChart};