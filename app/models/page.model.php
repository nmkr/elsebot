<?php

class PageModel extends Model {

	public function getPageByPermalink($permalink){
		$single_page = ORM::for_table('pages')->select('*')->where('permalink', $permalink)->find_array();
		return $single_page;
	}

	public function getPageByID($id){
		$single_page = ORM::for_table('pages')->select('*')->where('id', $id)->find_array();
		return $single_page;
	}

	public function listAllPages(){
		$pages = ORM::for_table('pages')->select('*')->find_array();
		return $pages;
	}

	public function listAllPagesByStatus($status){
		$pages = ORM::for_table('pages')->select('*')->where('status', $status)->find_array();
		return $pages;
	}

	public function updatePageByID($id, $newData){
		$single_page = ORM::for_table('pages')->find_one($id);

		$single_page->title = $newData['input-title'];
		$single_page->content = $newData['input-content'];
		$single_page->status = 'published';

		$single_page->save();
	}

	public function newPage(){
		$new_page = ORM::for_table('pages')->create();

		$new_page->status = 'new';
		$new_page->save();

		return $new_page->id();
	}

	public function deletePageByID($id){
		$single_page = ORM::for_table('pages')->find_one($id);

		if($single_page->status != 'deleted'){
			$single_page->status = 'deleted';
			$single_page->save();
		} else {
			$single_page->delete();
		}
	}

	public function deletePages($id_array){
		$pages = ORM::for_table('pages')->where_in('id', $id_array)->find_many();

		foreach ($pages as $single_page) {
		    if($single_page->status != 'deleted'){
				$single_page->status = 'deleted';
				$single_page->save();
			} else {
				$single_page->delete();
			}
		}
	}

	public function publishPageByID($id){
		$single_page = ORM::for_table('pages')->find_one($id);
		$single_page->status = 'published';

		$single_page->save();
	}

	public function unpublishPageByID($id){
		$single_page = ORM::for_table('pages')->find_one($id);
		$single_page->status = 'draft';

		$single_page->save();
	}

	public function trashPageByID($id){
		$single_page = ORM::for_table('pages')->find_one($id);
		$single_page->delete();
	}
}