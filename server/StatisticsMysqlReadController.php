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
	
	function queryConfig($configName, $configColumn) {
		
		$statement = 'SELECT `' . $configColumn . '` FROM `' . $this->mysqlDbName . "`.`config` WHERE `Name` = ? LIMIT 1";

		$query = $this->link->prepare($statement);
		$query->bind_param('s', $configName);
		$query->execute();
		$query->bind_result($value);
		$query->fetch();
		
		return $value;
	}
	
	function queryStats($queryColumns, $filterColumnsAndValues, $fromDate, $toDate) {
		
		$outputCollection = array();

		for($i = 0; $i < count($queryColumns) && !empty($queryColumns); $i++) {
		
			$queriedDay = strtotime($fromDate);
			
			$dataIndex = 0;
			$collection = array( "fromDateTime" => $fromDate, "toDateTime" => $toDate);
			$collection["Data"] = array();
			
			while($queriedDay <= strtotime($toDate)) {

				$initialStatement = 'SELECT ' ;
				$initialStatement .= '`' . $queryColumns[$i] . '`, COUNT(`' . $queryColumns[$i] . '`)';
			
				$initialStatement .= ' FROM `' . $this->mysqlDbName . '`.`visitors` WHERE `LastVisit` BETWEEN ? AND ?';
				
				for($x = 0; $x < count($filterColumnsAndValues) && !empty($filterColumnsAndValues[$x]); $x++) {
					$filterColumnAndValue = explode(":", $filterColumnsAndValues[$x]);
					$initialStatement .= ' AND `' . $filterColumnAndValue[0] . "` = '" . $filterColumnAndValue[1] . "'"; 
				}
				
				$initialStatement .= " GROUP BY `" . $queryColumns[$i] . "`";

				$query = $this->link->prepare($initialStatement);
				$query->bind_param('ss', $this->dateTimeUtil->timestampToDateTime($queriedDay), $this->dateTimeUtil->timestampToEndDateTime($queriedDay));
				$query->execute();
				$query->bind_result($valueName, $value);
				
				$collection["Data"][$dataIndex] = array();
				$z = 0;
				
				while($query->fetch()) {
					$collection["Data"][$dataIndex][$z] = array( "Name" => $valueName, "Count" => $value);
					$z++;
				}
				
				if(empty($collection["Data"][$dataIndex])) {
					unset($collection["Data"][$dataIndex]);
				}
				
				$dataIndex++;
				
				$query->close();
				
				$queriedDay = $this->dateTimeUtil->timestampAddHours($queriedDay, 24);
			}
			
			if(!empty($collection["Data"])) {
				$outputCollection[$queryColumns[$i]] = $collection;
			}		
		}
		
		return $outputCollection;
	}
	
	function queryClicks($queryColumns, $fromDate, $toDate) {
	
		$outputCollection = array();
		
		$initialStatement = 'SELECT';
		for($i = 0; $i < count($queryColumns); $i++) {
			$initialStatement .= ' `' . $queryColumns[$i] . '`';
			if($i + 1 < count($queryColumns)) {
				$initialStatement .= ',';
			}
		}
		
		$initialStatement .= ' FROM `' . $this->mysqlDbName . '`.`clicks` WHERE `ClickTime` BETWEEN ? AND ?';
		
		$query = $this->link->prepare($initialStatement);
		$query->bind_param('ss', $this->dateTimeUtil->timestampToDateTime(strtotime($fromDate)), $this->dateTimeUtil->timestampToEndDateTime(strtotime($toDate)));
		$query->execute();
		$query->bind_result($path, $x, $y);
		$query->store_result();
		
		if($query->num_rows > 0) {
		
			$collection = array( "fromDateTime" => $fromDate, "toDateTime" => $toDate);
			$collection["Data"] = array();
			
			$i = 0;
			while($query->fetch()) {
				$collection["Data"][$i] = array( "path" => $path, "x" => $x, "y" => $y);
				$i++;
			}
			
			$outputCollection['click'] = $collection;
		}
		
		$query->close();
		
		return $outputCollection;
	}
}

?>
