<?php
/**
 * Cycles between a list of values; calls to the tag will return each value in turn
 * 
 * @example
 * {%cycle "one", "two"%} {%cycle "one", "two"%} {%cycle "one", "two"%}
 * 
 * this will return:
 * one two one
 * 
 * Cycles can also be named, to differentiate between multiple cycle with the same values:
 * {%cycle 1: "one", "two" %} {%cycle 2: "one", "two" %} {%cycle 1: "one", "two" %} {%cycle 2: "one", "two" %}
 * 
 * will return
 * one one two two
 * 
 * @package Liquid
 * @copyright Copyright (c) 2011-2012 Harald Hanek, 
 * fork of php-liquid (c) 2006 Mateo Murphy,
 * based on Liquid for Ruby (c) 2006 Tobias Luetke
 * @license http://harrydeluxe.mit-license.org
 */

class LiquidTagArray extends LiquidTag
{
    /**
     * @var string The variable to assign from
     */
    private $_from;

    /**
     * @var string The variable to assign to
     */
    private $_to;

    /**
     * Constructor
     *
     * @param string $markup
     * @param array $tokens
     * @return CycleLiquidTag
     */
    public function __construct($markup, &$tokens, &$fileSystem)
    {
        $syntaxRegexp = new LiquidRegexp('/(\w+)\s*=\s*(' . LIQUID_QUOTED_FRAGMENT . '+)/');
        if ($syntaxRegexp->match($markup)) {
            $this->_to = $syntaxRegexp->matches[1];
            $this->_from = $syntaxRegexp->matches[2];
        } else {
            throw new LiquidException("Syntax Error in 'array' - Valid syntax: array [var] = 'key => value, key2 => value2'");
        }
    }


    /**
     * Renders the tag
     * 
     * @var LiquidContext $context
     * @return string
     */
    public function render(&$context)
    {
        $arrayRegexp = '/([a-zA-Z0-9_.-]+)\s*=>\s*([^,\']+),*\s*/';
        preg_match_all($arrayRegexp, $this->_from, $matches, PREG_SET_ORDER);

        $this->array_items = array();

        if(!empty($matches)){
            foreach ($matches as $match) {
                $this->array_items[$match[1]] = $match[2];
            }
        } else {
            throw new LiquidException("Syntax Error in 'array' - Valid syntax: array [var] = 'key => value, key2 => value2'");
        }

        $context->set($this->_to, $this->array_items, true);
    }

}
