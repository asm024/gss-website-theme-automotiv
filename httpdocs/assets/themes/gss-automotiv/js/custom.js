// NOTICE!! THIS IS REQUIRED TO MAKE YOUR NETO SHOPPING CART WORK
// DO NOT REMOVE UNLESS YOU REALLY KNOW WHAT YOU ARE DOING

var nCustom = {
	vars : {
		focused : $('body'),
		lastFocused : $('body')
	},
	funcs : {
		initPageFuncs: function() {
			// Ajax Wish List
			$.addToWishList({
				'class': 'wishlist_toggle',
				'textclass': 'wishlist_text',
				'htmlon': '<i class="fas fa-star" aria-hidden="true"></i>',
				'htmloff': '<i class="far fa-star" aria-hidden="true"></i> Wishlist',
				'tooltip_css': 'whltooltips',
				'imageon': '',
				'imageoff': ''
			});
			// Ajax Add To Cart
			$.addToCartInit({
				'cart_id' :  'cartcontents',
				'target_id': 'cartcontentsheader',
				'image_rel': 'itmimg'
			});

			// Part Finder
			$.compatListInit({});
			$(".compatibility_list").change(function() {
			    $.buildCompatList($(this));
			});
			$("#compat_list").change(function() {
			    $("#compat_list .compat-btn").html("<i class='fa fa-spinner fa-spin'></i>").attr("disabled","disabled");
			    if($("#compat_list .compatibility_list:first").val() !== ''){
    				$(document).ajaxComplete(function(ev, jqXHR, settings) {
                        if(jqXHR['status'] == 200){
        				    $("#compat_list .compat-btn").html("Go").removeAttr("disabled");
                        }
    				});
			    } else {
			        $("#compat_list .compat-btn").html("Go");
			    }
			});

			// Renders the instant search results - edit design of ajax results here
			$.initSearchField({
				'result_header'		: '<ul class="nav nav-list">',
				'result_body'		: '<li><a href="##url##" search-keyword="##keyword##"><img border="0" src="##thumb##" width="36" height="36"/><span class="title">##model##</span></a></li>',
				'result_footer'		: '</ul>',
				'category_header'	: '<ul class="nav nav-list">',
				'category_body'		: '<li><a href="##url##"><span class="thumb"><img border="0" src="##thumb##" width="36" height="36"/></span><span class="title">##fullname##</span> <span class="label label-default">##typename##</span></a></li>',
				'category_footer'	: '</ul>'
			});
		},
		// For child product multi-add to cart function
		checkValidQty: function() {
			var found = 0;
			$('#multiitemadd :input').each(function() {
				if ($(this).attr('id').match(/^qty/)) {
					if ($(this).val() > 0) {
						found = 1;
					}
				}
			});
			if (found == 0) {
				$.nPopupBox('Please specify a quantity before adding to cart');
				return false;
			}
			return true;
		},
		// Capture the last item focused
		updateFocused: function(){
			nCustom.vars.lastFocused = nCustom.vars.focused;
		},
		// Place focus on popup
		popupFocus: function(){
			var popUp = document.getElementById('npopupDesc');
			// Configures the observer
			var config = {childList: true};
			// Create an observer instance
			var popUpObserver = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					// Initial observer
					if(mutation.addedNodes["0"]){
						nCustom.funcs.updateFocused();
						// focus on the popup
						$(popUp).attr('tabindex', '-1').trigger('focus');
					}else{
						$(popUp).attr('tabindex', '').trigger('focus');
						// Observer closing popup
						$(nCustom.vars.lastFocused).trigger('focus');
					}
				});
			});
			// Pass in the target node, as well as the observer options
			if(popUp){ popUpObserver.observe(popUp, config);}
		},
		buttonLoading: function(){
			var loadingText = $(this).attr('data-loading-text');
			var originalText = $(this).html();
			$(this).html(loadingText).addClass('disabled').prop('disabled', true);
			var pendingButton = this;
			setTimeout(function(){
				$(pendingButton).html(originalText).removeClass('disabled').prop('disabled', false);
			}, 3000);
		},
		windowPopup: function(url, width, height) {
			// Calculate the position of the popup so it’s centered on the screen.
			var left = (screen.width / 2) - (width / 2),
				top = (screen.height / 2) - (height / 2);
			window.open(url,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
		},
		// Will remove/add class from element
		classToggle: function (element, css, type){
			if(type){
				type == 'add'
					? $(element).addClass(css)
					: $(element).removeClass(css)
			}
		}
	}
}

