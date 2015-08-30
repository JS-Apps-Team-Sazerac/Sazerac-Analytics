<?php

if(isset($_GET["visitor"])) {

	include_once "config.php";
	include_once "DateTimeUtil.php";
	include_once "VisitorInfoGrabber.php";
	include_once "MysqlConnector.php";
	include_once "VisitorMysqlController.php";
	include_once "StatisticsMysqlWriteController.php";
	
	
	$screenWidth = $_GET["width"];
	$screenHeight = $_GET["height"];
	
	$referrer = "";
	if(isset($_SERVER['HTTP_REFERER'])) {
		$referrer = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
	}
	
	$visitorInfoGrabber = new VisitorInfoGrabber("data\GeoIP.dat", "data\GeoIPv6.dat");
	
	$ip =  $visitorInfoGrabber->getIP();
	if($ip === false) {
		exit;
	}
	
	$country = $visitorInfoGrabber->getCountry($ip);
	
	$osName = $visitorInfoGrabber->getOSName();
	$browserName = $visitorInfoGrabber->getBrowserName();
	
	$uid = md5($ip . $osName . $screenWidth . $screenHeight);
	
	$visitorInfo = array("UID"=>$uid,
						"ScreenWidth"=>$screenWidth,
						"ScreenHeight"=>$screenHeight,
						"Referrer"=>$referrer,
						"IP"=>$ip, 
						"Country"=>$country,
						"OSName"=>$osName,
						"BrowserName"=>$browserName,
						"IsUnique"=>false);
	
	
	$dateTimeUtil = new DateTimeUtil($timeNow);
	$mysqlConnector = new MysqlConnector($mysqlHost, $mysqlUser, $mysqlPw, $mysqlDbName);
	$visitorMysqlController = new VisitorMysqlController($mysqlDbName, $mysqlConnector->link, $dateTimeUtil);
	$statisticsMysqlWriteController = new StatisticsMysqlWriteController($mysqlDbName, $mysqlConnector->link, $dateTimeUtil);
	
	if($visitorMysqlController->isExistingVisitor($visitorInfo) == false) {
		
		$visitorMysqlController->addVisitor($visitorInfo);
		$visitorInfo["IsUnique"] = true;
		
	} else {
		
		$visitorInfo["IsUnique"] = $visitorMysqlController->isUniqueVisitor($visitorInfo);
		$visitorMysqlController->updateVisitor($visitorInfo);
	}

	if($visitorInfo["IsUnique"] == true) {
	
		$statisticsMysqlWriteController->updateCountries($visitorInfo);
		$statisticsMysqlWriteController->updateSystems($visitorInfo);
		$statisticsMysqlWriteController->updateBrowsers($visitorInfo);
		$statisticsMysqlWriteController->updateReferrers($visitorInfo);
	}
	
	$statisticsMysqlWriteController->updateVisits($visitorInfo);
	
	setcookie($visitorCookieName, base64_encode($uid), $visitorCookieExpiration);
	
	$visitorMysqlController = null;
	$statisticsMysqlWriteController = null;
	$mysqlConnector = null;
	
} 

?>