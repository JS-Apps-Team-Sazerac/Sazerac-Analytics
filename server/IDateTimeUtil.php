<?php

interface IDateTimeUtil
{
	public function getTimeNowSubstractHours($hours);
	public function getDayStart();
	public function getDayEnd();
	public function compareDateTime($firstDateTime, $secondDateTime);
	public function timestampToDateTime($timestamp);
	public function timeAddHours($time, $hours);
	function timestampAddHours($timestamp, $hours);
	function timestampToEndDateTime($timestamp);
}

?>