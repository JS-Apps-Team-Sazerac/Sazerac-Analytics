<?php

include_once "config.php";
include_once "DateTimeUtil.php";
include_once "MysqlConnector.php";
include_once "VisitorMysqlController.php";

$uid = $_GET["click"];

$dateTimeUtil = new DateTimeUtil($timeNow);
$mysqlConnector = new MysqlConnector($mysqlHost, $mysqlUser, $mysqlPw, $mysqlDbName);
$visitorMysqlController = new VisitorMysqlController($mysqlDbName, $mysqlConnector->link, $dateTimeUtil);

$clickInfo = array("UID"=>$uid,
				   "Path"=>$_GET["path"],
				   "X"=>$_GET["x"],
				   "Y"=>$_GET["y"]);

if($visitorMysqlController->isTodayVisitor($clickInfo) == true) {

	$visitorMysqlController->addClick($clickInfo);
}

?>