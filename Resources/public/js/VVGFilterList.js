	/**
	 * Filtered list class
	 */
	var TessiFilterList = function(options) {
		
		this.options = options;
		
		this.fields  = [];
		
		this.events  = {};
		
		this.sortField = '';
		
		this.sortType = 'desc';
		
		this.currentPage = 1;
		
		this.resultsPerPage = 20;
		
		this.initialize = function(options) {
			this.setFields();
			this.buildElement();
			this.injectElement();
			this.setActionElement();
			this.update();

			var that = this;
			window.setInterval(function() {that.update()}, 300000);
		};
		
		this.setFields = function() {
			var i = 0;
			for(var i = 0; i < this.options.fields.length; i++) {
				var field = new TessiFilterListField(this, this.options.fields[i]);
				field.initialize();

				this.fields[i] = field;
			}
		};
		
		this.buildElement = function() {
			this.element  = $('<div class="TessiFilterListTableContainer"></div>');
			this.tableB   = $('<table class="TessiFilterListTable"></table>');
			this.table    =  $('<tbody></tbody>');
			var tableHead = $('<tr></tr>')
			var td        = $('<td table="checkall"></td>');
			
			var that = this;

			this.checkbox = $('<input type="checkbox"/>');
			this.checkbox.click(function() {
				var checked = this.attr('checked');
				that.element.find('input[class=selectCheckbox]').each(function(el) {
					el.attr('checked', checked);
				});
			});

			if(this.options.events > 0) {
				tableHead.append(td.append(this.checkbox));
			}
							
			var i = 0;
			for(var i = 0; i < this.fields.length; i++) {
				tableHead.append(this.fields[i].getElement());
			}
			this.element.append(this.tableB.append(this.table.append(tableHead)));
		};
		
		this.setActionElement = function() {
			if(this.options.events.length == 0)
				return $('<span></span>');

			var selectEvents = new Element('select');
			
			var option = new Element('option', {
				'value' : '',
				'html'  : ''
			});
			selectEvents.grab(option);
				
			Object.each(this.options.events, function(v, k) {
				var option = new Element('option', {
					'value' : k,
					'html'  : v
				});
				selectEvents.grab(option);
			});
			
			var that = this;
			var applyActionButton = new Element('button', {
				'html'   : 'Appliquer',
				'events' : {
					'click' : function(){
						var action = selectEvents.getSelected().get('value');
						if(action != '')
							that.eventAction(action);
						else
							alert("Veuiller choisir une action à appliquer");
					}
				}
			});
			
			this.options.container.grab(new Element('div', {'class' : 'spacer'}).setStyle('height', '5px'));
			this.options.container.grab(selectEvents);
			this.options.container.grab(applyActionButton);
		};
		
		this.injectElement = function(){
			this.options.container.append(this.element);
		};
		
		this.eventAction = function(action) {
			var ids = [];
			this.element.getElements('input[class=selectCheckbox]').each(function(checkbox) {
				if(checkbox.get('checked'))
					ids.push(parseInt(checkbox.get('rel')));
			});
			
			if(ids.length == 0) {
				alert('Veuillez sélectionner des éléments pour appliquer une action');
				return;
			}
			
			var data = 'action=' + action;
			data += this.getActionIdsQuery(ids); 
			
			this.displayLoader();
			
			var that = this;
			new Request.JSON({
				'url'    : '',
				'method' : 'get',
				'data'   : data,
				onSuccess : function(result) {
					alert(result.message);
					that.hideLoader();
					that.update();
				}
			}).send();
		};
		
		this.getActionIdsQuery = function(ids) {
			var query = '';
			var i = 0;
			for(var i = 0; i < ids.length; i++) {
				query += '&ids[' + i + ']=' + ids[i];
			}
			return query;
		};
		
		this.update = function(){
			this.displayLoader();
			var url  = '';
			var data = '&getList=true' + this.getFieldsData();
			
			data += '&targetPage='     + this.currentPage; 
			data += '&resultsPerPage=' + this.resultsPerPage; 
			data += this.getOrderyQuery(); 
			
			this.table.addClass('onLoading');
			
			var that = this;
			$.ajax({
				'method' : 'get',
				'url'    : '',
				'noCache': true,
				'data'   : data,
				'dataType'   : 'JSON',
				success : function(results) {
					that.totalNbResults = results.totalNbResults;
					
					that.hideLoader();
					that.cleanTable();
					
					var i = 0;
					for(var i = 0; i < results.data.length; i++) {
						(function(i, results) {
							var tr = $('<tr></tr>');
							var td = $('<td></td>');
							
							var primary = results.data[i].primary;
							
							
							var checkbox = $('<input type="checkbox", class="checkbox">');
							checkbox.attr('rel', primary);

							if(that.options.events > 0) {
								tr.append(td.append(checkbox));
							}


							var link = results.data[i].href;

							var j = 0;
							for(var j = 0; j < results.data[i].fields.length; j++)
							{
								var td = $('<td></td>');
								td.html(results.data[i].fields[j]);


								td.click(function() {
									window.location.href = link;
								});
								
								tr.append(td);
							}
							
							if(i%2 != 0)
								tr.addClass('even');
							
							that.table.append(tr);

						})(i, results);
					}

					//Si il n'y a pas de résultats
					if(results.data.length == 0)
						{
							var tr = $('<tr></tr>');
							
							var td = $('<td></td>')
							td.attr('colspan', that.fields.length + 1);
							td.html('Pas de résultats');

							td.css('text-align', 'center');
							tr.append(td);
							that.table.append(tr);
						}

					//paging
					var tr = $('<tr></tr>');
					var td = $('<td class="paging"></td>');
					td.attr('colspan', that.fields.length + 1);

					var paging = new TessiFilterListPaging(that);
					paging.initialize();

					td.append(paging.getElement());
					tr.append(td);
					that.table.append(tr);

					that.table.removeClass('onLoading');
					that.checkbox.attr('checked', false);
				}
			});
		};
		
		this.updateFromResultsPerPage = function(resultsPerPage) {
			//@TODO
			
			var ratio =  1 + ( (this.resultsPerPage * (this.currentPage - 1)) + 1) / resultsPerPage;
    		
    		//return ratio;
    		var properPage = Math.floor(ratio);
    		if(properPage == 0)
    			properPage = 1;
			this.currentPage = properPage;
			
			//this.currentPage    = 1;
			this.resultsPerPage = resultsPerPage;
			this.update();
		};
		
		this.getFieldsData = function() {
			var data = '';
			var i = 0;
			for(var i = 0; i < this.fields.length; i++) {
				if(this.fields[i].search != '')
					data =  data + '&' + this.fields[i].options.fieldName + '=' + this.fields[i].search;
			}
			return data;
		};
		
		this.getOrderyQuery = function() {
			var orderByQuery = '';
			var i = 0;
			for(var i = 0; i < this.fields.length; i++) {
				if(this.fields[i].sort != '')
					orderByQuery += '&orderBy=' + this.fields[i].options.fieldName + '&sort=' + this.fields[i].sort;
			}
			return orderByQuery;
		};
		
		this.resetFieldsSort = function() {
			var i = 0;
			for(var i = 0; i < this.fields.length; i++) {
				this.fields[i].sort = '';
				this.fields[i].removeSortClasses();
			}
		};
		
		this.cleanTable = function() {
			var elements = this.table.find('tr');
			for(var i = 0;  i < elements.length; i++) {
				if(i>0)
					elements[i].remove();
			}
		};
		
		this.displayLoader = function() {
			this.loader = $('<div class="loader"></div>')
			
			this.element.append(this.loader);
		};
		
		this.hideLoader = function() {
			this.loader.remove();
		};
		
		this.getCurrentPage = function() {
			return parseInt(this.currentPage);
		};
		
		this.setCurrentPage = function(page) {
			this.currentPage = page;
		};
		
		this.resetCurrentPage = function() {
			this.currentPage = 1;
		};
	};








	/**
	 * Field class : provides fields objects for grabbing them into FilterListComponent
	 */
	var TessiFilterListField = function(filterListInstance, options) {
		
		this.filterListInstance = filterListInstance;
		this.options            = options;
		this.element            = {};
		this.search             = '';
		this.sort               = '';
		
		this.initialize = function() {
			this.sort = this.options.sort;
			this.buildElement();
		};
		
		this.buildElement = function() {
			var that = this;
			this.element  = $('<th></th>');
			var container = $('<div class="headContainer"></div>');
			var fieldName = $('<div class="fieldName"></div>');
			var input     = $('<input type="text"/>');
			input.val(that.options.displayName);
			
						
			input.change(function(){
				that.search = $(this).val();
				that.filterListInstance.resetCurrentPage();
				that.filterListInstance.update();
				if($(this).val() == '') {
					$(this).val(that.options.displayName)
				}
			});
			
			input.focus(function(){
				if($(this).val() == that.options.displayName) {
					$(this).val('')
				}
			});

			input.blur(function(){
				if($(this).val() == '') {
					$(this).val(that.options.displayName)
				}
			});
			
			if(this.options.isSortable == true)
				container.append(this.getSorterElement());
			
			if(this.options.isFiltrable == true) {
				container.append(
					fieldName.append(
						input
					)
				);
			} else {
				container.append(
					fieldName.append(
						$('<span>' + that.options.displayName + '</span>')
					)
				);
			}
			this.element.append(container);
		};
		
		this.getElement = function() {
			return this.element;
		};
		
		this.getSorterElement = function() {
			var that = this;
			this.sorter = $('<div class="sort"></div>');
			this.sorter.click(function() {
				that.sortAction();
			});

			this.setSortType(this.options.sort);
			return this.sorter;
		};
		
		this.setSortType = function(sortType) {
			this.removeSortClasses();
			switch(sortType) {
				case '' : 
					this.sorter.addClass('noSort');
				break;
				case 'desc' :
					this.sorter.addClass('sortDesc'); 
				break;
				case 'asc' :
					this.sorter.addClass('sortAsc');
				break;
			}
		};
		
		this.sortAction = function() {
			var currentFieldSort = this.sort;
			this.filterListInstance.resetFieldsSort();
			if(currentFieldSort == '' || currentFieldSort == 'asc') {
				this.sort = 'desc';
				this.setSortType('desc');
			} else {
				this.sort = 'asc';
				this.setSortType('asc');
			}
			this.filterListInstance.resetCurrentPage();
			this.filterListInstance.update();
		};
		
		this.removeSortClasses = function() {
			this.sorter.removeClass('sortDesc');
			this.sorter.removeClass('sortAsc');
		};
	};
	
	var TessiFilterListPaging = function(filterListInstance) {
		
		this.filterListInstance = filterListInstance;
		
		this.pagerPreviousNextOffset = 5;
		
		this.element = {};
		
		this.initialize = function(filterListInstance) {
			this.buildElement();
		};
		
		this.buildElement = function() {
			this.element = $('<div class="pagingContainer"></div>');

			var wording = '(' + this.filterListInstance.totalNbResults + ' results)';

			this.element.append($('<span class="totalResults">' + wording + '</span>'));
			
			this.element.append(this.getFirstPageElement());
			
			this.element.append(this.getPreviousPageElement());
			
			this.element.append(this.getPagerElement());
			
			this.element.append(this.getNextPageElement());
			
			this.element.append(this.getLastPageElement());
			
			this.element.append(this.getResultPerPageElement());
		};
		
		this.getResultPerPageElement = function() {
			resultPerPageContainer = $('<div class="resultPerPageContainer"></div>');
			resultPerPageContainer.append($('<span>Results per page</span>'));
			
			var that  = this;
			var pagingResultPerPage = $('<select></select>');
			
			var displayNbr = [10, 20, 50, 100, 500];
			for(var i = 0; i< displayNbr.length; i++) {
				var nbr    = displayNbr[i];
	            var option = $('<option></option>');
	            option.val(nbr);
	            option.html(nbr);

				if(nbr == that.filterListInstance.resultsPerPage)
					option.attr('selected', true);
				pagingResultPerPage.append(option);
			}

			var that = this;
			pagingResultPerPage.change(function(){
				var resultsPerPage = parseInt($(this).val());
				that.filterListInstance.updateFromResultsPerPage(resultsPerPage);
			});
			
			resultPerPageContainer.append(pagingResultPerPage);
			return resultPerPageContainer;
		};
		
		this.getPagerElement = function() {
			var pagerContainer = $('<span></span>');
			var pageStart = this.getPagerPageStart();
			var pageEnd = this.getPagerPageEnd();
			
			for(var page = pageStart; page < pageEnd + 1; page++) {
				var pagingPage = $('<span class="page">' + page + '</span>');
				if(page == this.filterListInstance.getCurrentPage())
					pagingPage.addClass('selectedPage');
				
				var that = this;	
				pagingPage.click(function(){
					pageToLoad = $(this).html();	
					that.filterListInstance.currentPage = pageToLoad;
					that.loadPage(pageToLoad);
				});
				pagerContainer.append(pagingPage);
			}
			return pagerContainer;
		};
		
		this.getPagerPageStart = function() {
			var i = this.filterListInstance.getCurrentPage() - this.pagerPreviousNextOffset;;
			for(var i; i <= this.filterListInstance.getCurrentPage(); i++) {
				//console.log(i);
				if(this.pageExists(i))
					return i;
			}
		};
		
		this.getPagerPageEnd = function() {
			var i = this.filterListInstance.getCurrentPage() + this.pagerPreviousNextOffset;
			for(var i; i >= this.filterListInstance.getCurrentPage(); i--) {
				//console.log(i);
				if(this.pageExists(i))
					return i;
			}
		};
		
		this.pageExists = function(page) {
			return (page > 0 && page <= this.getLastPage());
		};
		
		this.getLastPage = function() {
			//console.log(' - ' + Math.ceil(this.filterListInstance.totalNbResults / this.filterListInstance.resultsPerPage));
			return Math.ceil(this.filterListInstance.totalNbResults / this.filterListInstance.resultsPerPage); 
		};
		
		this.loadPage = function(page){
			this.filterListInstance.setCurrentPage(page);
			this.filterListInstance.update();
		};
		
		this.getFirstPageElement = function() {
			if(this.filterListInstance.getCurrentPage() == 1)
				return $('<span></span>');

			var that = this;
			var loaderElement = $('<span class="arrow"><<</span>');
			loaderElement.click(function(){
				that.loadPage(1);
			});
			return loaderElement;
		};
		
		this.getPreviousPageElement = function() {
			var page = this.filterListInstance.getCurrentPage() - 1;
			if(!this.pageExists(page))
				return $('<span></span>');
			
			var that = this;

			var loaderElement = $('<span class="arrow"><</span>');
			loaderElement.click(function(){
				that.loadPage(page);
			});
			return loaderElement;
		};
		
		this.getNextPageElement = function() {
			var page = this.filterListInstance.getCurrentPage() + 1;
			if(!this.pageExists(page))
				return $('<span></span>');
			
			var that = this;

			var loaderElement = $('<span class="arrow">></span>');
			loaderElement.click(function(){
				that.loadPage(page);
			});
			return loaderElement;
		};
		
		this.getLastPageElement = function() {
			var lastPage = this.getLastPage();
			if(this.filterListInstance.getCurrentPage() == lastPage)
				return $('<span></span>');
				
			var that = this;

			var loaderElement = $('<span class="arrow">>></span>');
			loaderElement.click(function(){
				that.loadPage(lastPage);
			});
			return loaderElement;
		};
		
		this.getElement = function() {
			return this.element;
		};
	};


var Elemente = function(trtre, tre) {
	this.addEvent = function(fsd) {};
	this.removeClass = function(fsd) {};
	this.addClass = function(fsd) {};
	this.grab = function(fsd) {};
	this.addEvent = function(fsd) {};
	this.addEvent = function(fsd) {};
	this.addEvent = function(fsd) {};
	this.addEvent = function(fsd) {};
	this.addEvent = function(fsd) {};
	this.addEvent = function(fsd) {};
	this.addEvent = function(fsd) {};
};
	