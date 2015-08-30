<?php

class MysqlConnector
{
	private $mysqlUser;
	private $mysqlPw;
	private $mysqlDbName;
	private $db;
	
	public $link;
	
	function __construct($mysqlHost, $mysqlUser, $mysqlPw, $mysqlDbName) {
	
		$this->mysqlUser = $mysqlUser;
		$this->mysqlPw = $mysqlPw;
		$this->mysqlDbName = $mysqlDbName;
		
		$this->link = mysqli_connect($mysqlHost, $mysqlUser, $mysqlPw, $mysqlDbName);
	}
	
	function __destruct() {
	
		$this->link->close();
	}
}

?>