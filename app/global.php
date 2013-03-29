<?php

class GlobalData {

	protected static $instance = NULL;

	public static function getInstance(){
        if (self::$instance == NULL) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function add(){
    	echo 'hello';
    }

}