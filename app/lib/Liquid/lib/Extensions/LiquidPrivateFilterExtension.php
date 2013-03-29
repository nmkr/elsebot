<?php 
class LiquidPrivateFilterExtension
{

    public function template_url($file_name){
        if(substr($file_name, 0, 1) != '/'){
            $file_name = '/' . $file_name;
        }

        return TEMPLATE_PATH . $file_name;
    }

}