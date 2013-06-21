<?php

namespace VVG\Bundle\FilterListBundle\FilterList;

use VVG\FilterListBundle\Field\FilterListField as Field;
use Doctrine\Bundle\DoctrineBundle\Registry as DoctrineRegistry;

interface FilterListInterface
{
	public function configureFields();
	
	public function setDoctrine(DoctrineRegistry &$doctrineInstance);
	
	public function getDoctrine();
	
	public function setRouter(&$router);
	
	public function getRouter();
	
	public function configureRepository();
	
	public function configureQuery();
	
	public function configureFieldQuery($fieldName, $fieldValue);
	
	public function configureOrderByQuery($fieldName, $sort);
	
	public function getFieldResult($fieldName, $result);
	
	public function getTotalCountResult();
	
	public function getPrimary($result);
	
	public function getEvents();
}
