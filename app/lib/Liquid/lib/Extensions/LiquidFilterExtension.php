<?php 
class LiquidFilterExtension {

    protected static $templateLocation;

    public function __construct($templateLocation){
        self::$templateLocation = $templateLocation;
    }

    public function key($collection, $key){
        if(isset($collection[$key])){
            return $collection[$key];
        }
    }

    public function script_tag($script_url){
        return '<script src="' . $script_url . '"></script>';
    }

    public function script_url($file_name){
        if(substr($file_name, 0, 1) != '/'){
            $file_name = '/' . $file_name;
        }

        return self::$templateLocation . $file_name;
    }

    public function style_tag($style_url){
        return '<link rel="stylesheet" href="' . $style_url . '">';   
    }

    public function style_url($file_name){
        if(substr($file_name, 0, 1) != '/'){
            $file_name = '/' . $file_name;
        }

        return self::$templateLocation . $file_name;
    }

    public function translate($string, $plural = NULL, $count = NULL, $textDomain = 'default') {
    	$translate = Translate::getInstance();

    	if($plural && !$count){
    		$count = 2;
    	}

        return $translate->__($string, $plural, $count);
    }

    public function urlFor() {
        $args = func_get_args();
        $name = array_shift($args);

        $routerUrl = \Slim\Slim::getInstance()->router()->urlFor($name);

        $search = array();
        foreach ($args as $arg) {
            $search[] = '#:(.*)\+?(?!\w)#';
        }

        $routerUrl = preg_replace($search, $args, $routerUrl, PREG_SET_ORDER);
        $routerUrl = preg_replace('#\(/?:.+\)|\(|\)#', '', $routerUrl);

        return APP_PATH . $routerUrl;
    }

    public function sortTable($data, $columns){
        ob_start();
    ?>
    <table>
        <thead>
            <tr>
                <?php foreach ($columns as $value): ?>
                    <th><?php echo $value ?></th>
                <?php endforeach ?>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($data as $item): ?>
            <tr>
                <?php foreach ($columns as $value): ?>
                    <td><?php echo $item[$value] ?></td>
                <?php endforeach ?>
            </tr>
        <?php endforeach ?>
        </tbody>
    </table>
    <?php
        return ob_get_clean();
    }

}
