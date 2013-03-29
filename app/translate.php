<?php

class Translate {

	protected static $instance = NULL;

	public function __construct(Slim\Slim $slim = null) {
		$codeset = "UTF8";  // warning ! not UTF-8 with dash '-' 
        
		// for windows compatibility (e.g. xampp) : theses 3 lines are useless for linux systems 

		putenv('LANG='.APP_LANGUAGE.'.'.$codeset); 
		putenv('LANGUAGE='.APP_LANGUAGE.'.'.$codeset); 

		setlocale(LC_ALL, APP_LANGUAGE.'.'.$codeset);
		bindtextdomain('default', ROOT_DIR . '/translations');
		bind_textdomain_codeset('default', $codeset); 
		textdomain('default');

		$this->generateTranslations();
	}

	public static function getInstance(){
        if (self::$instance == NULL) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __($string, $plural = NULL, $count = NULL){
    	if($plural && $count){
    		return ngettext($string, $plural, $count);
    	} else {
    		return gettext($string);
    	}
	}

	protected function generateTranslation(){
		$translation_strings = array();

		$template_files = glob(THEME_DIR . '/*.html');
		$translation_tag_regex = '/\{\{\s?\'(.*)\'\s?\|\s?(translate)(:\s?\'(.*)\')?,?\s?(\d)?\s?\}\}/';

		foreach ($template_files as $file) {
			$file_content = file_get_contents($file);
			preg_match_all($translation_tag_regex, $file_content, $matches, PREG_SET_ORDER);

			foreach ($matches as $match) {
				$translation_strings[strtolower($match[1])]['single'] = $match[1];

				if(isset($match[4])){
					$translation_strings[strtolower($match[1])]['plural'] = $match[4];
				}

				if(isset($match[5])){
					$translation_strings[strtolower($match[1])]['count'] = $match[5];
				}				
			}
		}
		
		$gettext_template = ROOT_DIR . '/translations/gettext.template.php';

		if(file_exists($gettext_template)) {
        	ob_start();
		    include $gettext_template;
		    $gettext_generated = ob_get_clean();
		    file_put_contents(ROOT_DIR . '/translations/gettext.generated.pot', $gettext_generated);
		}
	}

	protected function generateTranslations(){
		$translation_strings = array();

		$template_files = $this->getFolderFiles(THEME_DIR, 'html');
		$translation_tag_regex = '/\{\{\s?\'(.*)\'\s?\|\s?(translate)(:\s?\'(.*)\')?,?\s?(\d)?\s?\}\}/';

		foreach ($template_files as $file) {
			$file_content = file_get_contents($file);
			preg_match_all($translation_tag_regex, $file_content, $matches, PREG_SET_ORDER);

			foreach ($matches as $match) {
				$translation_strings[strtolower($match[1])]['single'] = $match[1];

				if(isset($match[4])){
					$translation_strings[strtolower($match[1])]['plural'] = $match[4];
				}

				if(isset($match[5])){
					$translation_strings[strtolower($match[1])]['count'] = $match[5];
				}				
			}
		}

		$controller_files = $this->getFolderFiles(APP_DIR . '/controllers', 'php');
		$translation_tag_regex = '/__\((?:\s*\'([^\']+)\'\s*),?\s*(?:\s*\'([^\']+)\'\s*)?,?\s*(?:\s*\'?([^\']+)\'?\s*)?\)/';

		foreach ($controller_files as $file) {
			$file_content = file_get_contents($file);
			preg_match_all($translation_tag_regex, $file_content, $matches, PREG_SET_ORDER);

			foreach ($matches as $match) {
				$translation_strings[strtolower($match[1])]['single'] = $match[1];

				if(isset($match[2]) && $match[2] != ''){
					$translation_strings[strtolower($match[1])]['plural'] = $match[2];
				}

				if(isset($match[3]) && $match[3] != ''){
					$translation_strings[strtolower($match[1])]['count'] = $match[3];
				}				
			}
		}

		$gettext_template = ROOT_DIR . '/translations/gettext.template.php';

		if(file_exists($gettext_template)) {
        	ob_start();
		    include $gettext_template;
		    $gettext_generated = ob_get_clean();
		    file_put_contents(ROOT_DIR . '/translations/gettext.generated.pot', $gettext_generated);
		}
	}

	protected function getFolderFiles($dir, $extension){
		$dir = $dir;
		$results = array();
		if (is_dir($dir)) {
		    $iterator = new RecursiveDirectoryIterator($dir);
		    foreach ( new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::CHILD_FIRST) as $file ) {
		        if ($file->isFile() && preg_match('/([a-zA-Z0-9\/\.:]+)\.' . $extension . '$/', $file->getFilename())) {
		            $thispath = str_replace('\\', '/', $file);
		            $thisfile = utf8_encode($file->getFilename());
		            $results = array_merge_recursive($results, array($thispath));
		        }
		    }
		}

		return $results;
	}
}