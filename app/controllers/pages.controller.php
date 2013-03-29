<?php

class PagesController extends Controller {

	public function __construct(){
		parent::__construct();
		$this->pageModel = \Model::load('page');
	}
	
	public function index(){
		$this->render('index.html');
	}

	public function single($permalink) {
		$pages = $this->pageModel->getPageByPermalink($permalink);

		if(empty($pages)){
			$this->slim->notFound();
		} else {
			$this->render('page.html', array('pages' => $pages));
		}
	}

}