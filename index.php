<?php

//Load Slim framework and register autoloader
require_once 'app/lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

//Load basic libraries
require_once 'app/lib/Slim/Liquid.php'; //Templating engine
require_once 'app/lib/Idiorm/Idiorm.class.php'; //Database ORM

require_once 'config.php';
require_once 'app/application.php';

use Slim\Slim;
use Slim\Views\LiquidView as LiquidView;

LiquidView::$liquidDirectory = APP_DIR . '/lib/Liquid';
LiquidView::$defaultPath = '/themes' . '/' . APP_THEME;

$log_writer = null;

$slim = new Slim(array(
    'mode' => APP_MODE,
	'view' => new LiquidView(),
    'templates.path' => TEMPLATES_DIR,
    'log.enabled' => true
));

$app = new Application($slim);
$env = $app->slim->environment();

$app->slim->configureMode('development', function () use ($app, $env) {
   $app->slim->config('debug', true);
});

$app->slim->configureMode('production', function () use ($app, $env) {
   $app->slim->config('debug', false);
});

require_once "app/routes.php";

$app->run();