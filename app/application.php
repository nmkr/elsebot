<?php

class Application {
	public $slim;
	public $auth;
	public $translate;
	public $controllers = array();

	public function __construct(Slim\Slim $slim = null)
	{
		$this->slim = !empty($slim) ? $slim : \Slim\Slim::getInstance();
		$this->setup();
	}

	public function setup() {
		require_once APP_DIR . '/auth.php';
		require_once APP_DIR . '/global.php';
		require_once APP_DIR . '/model.php';
		require_once APP_DIR . '/translate.php';

		$this->auth = Auth::getInstance();
		$this->translate = Translate::getInstance();

		$this->loadControllers(array('Auth', 'Dashboard', 'Pages', 'Products'));

		//Setup database - $db variable
		//Setup locations - $locations variable
		//Setup options - $options variable
	}

	public function loadControllers($controllers) {
		require_once APP_DIR . '/controller.php';
		$controllers_dir = APP_DIR . '/controllers';
		
		foreach($controllers as $controller_name){
			$controller_path = $controllers_dir . '/' . strtolower($controller_name) . '.controller.php';

			if(file_exists($controller_path)) {
				require_once $controller_path;

				$controller_class = $controller_name . 'Controller';
				if(class_exists($controller_class)){
					$this->controllers[strtolower($controller_name)] = new $controller_class();
				}
			} else {
				throw new \RuntimeException('Controller ' . $controller . ' not found. File does not exist in app/controllers directory.');
			}
		}
	}

	public function run() {
		$this->slim->run();
	}
}