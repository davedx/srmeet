<?php

/*
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/
//Credentials for API and Libraries
//Key: 36bd8913-bf56-4aa0-9492-49a3240597ea
//Secret: 12H@c9kT$At
//BundleId: com.myorder.PlayGround
//
//
//Headers
//Authorization: SPR k="x@t0nK3y",tm="1396430073",t="c30f8ce0-92b3-4b54-97e7-e5c910b7b79c",s="bkwuUmAjurjgIjvCzKR9DqHmqyU",v="1"
//Accept-Language: en-us

define('MYORDER_API_URL_PLAYGROUND', 'http://playground-java.myorder.nl');
define('MYORDER_API_SHARED_SECRET', '12H@c9kT$At');
define('MYORDER_API_CLIENT', '36bd8913-bf56-4aa0-9492-49a3240597ea');
//define('MYORDER_API_SHARED_SECRET', '12H@c9kT$At');

// set bol.com apikey
$apiKey = 'zzzzz';
$server = 'openapi.bol.com';
$port = '443';

function doRequest($method, $server, $port, $url, $parameters, $content, $sessionId) {

    $contentType = 'application/json';

    $headers = $method . " " . $url . $parameters . " HTTP/1.0\r\nContent-type: " . $contentType . "\r\n";
    $headers .= "Host: " . $server . "\r\n";
    $headers .= "Connection: close\r\n";
    $headers .= "\r\n";

    // Connect using fsockopen (you could also try CURL)
    $socket = fsockopen('ssl://' . $server, $port, $errno, $errstr, 30);
    if (!$socket) {
        echo "$errstr ($errno)<br />\n";
    }
    fputs($socket, $headers);
    fputs($socket, $content);
    $ret = "";

    while (!feof($socket)) {
        $readLine = fgets($socket);
        $ret .= $readLine;
    }
    fclose($socket);
    return $ret;
}

function search_bol($keyword, $server, $port, $apiKey) {
  // Build the request to the API
  $output = doRequest('GET', $server, $port, '/catalog/v4/search', '?q=' . urlencode($keyword) . '&apikey=' . $apiKey . '&offset=0&nrProducts=8includeattributes=true&dataoutput=categories,refinements,products&ids=0', '', null);

  // Check for the right http status in the API respons
  if (substr_count($output, "200 OK") > 0) {
      // Strip unneeded stuff from the json respons
      list($header, $body) = explode("\r\n\r\n", $output, 2);
      // decode the json sting
      $phpobject = json_decode($body);
      return $phpobject;
  }
}

class MyOrderAPI {
  function __construct($api_url=MYORDER_API_URL_PLAYGROUND) {
    $this->api_url = $api_url;
    $this->_auth = null;
  }

  function _build_authorization_header($token = '') {
    $secretKey = MYORDER_API_SHARED_SECRET;
    $timestamp = time();
    $bundleId = "com.myorder.PlayGround";
    $input = $secretKey . $timestamp . $token . $bundleId;
    $hmac = hash_hmac("sha1", $input, $secretKey, true); // true geeft raw output
    $signature = rtrim(strtr(base64_encode($hmac), '+/=', '-_ ')); // rtrim en strstr zorgt voor de "safe url" optie, die heeft PHP niet in de base64_encode functie
    $details = array(
      'k' => MYORDER_API_CLIENT,
      'b' => $bundleId,
      'tm' => $timestamp,
    );
    if ($token != '') {
      $details['t'] = $token;
    }
    $details['s'] = $signature;
    $details['v'] = 2;
    $parts = array();
    foreach($details as $k => $v) {
      $parts[] = $k .'="'. $v .'"';
    }
    return join(",", $parts);
  }

  function _get($path, $params=array()) {
    $query_params = http_build_query($params);
    $url = $this->api_url .'/'. $path .'?'. $query_params;

    $ci = curl_init();
    curl_setopt($ci, CURLOPT_URL, $url);
    curl_setopt($ci, CURLOPT_CUSTOMREQUEST, 'GET');
    //curl_setopt($ci, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ci, CURLOPT_VERBOSE, 1);
    curl_setopt($ci, CURLOPT_HEADER, 1);

    $headers = array(
      'Accept-Language: en-us'

    );

    if ($this->_auth != null) {
      $auth_details = $this->_build_authorization_header($this->_auth->key);
    } else {
      $auth_details = $this->_build_authorization_header();
    }
    //print "Adding auth header ...";
    $headers[] = "Authorization: SPR $auth_details";
    //print_r($headers);

    curl_setopt($ci, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ci);

    // Then, after your curl_exec call:
    $header_size = curl_getinfo($ci, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);

    curl_close($ci);
    //print $response;
    //print var_dump(json_decode(trim($body), true));
    return json_decode($body);
  }

  function auth($params=array()) {
    $this->_auth = $this->_get('api/v1/auth/login', $params);

    return $this->_auth;
  }

  function merchant_types($params=array()) {
    return $this->_get('api/v1/catalog/merchantTypes', $params);
  }

  function merchants($params=array()) {
    return $this->_get('api/v1/catalog/merchants', $params);
  }

  function parking_point($params=array()) {
    return $this->_get('api/v1/parking/points', $params);
  }

  function parking_session($params=array()) {
    return $this->_get('api/v1/parking/session', $params);
  }

  function movie_all($params = array()) {
    return $this->_get('api/v1/movie/all', $params);
  }

  function movie_list($params = array()) {
    return $this->_get('api/v1/movie/list', $params);
  }

}

function group_movies_by_merchant($movie_list) {
    $movies = array();
    foreach($movie_list as $movie) {
      $subcats = @$movie->subcategories;

      if (!array_key_exists($movie->merchatName, $movies)) {
        $movies[$movie->merchantName] = array();
      }

      $movies[$movie->merchantName][$movie->id] = $movie;
    }

    return $movies;
}

//$location = "Amsterdam";
//$path = "api/v1/catalog/merchantTypes?location=$location";

//http://docs.myorderplaygroundrestapi.apiary.io/


// Then, after your curl_exec call:
//$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
//$header = substr($response, 0, $header_size);
//$body = substr($response, $header_size);
$api = new MyOrderAPI();
$api->auth();
print_r($api->_auth);

$merchs = $api->merchants(array('location' => '52.310746,4.768285'));
print_r($merchs);
