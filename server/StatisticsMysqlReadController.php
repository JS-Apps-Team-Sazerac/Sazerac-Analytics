<?php

include_once "IDateTimeUtil.php";

class StatisticsMysqlReadController
{
	private $mysqlDbName;
	private $link;
	
	function __construct($mysqlDbName, $link, IDateTimeUtil $dateTimeUtil) {

		$this->mysqlDbName = $mysqlDbName;
		$this->dateTimeUtil = $dateTimeUtil;
		$this->link = $link;
	}
	
	function queryVisits($fromDate, $toDate) {
		
		return $this->queryCountStat("visits", "VisitType", $fromDate, $toDate);
	}
	
	function queryCountries($fromDate, $toDate) {
		
		$countriesCollection = $this->queryCountStat("countries", "Country", $fromDate, $toDate);
		$i = 0;
		foreach($countriesCollection as $key => $value) {
			if($key == "length") {
				continue;
			}
			$countriesCollectionIndexed[$i] = array($key => $value);
			$i++;
		}
		
		return $countriesCollectionIndexed;
	}
	
	function queryBrowsers($fromDate, $toDate) {
		
		return $this->queryCountStat("browsers", "BrowserName", $fromDate, $toDate);
	}
	
	function querySystems($fromDate, $toDate) {
	
		return $this->queryCountStat("systems", "OSName", $fromDate, $toDate);
	}
	
	function queryReferrers($fromDate, $toDate) {
		
		$referrersCollection = $this->queryCountStat("referrers", "Referrer", $fromDate, $toDate);
		$i = 0;
		foreach($referrersCollection as $key => $value) {
			if($key == "length") {
				continue;
			}
			$referrersCollectionIndexed[$i] = array($key => $value);
			$i++;
		}
		
		return $referrersCollectionIndexed;
	}
	
	private function queryCountStat($queryTableName, $queryColumnName, $fromDate, $toDate) {
		
		$query = $this->link->prepare("SELECT `$queryColumnName`,`Count` FROM `$this->mysqlDbName`.`$queryTableName` WHERE `StatDay` BETWEEN ? AND ?");
		$query->bind_param('ss', $fromDate, $toDate);
		$query->execute();
		$query->bind_result($valueName, $value);
		
		$collection = array("length" => 0);
		while($query->fetch()) {
			$collection[$valueName] = $value;
			$collection["length"]++;
		}
		
		$query->close();
		
		return $collection;
	}
}

?>
