<?php

include_once "geoipAPI.php";

class VisitorInfoGrabber
{	
	private $OSArray = array(
				'/windows nt 10/i'     =>  'Windows 10',
				'/windows nt 6.3/i'     =>  'Windows 8.1',
				'/windows nt 6.2/i'     =>  'Windows 8',
				'/windows nt 6.1/i'     =>  'Windows 7',
				'/windows nt 6.0/i'     =>  'Windows Vista',
				'/windows nt 5.2/i'     =>  'Windows Server 2003',
				'/windows nt 5.1/i'     =>  'Windows XP',
				'/windows xp/i'         =>  'Windows XP',
				'/macintosh|mac os x/i' =>  'Mac OS X',
				'/mac_powerpc/i'        =>  'Mac OS 9',
				'/linux/i'              =>  'Linux',
				'/iphone/i'             =>  'iPhone',
				'/ipod/i'               =>  'iPod',
				'/ipad/i'               =>  'iPad',
				'/android/i'            =>  'Android',
				'/blackberry/i'         =>  'BlackBerry',
			);
			
	private $BrowserArray = array(
                '/msie/i'       =>  'Internet Explorer',
                '/firefox/i'    =>  'Firefox',
                '/safari/i'     =>  'Safari',
                '/chrome/i'     =>  'Chrome',
                '/opera/i'      =>  'Opera',
                '/maxthon/i'    =>  'Maxthon',
                '/konqueror/i'  =>  'Konqueror',
            );
	
	private $userAgent;
	private $ipv4DatabasePath;
	private $ipv6DatabasePath;
	
	function __construct($ipv4DatabasePath, $ipv6DatabasePath) {
		$this->userAgent = $_SERVER["HTTP_USER_AGENT"];
		$this->ipv4DatabasePath = $ipv4DatabasePath;
		$this->ipv6DatabasePath = $ipv6DatabasePath;
	}
	
	function getOSName() {
	
		$osName = "Unknown OS";

		foreach ($this->OSArray as $regex => $value) { 

			if (preg_match($regex, $this->userAgent)) {
				$osName = $value;
			}
		}
		
		return $osName;
	}
	
	function getBrowserName() {
		
		$browserName = "Unknown Browser";

		foreach ($this->BrowserArray as $regex => $value) { 

			if (preg_match($regex, $this->userAgent)) {
				$browserName = $value;
			}
		}
		
		return $browserName;
	}
	
	function getIP() {
	
		$ipHeaders = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR');
		
		foreach ($ipHeaders as $ipHeader) {
			if (array_key_exists($ipHeader, $_SERVER) === true) {
				foreach (explode(',', $_SERVER[$ipHeader]) as $ip) {
	
					$ip = trim($ip);
	
					if ($this->validateIP($ip)) {
						return $ip;
					}
				}
			}
		}
	
		return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : false;
	}

	function getCountry($ip) {
	
		if((strpos($ip, ":") === false)) {
			
			$gi = geoip_open($this->ipv4DatabasePath, GEOIP_STANDARD);
			$country = geoip_country_name_by_addr($gi, $ip);
		
		} else {
			
			$gi = geoip_open($this->ipv6DatabasePath, GEOIP_STANDARD);
			$country = geoip_country_name_by_addr_v6($gi, $ip);
		}
		
		geoip_close($gi);
		
		return $country;
	}
	
	private function validateIP($ip)
	{
		if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
			return false;
		}
		
		return true;
	}

}

?>