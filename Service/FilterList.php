<?php

namespace VVG\FilterListBundle\Service;

class FilterList {
	
	protected $_doctrine;
	
	protected $_router;

	function __construct($doctrine, $router)
	{
		$this->_router   = $router;
		$this->_doctrine = $doctrine;
	}

	public function loadList($listInstance)
	{
		$listInstance->setDoctrine($this->_doctrine);
		$listInstance->setRouter($this->_router);
		$listInstance->configureFields();
		$listInstance->configureRepository();
		$listInstance->configureQuery();

		return $listInstance;
	}
}