<?php

include_once "config.php";
include_once "DateTimeUtil.php";
include_once "VisitorInfoGrabber.php";
include_once "MysqlConnector.php";
include_once "VisitorMysqlController.php";


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

if($visitorMysqlController->isTodayVisitor($visitorInfo) == false) {
	
	$visitorInfo["IsUnique"] = true;
	$visitorMysqlController->addVisitor($visitorInfo);	
	
} else {

	$visitorMysqlController->updateVisitor($visitorInfo);
}

setcookie($visitorCookieName, $uid, 0, "/");

$visitorMysqlController = null;
$mysqlConnector = null;
	
?>