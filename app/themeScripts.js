
/// <reference path="../lib/$-2.1.4.js" />

'use strict'

import $ from 'jquery';

//
//  Function for load content from url and put in $('.ajax-content') block
//
function LoadAjaxContent( url ) {
    $( '.preloader' ).show();
    $.ajax( {
        mimeType: 'text/html; charset=utf-8', // ! Need set mimeType only when run from local file
        url: url,
        type: 'GET',
        success: function ( data ) {
            $( '#ajax-content' ).html( data );
            $( '.preloader' ).hide();
        },
        error: function ( jqXHR, textStatus, errorThrown ) {
            alert( errorThrown );
        },
        dataType: "html",
        async: false
    } );
}

//
//  Function maked all .box selector is draggable, to disable for concrete element add class .no-drop
//
function WinMove() { 
    $( "div.box" ).not( '.no-drop' )
		.draggable( {
		    revert: true,
		    zIndex: 2000,
		    cursor: "crosshair",
		    handle: '.box-name',
		    opacity: 0.8
		} )
		.droppable( {
		    tolerance: 'pointer',
		    drop: function ( event, ui ) {
		        var draggable = ui.draggable;
		        var droppable = $( this );
		        var dragPos = draggable.position();
		        var dropPos = droppable.position();
		        draggable.swap( droppable );
		        setTimeout( function () {
		            var dropmap = droppable.find( '[id^=map-]' );
		            var dragmap = draggable.find( '[id^=map-]' );
		            if ( dragmap.length > 0 || dropmap.length > 0 ) {
		                dragmap.resize();
		                dropmap.resize();
		            }
		            else {
		                draggable.resize();
		                droppable.resize();
		            }
		        }, 50 );
		        setTimeout( function () {
		            draggable.find( '[id^=map-]' ).resize();
		            droppable.find( '[id^=map-]' ).resize();
		        }, 250 );
		    }
		} );
}

//
// Swap 2 elements on page. Used by WinMove function
//
$.fn.swap = function(b){
    b = $(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};

//
// Helper for draw Google Chart
//
function DrawGoogleChart(chart_data, chart_options, element, chart_type) {
    // Function for visualize Google Chart
    var data = google.visualization.arrayToDataTable(chart_data);
    var chart = new chart_type(document.getElementById(element));
    chart.draw(data, chart_options);
}

//
//  Function set min-height of window (required for this theme)
//
function SetMinBlockHeight(elem){
    elem.css('min-height', window.innerHeight - 49)
}

//
// Function for change panels of Dashboard
//
function DashboardTabChecker(){
    $('#content').on('click', 'a.tab-link', function(e){
        e.preventDefault();
        $('div#dashboard_tabs').find('div[id^=dashboard]').each(function(){
            $(this).css('visibility', 'hidden').css('position', 'absolute');
        });
        var attr = $(this).attr('id');
        $('#'+'dashboard-'+attr).css('visibility', 'visible').css('position', 'relative');
        $(this).closest('.nav').find('li').removeClass('active');
        $(this).closest('li').addClass('active');
    });
}

//
// Beauty Hover Plugin (backlight row and col when cell in mouseover)
//
//
(function( $ ){
    $.fn.beautyHover = function() {
        var table = this;
        table.on('mouseover','td', function() {
            var idx = $(this).index();
            var rows = $(this).closest('table').find('tr');
            rows.each(function(){
                $(this).find('td:eq('+idx+')').addClass('beauty-hover');
            });
        })
		.on('mouseleave','td', function(e) {
		    var idx = $(this).index();
		    var rows = $(this).closest('table').find('tr');
		    rows.each(function(){
		        $(this).find('td:eq('+idx+')').removeClass('beauty-hover');
		    });
		});
    };
})( $ );

//
//  Function convert values of inputs in table to JSON data
//
//
function Table2Json(table) {
    var result = {};
    table.find("tr").each(function () {
        var oneRow = [];
        var varname = $(this).index();
        $("td", this).each(function (index) { if (index != 0) {oneRow.push($("input", this).val());}});
        result[varname] = oneRow;
    });
    var result_json = JSON.stringify(result);
    OpenModalBox('Table to JSON values', result_json);
}

function LoadGoogleApi(){
    // Load Google Chart API and callback to draw test graphs
    $.getScript('http://www.google.com/jsapi?autoload={%22modules%22%3A[{%22name%22%3A%22visualization%22%2C%22version%22%3A%221%22%2C%22packages%22%3A[%22corechart%22%2C%22geochart%22]%2C%22callback%22%3A%22DrawAllCharts%22}]}');
    // This need for correct resize charts, when box open or drag
    var graphxChartsResize;
    $(".box").resize(function(event){
        event.preventDefault();
        clearTimeout(graphxChartsResize);
        graphxChartsResize = setTimeout(DrawAllCharts, 200);
    });
    // Add Drag-n-Drop action for .box
    WinMove();
}

export default { LoadAjaxContent, WinMove, DrawGoogleChart, 
        SetMinBlockHeight, DashboardTabChecker, Table2Json, LoadGoogleApi };