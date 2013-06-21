<?php

namespace VVG\Bundle\FilterListBundle\Field;

class FilterListField {

	protected $name;
	
	protected $diplayName;
	
	protected $type;
	
	protected $isFiltrable = true;
	
	protected $isDefaultSortField = false;
	
	protected $sortType = '';
	
	protected $value;
	
	public function setName($name)
	{
		$this->name = $name;
	}
	
	public function getName()
	{
		return $this->name;
	}

	public function setIsDefaultSortField($sortType)
	{
		 $this->isDefaultSortField = true;
		 $this->sortType           = $sortType;
	}
	
	public function getIsDefaultSortField()
	{
		return $this->isDefaultSortField;
	}
		
	public function getSortType()
	{
		return $this->sortType;
	}
	
	public function setDisplayName($diplayName)
	{
		$this->diplayName = $diplayName;
	}
	
	public function getDisplayName()
	{
		return $this->diplayName;
	}
		
	public function setType($type)
	{
		$this->type = $type;
	}
	
	public function setIsFiltrable($filtrable = true)
	{
		$this->isFiltrable = $filtrable;
	}
	
	public function getIsFiltrable()
	{
		return $this->isFiltrable;
	}
	
	public function setIsSortable($sortable = true)
	{
		$this->isSortable = $sortable;
	}
	
	public function getIsSortable()
	{
		return $this->isSortable;
	}
	
	public function joinTable(array $options)
	{
		
	}
	
	public function allowInlineEdit($allow = true)
	{
		
	}
	
	public function setValue($value)
	{
		$this->value = $value;
	}
	
	public function getValue()
	{
		return $this->value;
	}
}
