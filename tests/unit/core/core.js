/*
 * mobile core unit tests
 */

(function( $ ) {
	var libName = "jquery.mobile.core.js",
			setGradeA = function(value) { $.support.mediaquery = value; },
	    extendFn = $.extend;

	module(libName, {
		setup: function(){
			$('html').removeClass('ui-mobile');
		},
		teardown: function(){
			$.extend = extendFn;
		}
	});

	$.testHelper.excludeFileProtocol(function(){
		test( "grade A browser support media queries", function(){
			setGradeA(false);
			$.testHelper.reloadLib(libName);
			ok(!$.mobile.gradeA());

			setGradeA(true);
			$.testHelper.reloadLib(libName);
			ok($.mobile.gradeA());
		});

		test( "loading the core library triggers mobilinit on the document", function(){
			expect( 1 );

			$(window.document).bind('mobileinit', function(event){
				ok(true);
			});

			$.testHelper.reloadLib(libName);
		});

		test( "enhancments are skipped when the browser is not grade A", function(){
			setGradeA(false);
			$.testHelper.reloadLib(libName);

			//NOTE easiest way to check for enhancements, not the most obvious
			ok(!$("html").hasClass("ui-mobile"));
		});

		test( "enhancments are added when the browser is not grade A", function(){
			setGradeA(true);
			$.testHelper.reloadLib(libName);

			ok($("html").hasClass("ui-mobile"));
		});

		var alterExtend = function(extraExtension){
			var extendFn = $.extend;

			$.extend = function(object, extension){
				// NOTE extend the object as normal
				var result = extendFn.apply(this, arguments);
				result = extendFn(result, extraExtension);
				return result;
			};
		};

		test( "pageLoading doesn't add the dialog to the page when loading message is false", function(){
			alterExtend({loadingMessage: false});
			$.testHelper.reloadLib(libName);
			$.mobile.pageLoading(false);
			ok(!$(".ui-loader").length);
		});

		test( "pageLoading doesn't add the dialog to the page when done is passed as true", function(){
			alterExtend({loadingMessage: true});
			$.testHelper.reloadLib(libName);
			$.mobile.pageLoading(true);
			ok(!$(".ui-loader").length);
		});

		test( "pageLoading adds the dialog to the page when done is true", function(){
			alterExtend({loadingMessage: true});
			$.testHelper.reloadLib(libName);
			$.mobile.pageLoading(false);
			ok($(".ui-loader").length);
		});

		//TODO test the rest of the library after the $loader definition
	});
})(jQuery);