<?php

namespace VVG\Bundle\FilterListBundle\FilterList;


use Symfony\Component\HttpFoundation\Response;
use VVG\Bundle\FilterListBundle\FilterList\FilterListInterface;
use VVG\Bundle\FilterListBundle\Field\FilterListField;
use Doctrine\Bundle\DoctrineBundle\Registry as DoctrineRegistry;
use Doctrine\ORM\QueryBuilder;

abstract class FilterListBase implements FilterListInterface
{
	protected $options;

	protected $entity;
	
	//Field collection
	protected $fields;
	
	protected $_doctrine;
	
	protected $_em;
	
	protected $_repository;
	
	protected $_queryBuilder;

	protected $_router;
	
	public function setDoctrine(DoctrineRegistry &$doctrineInstance)
	{
		$this->_doctrine = $doctrineInstance;
	}
	
	public function getDoctrine()
	{
		return $this->_doctrine;
	}
	
	public function setRouter(&$router)
	{
		$this->_router = $router;
	}
	
	public function getRouter()
	{
		return $this->_router;
	}
	
	public function setRepository($repo)
	{
		$this->_repository = $repo;
	}
	
	public function getRepository()
	{
		return $this->_repository;
	}

	protected function setQueryBuilder(QueryBuilder $queryBuilder)
	{
		$this->_queryBuilder = $queryBuilder;
	}
	
	protected function getQueryBuilder()
	{
		return $this->_queryBuilder;
	}
	
	protected function addField(FilterListField $field) {
		$this->fields[] = $field;
	}
	
	protected function getFields() {
		return $this->fields;
	}
		
	public function bindRequest(&$request)
	{
        $getList = $request->query->get('getList');
		$action  = $request->query->get('action');
		
		if($getList) 
			return $this->getList($request);
		else if ($action)
			return $this->processAction($request);
		
		throw new \Exception("FilterList don't know what to bind !");
	}
	
	public function initializeFilterList()
	{
		$fields = $this->getFieldsData();
			
		$options = json_encode(array(
			'route'   => $this->getAjaxRoute(), 
			'fields'  => $fields,
			'options' => array(),
			'events'  => $this->getEvents()
		));

		return $options;

		return array_merge(array('filterListOptions' => $options));
	}
	
	protected function getFieldsData()
	{
		$arrayFields = array();
		
		foreach($this->fields as $field) {
			
			$arrayField = array(
				'fieldName'   => $field->getName(),
				//'type'        => $field->getType(),
				'displayName' => $field->getDisplayName(),
				'isFiltrable' => $field->getIsFiltrable(),
				'isSortable'  => $field->getIsSortable(),
				'sort'        => '',
			);
			
			if($field->getIsDefaultSortField())
				$arrayField['sort'] = $field->getSortType();
			
			$arrayFields[] = $arrayField;
		}
		return $arrayFields;
	}
	
	protected function processAction (&$request) {
		$action = $request->query->get('action');
		$ids    = $request->query->get('ids');
		
		$error = false;
		try{
			foreach($ids as $id) {
				$entity = $this->getRepository()->find($id);
				$this->$action($entity);
			}
		} catch(\Exception $e) {
			print $e;
			$error = true;
		}
		
		//sleep(1);
		$output = array(
			'error'   => $error,
			'message' => ($error) ? "Erreur pendant l'opération" : "Opération effectuée avec succès",
		);
		$response = new Response(json_encode($output));
		$response->headers->set('Content-Type', 'application/json');
		return $response;
	}
	
	protected function getList(&$request)
	{
		$json = array();	
        $getList = $request->query->get('getList');
        
		$targetPage     = $request->query->get('targetPage');
        $resultsPerPage = $request->query->get('resultsPerPage');
		$orderBy        = $request->query->get('orderBy');
		$sort           = $request->query->get('sort');
		
		foreach($this->fields as $field) {
			$fieldValue = $this->formatStringToQuery($request->query->get($field->getName()));
			if(!empty($fieldValue)) {
				$this->configureFieldQuery($field->getName(), $fieldValue);
			}
			
			if(!empty($orderBy) && !empty($sort))
				$this->configureOrderByQuery($orderBy, $sort);
		}
		
		$totalNbResults = $this->getTotalCount();
		
		$offset = ($targetPage - 1) * $resultsPerPage;
		
		$this->getQueryBuilder()
                ->setFirstResult($offset)
                ->setMaxResults($resultsPerPage);
		
		$results = $this->getQueryBuilder()->getQuery()->getResult();
		
		$data = array();
		foreach($results as $result) {
			$dataRow = array();
			foreach($this->fields as $field) {
				$dataRow[] = $this->getFieldResult($field->getName(), $result);
			}
					
			$data[] = array (
				'fields'  => $dataRow,
				'href'    => $this->hrefLink($result),
				'primary' => $this->getPrimary($result),
			);
		}
		
		$json['data']           = $data;
		$json['totalNbResults'] = $totalNbResults;
		
		usleep(250000);
		$response = new Response(json_encode($json));
		$response->headers->set('Content-Type', 'application/json');
		return $response;
	}

	protected function formatStringToQuery($fieldValue)
	{
		$fieldValue = str_replace("'", ' ', $fieldValue);
		$fieldValue = addslashes($fieldValue);
		return $fieldValue;
	}

	protected function getTotalCount()
	{
		$qb = clone $this->getQueryBuilder();

		return (int) $totalNbResults = $qb
			->select($this->getTotalCountResult())
 			->getQuery()
 			->getSingleScalarResult()
 		;
	}
	
	public function hrefLink($result)
	{
		return '#';
	}
	
	public function getEvents()
	{
		return array();
	}

	public function setAjaxRoute($ajaxRoute)
	{
		$this->ajaxRoute = $ajaxRoute;
	}

	public function getAjaxRoute()
	{
		return $this->ajaxRoute;
	}
}
