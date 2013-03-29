<?php

abstract class Controller extends Application {

	protected $templatesPath = null;
	public $user;

	public function __construct() {
		$this->slim = \Slim\Slim::getInstance();
		$this->auth = \Auth::getInstance();
		$this->t = Translate::getInstance();
		
		if ($this->auth->loggedIn()) {
			$this->user = $this->auth->getUser();
		}
	}

	public function redirect($name, $routeName = true, $args = array()) {
		$url = $routeName ? $this->slim->urlFor($name, $args) : $name;
		$response = $this->slim->response();
		$response['X-PJAX-URL'] = $url;
	}

	public function get($value = null) {
		return $this->slim->request()->get($value);
	}

	public function post($value = null) {
		$post = $this->slim->request()->post($value);
        if (empty($value)) {
        	/*
            $p = new stdClass;
            foreach ($post as $pt => $value) {
                $p->$pt = $value;
            }
            $post = $p;
            */

            $p = array();
            foreach ($post as $pt => $value) {
                $p[$pt] = $value;
            }
            $post = $p;
        }
        return $post;
	}

	public function response($body) {
		$response = $this->app->response();
		$response['Content-Type'] = 'application/json';
		$response['X-Powered-By'] = APPLICATION . ' ' . VERSION;
		$response->body(json_encode(array($body)));
	}

	public function render($template, $data = array(), $status = null){
		$this->slim->view()->setTemplatesPath($this->templatesPath);
		$this->slim->view()->compileResources();
		$this->slim->view()->appendData(array('user' => $this->user, 'xhr' => $this->slim->request()->isXhr(), 'route' => $this->slim->request()->getUrl() . $this->slim->request()->getPath()));
		$this->slim->render($template, $data, $status);
	}
}