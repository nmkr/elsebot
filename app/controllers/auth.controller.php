<?php

class AuthController extends Controller {

	public function __construct(){
		parent::__construct();
		$this->authModel = \Model::load('auth');
	}

	public function login() {
		if ($this->slim->request()->isPost()) {
            try {
                try {
                	if ($this->auth->login($this->post('username'), $this->post('password'))) {
                        $this->slim->flash('info', 'Your login was successfull');
                        $this->redirect('index');
                    }
                } catch (\InvalidArgumentException $e) {
                	$this->slim->flashNow('error', $e->setName('Password')->getMainMessage());
                }
            } catch (\InvalidArgumentException $e) {
            	$this->slim->flashNow('error', $e->setName('Username')->getMainMessage());
            }
		}

		if($this->auth->loggedIn()){
			$this->redirect('index');
		} else {
			$this->render('login.html');
		}
	}

	public function logout() {

	}

	public function signup() {

	}
	
}