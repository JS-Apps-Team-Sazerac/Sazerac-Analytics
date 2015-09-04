<?php

include_once "IDateTimeUtil.php";

class VisitorMysqlController
{
	private $mysqlDbName;
	private $dateTimeUtil;
	private $timeNow;
	private $link;
	
	function __construct($mysqlDbName, $link, IDateTimeUtil $dateTimeUtil) {
		
		$this->mysqlDbName = $mysqlDbName; 
		$this->dateTimeUtil = $dateTimeUtil;
		$this->timeNow = $dateTimeUtil->getTimeNow();
		$this->link = $link;
	}

	function isTodayVisitor($visitorInfo) {
	
		$uid = $visitorInfo["UID"];
		$visitorTimeDelta = $this->dateTimeUtil->getTimeNowSubstractHours(24);
		
		$query = $this->link->prepare("SELECT * FROM `$this->mysqlDbName`.`visitors` WHERE `UID` = ? AND `LastVisit` >= ?");
		$query->bind_param('ss', $uid, $visitorTimeDelta);
		$query->execute();
		$query->store_result();

		$isExisting = false;
		if($query->num_rows > 0) {
			$isExisting = true;
		}
		
		$query->close();
		
		return $isExisting;
	}
		
	function updateVisitor($visitorInfo) {
	
		$update = $this->link->prepare("UPDATE `visitors` SET `PageViews` = PageViews + 1  WHERE `UID` = ? AND `LastVisit` >= ?");
		$update->bind_param('ss', $visitorInfo["UID"], $this->dateTimeUtil->getTimeNowSubstractHours(24));
		$update->execute();
		$update->close();
	}

	function addVisitor($visitorInfo) {

		$defaultPageViews = 1;
		
		$insert = $this->link->prepare("INSERT INTO `$this->mysqlDbName`.`visitors` (`UID`, `country`, `referrer`, `browser`, `system`, `PageViews`, `LastVisit`) VALUES(?, ?, ?, ?, ?, ?, ?)");
		$insert->bind_param('sssssds', $visitorInfo["UID"], $visitorInfo["Country"], $visitorInfo["Referrer"], $visitorInfo["BrowserName"], $visitorInfo["OSName"], $defaultPageViews, $this->timeNow);
		$insert->execute();
		$insert->close();
	}
	
	function addClick($clickInfo) {
		
		$insert = $this->link->prepare("INSERT INTO `$this->mysqlDbName`.`clicks` (`UID`, `Path`, `X`, `Y`, `ClickTime`) VALUES(?, ?, ?, ?, ?)");
		$insert->bind_param('sssss', $clickInfo["UID"], $clickInfo["Path"], $clickInfo["X"], $clickInfo["Y"], $this->timeNow);
		$insert->execute();
		$insert->close();
	}
}
?>