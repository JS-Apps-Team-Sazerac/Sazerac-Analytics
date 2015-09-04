<?php

if(isset($_GET["visitor"])) {

include_once "VisitorController.php";

} else if(!empty($_GET["click"]) && !empty($_GET["path"]) && !empty($_GET["x"]) && !empty($_GET["y"])) {

include_once "ClickController.php";

}

?>