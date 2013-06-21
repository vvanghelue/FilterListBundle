Declare the manifest class
--------------------------

<pre>
namespace My\Pretty\Namespace;


use VVG\FilterListBundle\FilterList\FilterListBase;
use VVG\FilterListBundle\Field\FilterListField;


class PrettyilterList extends FilterListBase 
{
  public function configureFields()
    {
    ...
    }
}

</pre>

Usage in controllers
--------------------

<pre>
/**
 * @Route("/pretty/list", name="Admin_pretty_list")
 * @Template()
 */
public function listeAction()
{
    $request = $this->get('request');
    return $this->get('filterlist')
                ->loadList(new PrettyFilterList())
                ->bindRequest($request);
}
</pre>
