<?php

class Database {

	public function __construct($db_config = null) {
		// Authentication
		$config = array(
		    'provider' => 'PDO',
		    'pdo' => new PDO('mysql:host=localhost;dbname=dev', 'root'),
		    'dsn' => sprintf('mysql:host=%s;dbname=%s', $db[$activeGroup]['hostname'], $db[$activeGroup]['database']),
		    'dbuser' => $db[$activeGroup]['username'],
		    'dbpass' => $db[$activeGroup]['password'],
		    'auth.type' => 'form',
		    'login.url' => '/login',
		    'security.urls' => array(
		        array('path' => '/comment/'),
		        array('path' => '/api/.+'),
		        array('path' => '/account/'),
		    ),
		);

		$this->db = ORM::get_db();
		$this->createStructure();
	}

	public function createStructure() {
		
	}

	private function configureDatabase($db_config) {
		$providerString = sprintf('mysql:host=%s;dbname=%s', $db[$activeGroup]['hostname'], $db[$activeGroup]['database']);

		ORM::configure($providerString);
		ORM::configure('username', $db[$activeGroup]['username']);
		ORM::configure('password', $db[$activeGroup]['password']);
	}

}