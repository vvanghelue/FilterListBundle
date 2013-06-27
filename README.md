FilterLitstBundle
=================

Symfony2 bundle generating dynamic filtered (client-side) lists using jQuery.


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
	$field->setName('name');
	$field->setIsFiltrable(true);
	$field->setIsSortable(true);
	$field->setDisplayName('Product name');
	$this->addField($field);
	
	$field = new FilterListField();
	$field->setName('creation_date');
	$field->setIsFiltrable(true);
	$field->setIsSortable(true);
	$field->setDisplayName('Creation date');
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
    ...
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
