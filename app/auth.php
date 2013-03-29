<?php

class Auth {

	protected static $instance = NULL;
	protected $strongMiddleware = NULL;

	public function __construct(Slim\Slim $slim = null) {
		$slim = !empty($slim) ? $slim : \Slim\Slim::getInstance();

		require_once APP_DIR . '/lib/Strong/Strong.php';
		require_once APP_DIR . '/lib/Slim/Middleware/StrongAuth.php';

		$auth_config = array(
		    'provider' => 'PDO',
		    'pdo' => ORM::get_db(),
		    'auth.type' => 'form',
		    'login.url' => APP_PATH . '/login',
		    'security.urls' => array(
		        array('path' => '/dashboard?/?.+'),
		    ),
		);

		$slim->add($this->strongMiddleware = new \Slim\Extras\Middleware\StrongAuth($auth_config));
	}

	public static function getInstance(){
        if (self::$instance == NULL) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getMiddleware(){
		return $this->strongMiddleware;
	}

	public function login($usernameOrEmail, $password, $remember = false){
		return $this->strongMiddleware->auth->login($usernameOrEmail, $password, $remember);
	}

	public function loggedIn(){
		return $this->strongMiddleware->auth->loggedIn();
	}

	public function getUser(){
		return $this->strongMiddleware->auth->getUser();
	}


}