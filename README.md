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
