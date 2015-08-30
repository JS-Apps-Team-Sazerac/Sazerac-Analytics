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

	function isExistingVisitor($visitorInfo) {
	
		$uid = $visitorInfo["UID"];
		
		$query = $this->link->prepare("SELECT * FROM `$this->mysqlDbName`.`visitors` WHERE `UID` = ?");
		$query->bind_param('s', $uid);
		$query->execute();
		$query->store_result();

		$isExisting = false;
		if($query->num_rows > 0) {
			$isExisting = true;
		}
		
		$query->close();
		
		return $isExisting;
	}
	
	function isUniqueVisitor($visitorInfo) {
		
		$uid = $visitorInfo["UID"];
		$visitorTimeDelta = $this->dateTimeUtil->getTimeNowSubstractHours(24);
		
		$query = $this->link->prepare("SELECT `LastVisit` FROM `$this->mysqlDbName`.`visitors` WHERE `UID` = ?");
		$query->bind_param('s', $uid);
		$query->execute();
		$query->bind_result($lastVisit);
		$query->fetch();
		$query->close();
		
		$isUnique = false;
		if($this->dateTimeUtil->compareDateTime($lastVisit, $visitorTimeDelta) == 1) {
			$isUnique = true;
		}
		
		return $isUnique;
	}
	
	function addVisitor($visitorInfo) {
		
		$uid = $visitorInfo["UID"];
		
		$insert = $this->link->prepare("INSERT INTO `$this->mysqlDbName`.`visitors` (`UID`, `LastVisit`) VALUES(?, ?)");
		$insert->bind_param('ss', $uid, $this->timeNow);
		$insert->execute();
		$insert->close();
	}
	
	function updateVisitor($visitorInfo) {
	
		$uid = $visitorInfo["UID"];
		
		$update = $this->link->prepare("UPDATE `visitors` SET `LastVisit` = ? WHERE `UID` = ?");
		$update->bind_param('ss', $this->timeNow, $uid);
		$update->execute();
		$update->close();
	}
}
?>