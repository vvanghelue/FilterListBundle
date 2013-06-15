<?php

namespace VVG\FilterListBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Tessi\GeneralBundle\FilterList\FilterListField;

class FilterListController extends Controller
{
	protected $entity;
	
	//Field collection
	protected $fields;
	
	protected function setEntity($entity) {
		$repository = $this->getDoctrine()->getManager()->getRepository($entity);
		$qb         = $repository->createQueryBuilder('e');
		
		$qb->andWhere("e.nom LIKE '%Xbox%'");
		
		$results    = $qb->getQuery()->getResult();
		
		var_dump(count($results));
		die;
		
		$this->entity = $entity;
	}
	
	protected function addField(FilterListField $field) {
		$this->fields[] = $field;
	}
	
	protected function getFields() {
		return $this->fields;
	}
		
	protected function bindRequest()
	{
		$request = $this->get('request');
        $getList = $request->query->get('getList');
		
		if($getList) 
			return $this->getList();
		else
			return $this->initializeFilterList();
	}
	
	protected function initializeFilterList()
	{
		$options = json_encode(array(
			'route'  => '', 
			'fields' =>  array(
				0 => array(
					'fieldName'   => 'nom',
					'type'        => 'string',
					'displayName' => 'Nom',
					'isFiltrable' => true,
				),
				1 => array(
					'fieldName'   => 'prix',
					'type'        => 'string',
					'displayName' => 'Prix',
					'isFiltrable' => true,
				),
				2 => array(
					'fieldName'   => 'dateAjout',
					'type'        => 'date',
					'displayName' => 'Date d\'ajout',
					'isFiltrable' => true,
				)
			),
			'options' => array(
				'sort' => array(
					'sortField' => 'nom',
					'sortType'  => 'desc',
				)
			)
		));
		return array('filterListOptions' => $options);
	}

	protected function getList()
	{
		$data = array(
			0 => array('test', 'test', 'test'),
			1 => array('test', 'test', 'test'),
			2 => array('test', 'test', 'test'),
		);
		sleep(1);
		$response = new Response(json_encode($data));
		$response->headers->set('Content-Type', 'application/json');
		return $response;
	}
}