$(document).ready(function() {
	// Neto functionalty
	nCustom.funcs.initPageFuncs();
	nCustom.funcs.popupFocus();
	// Jquery Ui Date Picker
	$('.datepicker').datepicker({ dateFormat: 'dd/mm/yy' });
	// Carousel
	$('.carousel').carousel();
	// Tooltip
	$('[data-toggle="tooltip"]').tooltip();
});
// Capture the current element the user focused in
$(document).on('focusin', function(){
	nCustom.vars.focused = document.activeElement;
});
// Btn loading state
$(document).on('click', '.btn-loads', nCustom.funcs.buttonLoading);
// Social media share
$('.js-social-share').on('click', function(e) {
	e.preventDefault();
	nCustom.funcs.windowPopup($(this).attr("href"), 500, 300);
});
// Mobile menu
$('.nToggleMenu').on('click', function(){
	var toggleTarget = $(this).attr('data-target')
	$(toggleTarget).slideToggle();
});
// Invoice page
$('#cart_items').on('click', '[data-body-add]', function(e){
	e.preventDefault();
	nCustom.funcs.classToggle('body', $(this).attr('data-body-add'), 'add');
});
$('#cart_items').on('click', '[data-body-remove]', function(e){
	e.preventDefault();
	nCustom.funcs.classToggle('body', $(this).attr('data-body-remove'), 'remove');
});
$('#_jstl__buying_options').on('click', '.js-notifymodal-in-stock', function(e){
	e.preventDefault();
	// Get values
	var sku = $(this).attr('data-sku');
	var $wrapper = $('#notifymodal .checkbox');
	var $terms = $('#notifymodal .terms_box');
	var $helpText = $('#notifymodal .checkbox .help-block');
	// Validate form
	if(!$.isChecked($terms)){
		$wrapper.addClass('has-error');
		$helpText.removeClass('hidden');
		return false;
	}else{
		$wrapper.removeClass('has-error');
		$helpText.addClass('hidden');
		// Dismiss modal
		$('#notifymodal').modal('hide');
		// Send information
		$.addNotifyBackInStock(sku, '');
		$terms.attr('checked', false);
		return true;
	}
});
// Multi add child products
$('.multi-add').on('click', function(){
    if (nCustom.funcs.checkValidQty()) { 
        $.addMultipleCartItems('multiitemadd'); 
        return false; 
    }
});

// Click & Collect — intercept checkout links in the mini-cart dropdown and anywhere else
var gssCncModalHtml = '<div class="modal fade" id="gssCncModal" tabindex="-1" role="dialog" aria-modal="true">' +
	'<div class="modal-dialog" role="document"><div class="modal-content">' +
	'<div class="modal-header"><h4 class="modal-title"><i class="fas fa-warehouse mr-2"></i>Click &amp; Collect &#8212; Important Notice</h4>' +
	'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>' +
	'<div class="modal-body">' +
	'<p>Your cart contains item(s) that are <strong>available for Click &amp; Collect only &#8212; these cannot be shipped.</strong></p>' +
	'<p>Pick up is available from <strong>Mount Druitt, NSW only</strong>, Mon&#8211;Fri 9am&#8211;4:30pm. Please allow a minimum of 3&#8211;4 hours preparation time. You will be notified when your order is ready for collection.</p>' +
	'</div><div class="modal-footer">' +
	'<button type="button" class="btn btn-secondary" data-dismiss="modal">Back</button>' +
	'<button type="button" class="btn btn-primary" id="gssCncConfirm">I Understand, Continue to Checkout</button>' +
	'</div></div></div></div>';
var gssCncTarget = '';
$(document).on('click', '#gssCncConfirm', function() {
	sessionStorage.removeItem('gss_pickup_only');
	window.location = gssCncTarget;
});
$(document).on('click', '#neto-dropdown a', function(e) {
	if (sessionStorage.getItem('gss_pickup_only') === '1') {
		var href = $(this).attr('href') || '';
		if (href.indexOf('checkout') !== -1) {
			e.preventDefault();
			gssCncTarget = href;
			if ($('#gssCncModal').length === 0) { $('body').append(gssCncModalHtml); }
			$('#gssCncModal').modal('show');
		}
	}
});
// Mobile menu
$('.navbar-collapse .burger-menu > div > .nav > li > a.dropdown-toggle').click(function(){
	if($(this).parent('li').hasClass('dah_active')){
	    $(this).parent('li').toggleClass('dah_active');
        $(this).parent('li').children("ul").toggleClass('d-none');
        $(this).children("span").children("i").toggleClass('fa-plus');
    	$(this).children("span").children("i").toggleClass('fa-minus');
	}else{
	    $('.navbar-collapse .burger-menu > div > .nav > li.dah_active > ul').toggleClass('d-none');
	    $('.navbar-collapse .burger-menu > div > .nav > li.dah_active > a > span > i').toggleClass('fa-plus').toggleClass('fa-minus');
	    $('.navbar-collapse .burger-menu > div > .nav > li.dah_active').removeClass('dah_active');
	    $(this).parent('li').toggleClass('dah_active');
        $(this).parent('li').children("ul").toggleClass('d-none');
        $(this).children("span").children("i").toggleClass('fa-plus').toggleClass('fa-minus');
	}
});
$('.navbar-collapse > .burger-menu .nav .nav > li a.dah_subcat').click(function(){
    if($(this).parent('li').hasClass('dah_active')){
	    $(this).parent('li').toggleClass('dah_active');
        $(this).parent('li').children("ul").toggleClass('d-none');
        $(this).children("span").children("i").toggleClass('fa-plus');
    	$(this).children("span").children("i").toggleClass('fa-minus');
	}else{
	    $('.navbar-collapse .burger-menu > div > .nav .nav > li.dah_active > ul').toggleClass('d-none');
	    $('.navbar-collapse .burger-menu > div > .nav .nav > li.dah_active > a.dah_subcat > span > i').toggleClass('fa-plus').toggleClass('fa-minus');
	    $('.navbar-collapse .burger-menu > div > .nav .nav > li.dah_active').removeClass('dah_active');
	    $(this).parent('li').toggleClass('dah_active');
        $(this).parent('li').children("ul").toggleClass('d-none');
        $(this).children("span").children("i").toggleClass('fa-plus').toggleClass('fa-minus');
	}
	
});