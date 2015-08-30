<?php

/*
function get64BitHash($str) {
	return gmp_strval(gmp_init(substr(md5($str), 0, 16), 16), 10);
}
*/

if(isset($_GET["app"]) && !empty($_GET["query"]) && !empty($_GET["from"]) && !empty($_GET["to"])) {
	
	header('Content-Type: application/json');
	
	include_once "config.php";
	include_once "DateTimeUtil.php";
	include_once "MysqlConnector.php";
	include_once "StatisticsMysqlReadController.php";
	
	$clientQuery = $_GET["query"];
	$from = $_GET["from"];
	$to = $_GET["to"];
	$outputCollection = "";
	
	$dateTimeUtil = new DateTimeUtil($timeNow);
	$mysqlConnector = new MysqlConnector($mysqlHost, $mysqlUser, $mysqlPw, $mysqlDbName);
	$statisticsMysqlReadController = new StatisticsMysqlReadController($mysqlDbName, $mysqlConnector->link, $dateTimeUtil);
	
	if(strpos($clientQuery, "browsers") !== false) {
		
		$outputCollection["Browsers"] = $statisticsMysqlReadController->queryBrowsers($from, $to);	
	}
	
	if(strpos($clientQuery, "visits") !== false) {
	
		$outputCollection["Visits"] = $statisticsMysqlReadController->queryVisits($from, $to);
	}
	
	if(strpos($clientQuery, "systems") !== false) {
		
		$outputCollection["Systems"] = $statisticsMysqlReadController->querySystems($from, $to);
	}
	
	if(strpos($clientQuery, "referrers") !== false) {
	
		$outputCollection["Referrers"] = $statisticsMysqlReadController->queryReferrers($from, $to);
	}

	if(strpos($clientQuery, "countries") !== false) {
	
		$outputCollection["Countries"] = $statisticsMysqlReadController->queryCountries($from, $to);
	}
	
	
	$jsonCallback = "";
	if(!empty($_GET["jsonCallback"])) {
	
		$jsonCallback = $_GET["jsonCallback"]; 
		
	} else if(!empty($_GET["jsoncallback"])) {
	
		$jsonCallback = $_GET["jsoncallback"];
	}
	
	if(!empty($jsonCallback)) {
		echo $jsonCallback . "(";
	}
	
	echo json_encode($outputCollection, JSON_PRETTY_PRINT);
	
	if(!empty($jsonCallback)) {
		echo ");";
	}
}

?>