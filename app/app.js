/// <reference path="../lib/jquery-2.1.4.js" />

'use strict'

import $ from 'jquery';

$(document).ready(function () {

    $('.show-sidebar').on('click', function (e) {
        e.preventDefault();
        $('div#main').toggleClass('sidebar-show');
    });
      

    
});