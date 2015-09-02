
import $ from 'jquery';
import _ from 'underscore';
import _ext from 'underscoreExt';
import db from 'db';
import display from 'display';

_ext.init();
db.init('http://avalkov.com/vsa/server/info.php?app=');
display.init();
