<?php

namespace VVG\Bundle\FilterListBundle\Service;

class FilterList {
	
	protected $_doctrine;
	
	protected $_router;

	protected $_list_instance;

	function __construct($doctrine, $router)
	{
		$this->_router   = $router;
		$this->_doctrine = $doctrine;
	}

	public function setList($list)
	{
		$this->_list_instance = $list;
		return $this;
	}
	
	protected function getList()
	{
		return $this->_list_instance;
	}

	/*
	public function loadList($ajaxRoute)
	{
		$listInstance = $this->getList();
		$listInstance->setDoctrine($this->_doctrine);
		$listInstance->setRouter($this->_router);
		$listInstance->configureFields();
		$listInstance->configureRepository();
		$listInstance->configureQuery();

		return $listInstance;
	}
	*/

	public function getClientList($ajaxRoute)
	{
		$listInstance = $this->getList();
		$listInstance->setDoctrine($this->_doctrine);
		$listInstance->setRouter($this->_router);
		$listInstance->setAjaxRoute($ajaxRoute);
		$listInstance->configureFields();
		$listInstance->configureRepository();
		$listInstance->configureQuery();

		return $listInstance->initializeFilterList();
	}

	public function bindAjaxRequest($request)
	{
		$listInstance = $this->getList();
		$listInstance->setDoctrine($this->_doctrine);
		$listInstance->setRouter($this->_router);
		$listInstance->configureFields();
		$listInstance->configureRepository();
		$listInstance->configureQuery();

		return $listInstance->bindRequest($request);
	}
}
