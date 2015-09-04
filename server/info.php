<?php

if(isset($_GET["app"]) && isset($_GET["query"]) && isset($_GET["from"]) && isset($_GET["to"])) {
	
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	header('Content-Type: application/json');
	
	include_once "config.php";
	include_once "DateTimeUtil.php";
	include_once "MysqlConnector.php";
	include_once "StatisticsMysqlReadController.php";
	
	$clientQuery = $_GET["query"];
	$from = $_GET["from"];
	$to = $_GET["to"];
	$outputCollection = "";
	$isQueryForClicks = false;
	
	$dateTimeUtil = new DateTimeUtil($timeNow);
	$mysqlConnector = new MysqlConnector($mysqlHost, $mysqlUser, $mysqlPw, $mysqlDbName);
	$statisticsMysqlReadController = new StatisticsMysqlReadController($mysqlDbName, $mysqlConnector->link, $dateTimeUtil);
	
	$statisticStart = $statisticsMysqlReadController->queryConfig("StatisticStart", "DateTimeValue");
	
	if(empty($clientQuery)) {
		
		$outputCollection = array();
		$outputCollection["statisticStart"] = $statisticStart;
		$outputCollection["serverDayStart"] = $dateTimeUtil->getDayStart();
		
		$JsonPrettyPrint = 128;
		echo json_encode($outputCollection, $JsonPrettyPrint);
		exit;
	}
	
	if(strtotime($from) < strtotime($statisticStart)) {
		
		$from = $statisticStart;
	}
	
	if(strtotime($to) > strtotime($dateTimeUtil->getDayStart())) {
		
		$to = $dateTimeUtil->getDayStart();
	}

	$queryColumns = null;
	if(!empty($_GET["query"])) {
		$queryColumns = explode(",", $_GET["query"]);
		for($i = 0; $i < count($queryColumns); $i++) {
			if(empty($queryColumns[$i])) {
				unset($queryColumns[$i]);
			} else {
				if($queryColumns[$i] == "click") { 
					$isQueryForClicks = true;
				}
			}
		}
	}
	
	$filterColumnsAndValues = null;
	if(!empty($_GET["filter"])) {
		$filterColumnsAndValues = explode(",", $_GET["filter"]);
		for($i = 0; $i < count($filterColumnsAndValues); $i++) {
			if(empty($filterColumnsAndValues[$i])) {
				unset($filterColumnsAndValues[$i]);
			}
		}
	}
	
	if($isQueryForClicks == true) {
		$outputCollection = $statisticsMysqlReadController->queryClicks(array("Path", "X", "Y"), $from, $to);
	} else {
		$outputCollection = $statisticsMysqlReadController->queryStats($queryColumns, $filterColumnsAndValues, $from, $to);
	}
	
	$outputCollection["statisticStart"] = $statisticStart;
	$outputCollection["serverDayStart"] = $dateTimeUtil->getDayStart();
	
	$jsonCallback = "";
	if(!empty($_GET["jsonCallback"])) {
	
		$jsonCallback = $_GET["jsonCallback"]; 
		
	} else if(!empty($_GET["jsoncallback"])) {
	
		$jsonCallback = $_GET["jsoncallback"];
	}
	
	if(!empty($jsonCallback)) {
		echo $jsonCallback . "(";
	}
	
	$JsonPrettyPrint = 128;
	echo json_encode($outputCollection, $JsonPrettyPrint);
	
	if(!empty($jsonCallback)) {
		echo ");";
	}
}

?>