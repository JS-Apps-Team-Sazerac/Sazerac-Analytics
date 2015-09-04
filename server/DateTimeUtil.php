<?php

include_once "IDateTimeUtil.php";

class DateTimeUtil implements IDateTimeUtil
{
	private $timeNow;
	
	function __construct($timeNow) {
		$this->timeNow = $timeNow;
	}
	
	function getTimeNow() {
		return date('Y-m-d H:i:s', $this->timeNow);
	}
	
	function getTimeNowSubstractHours($hours) {
		return date('Y-m-d H:i:s', $this->timeNow - ($hours * 3600)); 
	}
	
	function timeAddHours($time, $hours) {
		return date('Y-m-d H:i:s', $this->timeNow + ($hours * 3600)); 
	}
	
	function timestampToDateTime($timestamp) {
		return date('Y-m-d H:i:s', $timestamp);
	}
	
	function timestampToEndDateTime($timestamp) {
		return str_replace(date('H:i:s', $timestamp), '23:59:59', date('Y-m-d H:i:s', $timestamp));
	}
	
	function timestampAddHours($timestamp, $hours) {
		return $timestamp + ($hours * 3600);
	}
	
	function getDayStart() {
		return $this->replaceDateTimeHoursMinSeconds('00:00:00');
	}
	
	function getDayEnd() {
		return $this->replaceDateTimeHoursMinSeconds('23:59:59');
	}
	
	function compareDateTime($firstDateTime, $secondDateTime) {
		
		$firstDateTime = strtotime($firstDateTime);
		$secondDateTime = strtotime($secondDateTime);
		
		if($firstDateTime < $secondDateTime) {
			return 1;
		} else if($secondDateTime < $firstDateTime) {
			return -1;
		} else {
			return 0;
		}
	}
	
	private function replaceDateTimeHoursMinSeconds($valueToSet) {
		return str_replace(date('H:i:s', $this->timeNow), $valueToSet, date('Y-m-d H:i:s', $this->timeNow));
	}
}

?>