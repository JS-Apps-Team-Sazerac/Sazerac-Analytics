<?php

interface IDateTimeUtil
{
	public function getTimeNowSubstractHours($hours);
	public function getDayStart();
	public function getDayEnd();
	public function compareDateTime($firstDateTime, $secondDateTime);
}

?>