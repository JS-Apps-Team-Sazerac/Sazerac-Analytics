<?php

include_once "IDateTimeUtil.php";

class StatisticsMysqlWriteController
{
	private $mysqlDbName;
	private $dateTimeUtil;
	private $dayStart;
	private $link;
	
	function __construct($mysqlDbName, $link, IDateTimeUtil $dateTimeUtil) {

		$this->mysqlDbName = $mysqlDbName;
		$this->dateTimeUtil = $dateTimeUtil;
		$this->dayStart = $dateTimeUtil->getDayStart();
		$this->link = $link;
	}
	
	function updateVisits($visitorInfo) {
		
		$this->updateCountStat("visits", "VisitType", "PageView", $this->dayStart);
		if($visitorInfo["IsUnique"] == true) {
			$this->updateCountStat("visits", "VisitType", "Unique", $this->dayStart);
		}
	}
	
	function updateCountries($visitorInfo) {
	
		$this->updateCountStat("countries", "Country", $visitorInfo["Country"], $this->dayStart);
	}
	
	function updateSystems($visitorInfo) {
		
		$this->updateCountStat("systems", "OSName", $visitorInfo["OSName"], $this->dayStart);
	}
	
	function updateBrowsers($visitorInfo) {
		
		$this->updateCountStat("browsers", "BrowserName", $visitorInfo["BrowserName"], $this->dayStart);
	}
	
	function updateReferrers($visitorInfo) {
		
		if(empty($visitorInfo["Referrer"])) {
			return;
		}

		$this->updateCountStat("referrers", "Referrer", $visitorInfo["Referrer"], $this->dayStart);
	}
	
	private function updateCountStat($updateTableName, $matchColumnName, $matchRowName, $dayStart) {
	
		$query = $this->link->prepare("SELECT `Count` FROM `$this->mysqlDbName`.`$updateTableName` WHERE `StatDay` = ? AND `$matchColumnName` = ?");
		$query->bind_param('ss', $dayStart, $matchRowName);
		$query->execute();
		$query->store_result();
		
		if($query->num_rows <= 0) {
			
			$insert = $this->link->prepare("INSERT INTO `$this->mysqlDbName`.`$updateTableName` (`StatDay`, `$matchColumnName`, `Count`) VALUES(?, ?, '1')");
			$insert->bind_param('ss', $dayStart, $matchRowName);
			$insert->execute();
			$insert->close();
			
		} else {
			
			$query->bind_result($updateColumnValue);
			$query->fetch();
			$updateColumnValue += 1;
			$update = $this->link->prepare("UPDATE `$updateTableName` SET `Count` = ? WHERE `StatDay` = ? AND `$matchColumnName` = ?");
			$update->bind_param('dss', $updateColumnValue, $dayStart, $matchRowName);
			$update->execute();
			$update->close();
		}
		
		$query->close();
	}
}

?>