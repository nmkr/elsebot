<?php

/**
 * Main config file
 */
define('APP_MODE', 'development');
define('APP_NAME', 'YayaShop');
define('APP_VERSION', '0.0.1');
define('APP_LANGUAGE', 'cs_CZ');
define('APP_THEME', 'default');
define('APP_PATH', 'http://elsebot.com');
define('TEMPLATES_PATH', APP_PATH . '/templates');
define('THEME_PATH', APP_PATH . '/themes' . '/' . APP_THEME);
define('THEME_CSS_PATH', THEME_PATH . '/css');
define('THEME_JS_PATH', THEME_PATH . '/js');

define('ROOT_DIR', dirname(__FILE__));
define('APP_DIR', dirname(__FILE__) . '/app');
define('TEMPLATES_DIR', dirname(__FILE__) . '/templates');
define('THEME_DIR', dirname(__FILE__) . '/templates/themes' . '/' . APP_THEME);

$db['development']['hostname'] = 'localhost';
$db['development']['username'] = 'root';
$db['development']['password'] = '';
$db['development']['database'] = 'dev';
$db['development']['dbProvider'] = 'mysql';

$db['production']['hostname'] = 'localhost';
$db['production']['username'] = 'root';
$db['production']['password'] = '';
$db['production']['database'] = 'production';
$db['production']['dbProvider'] = 'mysql';

ORM::configure(sprintf('mysql:host=%s;dbname=%s', $db[APP_MODE]['hostname'], $db[APP_MODE]['database']));
ORM::configure('username', $db[APP_MODE]['username']);
ORM::configure('password', $db[APP_MODE]['password']);
ORM::configure('driver_options', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
