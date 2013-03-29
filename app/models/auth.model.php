<?php

class AuthModel extends Model {

	public function createUser($data){
		if(!$this->isUsernameAvailable()){

		} else if (!$this->isEmailAvailable()){

		} else {

		}
	}

	public function activateUser(){

	}

	public function isUsernameAvailable($username){

	}

	public function isEmailAvailable($email){

	}

	public function increaseLoginAttempts($ip_address, $username){

	}

	public function clearLoginAttempts($ip_address, $username){

	}

}