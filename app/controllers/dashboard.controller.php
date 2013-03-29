<?php

class DashboardController extends Controller {

	public function __construct(){
		parent::__construct();
		$this->pageModel = \Model::load('page');
		$this->productModel = \Model::load('product');
		$this->orderModel = \Model::load('order');
		$this->postModel = \Model::load('post');

		$this->templatesPath = '/dashboard';

		Slim\Views\LiquidView::$privateFilters = true;
	}
	
	public function index(){

	}

	public function menus(){

	}

	public function pages(){
		$data['table'] = array(
			'id' => 'pages-table'
		); 

		$bulkAction = $this->post('bulk-action') ? $this->post('bulk-action') : false;
		$pages = $this->post('item') ? $this->post('item') : false;

		if($bulkAction && $pages){
			switch ($bulkAction) {
				case 'delete':
					$this->pageModel->deletePages($pages);
					break;
			}
		}

		$filterStatus = $this->post('filter-status') ? $this->post('filter-status') : 'published';

		if($filterStatus){
			switch ($filterStatus) {
				case 'deleted':
					$data['table']['data'] = $this->pageModel->listAllPagesByStatus('deleted');
					$bulkOptions = array(
							array(
								'name'		=> '0',
								'value'		=> $this->t->__('Bulk action'),
							),
							array(
								'name'		=> 'restore',
								'value'		=> $this->t->__('Restore')
							),
							array(
								'name'		=> 'delete',
								'value'		=> $this->t->__('Delete permanently')
							)
					);
					break;

				case 'draft':
					$data['table']['data'] = $this->pageModel->listAllPagesByStatus('draft');
					$bulkOptions = array(
							array(
								'name'		=> '0',
								'value'		=> $this->t->__('Bulk action'),
							),
							array(
								'name'		=> 'publish',
								'value'		=> $this->t->__('Publish')
							),
							array(
								'name'		=> 'delete',
								'value'		=> $this->t->__('Delete')
							)
					);
					break;

				default:
					$data['table']['data'] = $this->pageModel->listAllPagesByStatus('published');
					$bulkOptions = array(
							array(
								'name'		=> '0',
								'value'		=> $this->t->__('Bulk action'),
							),
							array(
								'name'		=> 'delete',
								'value'		=> $this->t->__('Delete')
							)
					);
					break;
			}
		}

		$data['table']['actions'] = array(
			array(	'name'	=> 'add-new', 
					'title'	=> $this->t->__('Add new page'),
					'type'	=> 'button',
					'url'	=> 'dashboard-new-page' 
			),
			array(	'name'		=> 'filter-status', 
					'title'		=> $this->t->__('Filter status'),
					'type'		=> 'select',
					'default'	=> $filterStatus,
					'options'	=> array(
							array(
								'name'		=> 'published',
								'value'		=> $this->t->__('Published'),
							),
							array(
								'name'		=> 'draft',
								'value'		=> $this->t->__('Draft')
							),
							array(
								'name'		=> 'deleted',
								'value'		=> $this->t->__('Deleted')
							),
					),
			),
			array(	'name'		=> 'bulk-action', 
					'title'		=> $this->t->__('Bulk action'),
					'type'		=> 'select',
					'class'		=> ' jumpdefault',
					'default'	=> '0',
					'options'	=> $bulkOptions
			),
		);

		$data['table']['columns'] = array(
			array( 'name' => 'title', 'title' => $this->t->__('Title'), 'sort' => 'string', 'format' => 'edit', 'single' => 'dashboard-single-page', 'delete' => 'dashboard-delete-page' ),
			array( 'name' => 'created_at', 'title' => $this->t->__('Created'), 'format' => 'date' )
		);

		$this->render('dashboard-pages.html', $data);
	}

	public function single_page($id){
		$data['inputs'] = array(
			array(	'name'			=> 'id',
					'type'			=> 'hidden'
			),
			array(	'name'			=> 'title',
					'type'			=> 'text', 
					'placeholder'	=> $this->t->__('Title'),
					'required'		=> true,
					'validate'		=> 'html' 
			),
			array(	'name'			=> 'content',
					'type'			=> 'editor', 
					'placeholder'	=> $this->t->__('Content'),
					'required'		=> true,
					'validate'		=> 'html' 
			),
		);

		$data['page'] = $this->pageModel->getPageByID($id);

		if(!empty($data['page'])){
			$this->render('dashboard-single-page.html', $data);
		} else {
			$this->slim->notFound();
		}
	}

	public function new_page(){
		$newPageID = $this->pageModel->newPage();

		$this->single_page($newPageID);
	}

	public function delete_page($id){
		$pageID = $id;
		$savePage = $this->pageModel->deletePageByID($pageID);

		$this->redirect('dashboard-pages', true);
	}

	public function save_page(){
		$pageID = $this->post('input-id');
		$savePage = $this->pageModel->updatePageByID($pageID, $this->post());

		$this->redirect('dashboard-single-page', true, array('id' => $pageID));
	}

	public function products(){
		
	}

	public function single_product($id){
		
	}

	public function orders(){
		$data['columns'] = array(
			array( 'name' => 'title', 'title' => $this->t->__('Title'), 'sort' => 'string' ),
			array( 'name' => 'created_at', 'title' => $this->t->__('Created'), 'format' => 'date' )
		);

		$data['orders'] = $this->pageModel->listAllPages();
		$this->render('dashboard-orders.html', $data);
	}

	public function single_order($id){
		
	}

	public function posts(){
		
	}

	public function single_post($id){
		
	}

	public function options(){
		
	}

	public function upload(){
		require_once APP_DIR . '/lib/FileUploader/Fileuploader.class.php';

		$allowedExtensions = array('jpeg', 'jpg');
		// max file size in bytes
		$sizeLimit = 8 * 1024 * 1024;
		$uploader = new qqFileUploader($allowedExtensions, $sizeLimit);

		// Call handleUpload() with the name of the folder, relative to PHP's getcwd()
		$result = $uploader->handleUpload(ROOT_DIR. '/public/uploads/');

		// to pass data through iframe you will need to encode all html tags
		echo htmlspecialchars(json_encode($result), ENT_NOQUOTES);
	}

}