FilterLitstBundle
=================

Symfony2 bundle generating dynamic filtered (client-side) lists using jQuery.

Your filtered list are builded using a behavior class binded in controllers.


Installation
===========

To install this bundle please follow the next steps:

First add the dependencies to your `composer.json` file:

```json
"require": {
    ...
    "vvg/filterlist-bundle": "dev-master"
},
```

Then install the bundle with the command:

```sh
php composer update
```

Enable the bundle in your application kernel:

```php
<?php
// app/AppKernel.php

public function registerBundles()
{
    $bundles = array(
        // ...
        new VVG\Bundle\FilterListBundle\VVGFilterListBundle(),
    );
}
```

Then install the assets using the command:

```sh
php app/console assets:install web
```

Declare the behavior class

```php
<?php

namespace Tessi\JobBundle\FilterList;


use VVG\Bundle\FilterListBundle\FilterList\FilterListBase;
use VVG\Bundle\FilterListBundle\Field\FilterListField;


class RunningTasks extends FilterListBase 
{
    public function configureFields()
    {
        $field = new FilterListField();
        $field->setName('ean_code');
        $field->setIsFiltrable(true);
        $field->setIsSortable(true);
        $field->setDisplayName('Ean code');
        $this->addField($field);

        $field = new FilterListField();
        $field->setName('product_name');
        $field->setIsFiltrable(true);
        $field->setIsSortable(true);
        $field->setDisplayName('Product name');
        $this->addField($field);
	
	$field = new FilterListField();
        $field->setName('store_name');
        $field->setIsFiltrable(true);
        $field->setIsSortable(true);
        $field->setDisplayName('Store name');
        $this->addField($field);
        
	...
    }
    
    public function configureRepository()
    {
        $repo = $this->getDoctrine()->getManager()->getRepository('CommerceBundle:Product');
        $this->setRepository($repo);
    }
	
    public function configureQuery()
    {
        $queryBuilder = $this->getRepository()->createQueryBuilder('p');
        $queryBuilder->innerjoin('p.store', 's');
	
        $this->setQueryBuilder($queryBuilder);
    }

    public function configureFieldQuery($fieldName, $fieldValue)  
    {	
        if($fieldName == 'ean_code')
        {
            $this->getQueryBuilder()->andWhere("p.ean = '". $fieldValue . "'");
        }

        if($fieldName == 'product_name')
        {
            $this->getQueryBuilder()->andWhere("p.name LIKE '%". $fieldValue ."%'");
        }

        if($fieldName == 'store_name')
        {
            $this->getQueryBuilder()->andWhere("s.name LIKE '%". $fieldValue ."%'");
        }
    }

    public function configureOrderByQuery($fieldName, $sort)
    {
        if($fieldName == 'ean_code')
        {
            $this->getQueryBuilder()->orderBy("t.id", $sort);
        }
        ...
        //same way
    }

    public function getFieldResult($fieldName, $result)
    {
        if($fieldName == 'ean_code')
        {
            return $result->getEan();
        }
        ...
        //same way
        if($fieldName == 'store_name')
        {
            return $result->getStore()->getName();
        }
    }

    public function getTotalCountResult()
    {
        return 'COUNT(p)';
    }

    public function hrefLink($result)
    {
        return $this->getRouter()->generate('Admin_product_detail', array('idproduct' => $result->getId()));
    }

    public function getPrimary($result)
    {
        return $result->getId();
    }
    
 
    //Events on selected data
    public function getEvents()
    {
        return array(
	    'onDelete'    => 'Delete task',
	    'onSomething' => 'Do something'
        );
    }

    //Selected data manipulation method
    protected function onDelete($entity)
    {
        $this->getDoctrine()->getManager()->remove($entity);
        $this->getDoctrine()->getManager()->flush();
    }

    //Selected data manipulation method
    protected function onSomething($entity)
    {
        $entity->setSomething('foo');
        
        $this->getDoctrine()->getManager()->persist($entity);
        $this->getDoctrine()->getManager()->flush();
    }

}
```

Usage in controllers:

```php
    #Your\Application\Controller\DefaultController.php
    
    /**
	 * @Route("/admin/fancy_list", name="Admin_fancy_list")
	 * @Template()
	 */
	public function mainAction()
	{
        $fancyList = $this->get('filterlist')
                   ->setList(new FancyList())
                   ->getClientList($this->generateUrl('Admin_fancy_list_ajax'));

    	return array(
            'foo'       => 'bar',
            'fancyList' => $fancyList
        );
	}
    
    /**
     * @Route("/admin/fancy_list/ajax", name="Admin_fancy_list_ajax")
     * @Template()
     */
    public function fancyListAjaxAction()
    {
        return $this->get('filterlist')
                ->setList(new FancyList())
                ->bindAjaxRequest($this->get('request'));
    }
```


Usage in views:

```html
    <!-- Put this in your layout -->
    <link rel="stylesheet" href="{{ asset('bundles/vvgfilterlist/css/VVGFilterList.css') }}" />
    <script src="{{ asset('bundles/vvgfilterlist/js/VVGFilterList.js') }}"></script>
    
    
    <!-- Put this in your views -->
    {% include 'VVGFilterListBundle::list.html.twig' with {'data': tasksList, 'listName' : 'Tasks'} %}
```
