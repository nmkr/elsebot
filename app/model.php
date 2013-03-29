<?php

class Model {

	public function __construct() {
		
	}

	public static function load($model) {
		if(is_array($model)) {
			throw new \InvalidArgumentException('Unable to load multiple models from array.');
		}

		$models_dir = APP_DIR . '/models';
		$model_path = $models_dir . '/' . strtolower($model) . '.model.php';

		if(file_exists($model_path)) {
			require_once $model_path;

			$model_class = ucfirst(strtolower($model)) . 'Model';
			if(class_exists($model_class)){
				return new $model_class();
			} else {
				throw new \RuntimeException('Class ' . $model_class . ' not found');
			}
		} else {
			throw new \RuntimeException('File ' . $model . '.model.php not found. File does not exist in app/models directory.');
		}
	}

}