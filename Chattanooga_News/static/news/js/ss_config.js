define([/*'jquery',*/ 'jquery.smoothState.min'/*, 'velocity'*/, 'functions'/*, 'plugins.min'*/], function (require) {
    
    // All the functions and code below provides functionality to the page
    // These functions are modified before being reinitialized in the onAfter section of the smoothState delcaration

    var current_color = ""

    if (window.location.pathname == '/stats/') {

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['', 'Posted Articles', 'Relevant Articles'],
                ['Chattanoogan', Number($('span#scraped_chattanoogan').text()), Number($('span#relevant_chattanoogan').text())],
                ['Chronicle', Number($('span#scraped_chronicle').text()), Number($('span#relevant_chronicle').text())],
                ['Chattanooga TFP', Number($('span#scraped_tfp').text()), Number($('span#relevant_tfp').text())],
                ['Fox Chattanooga', Number($('span#scraped_fox_chattanooga').text()), Number($('span#relevant_fox_chattanooga').text())],
                ['Local 3 News', Number($('span#scraped_local_three').text()), Number($('span#relevant_local_three').text())],
                ['Nooga Today', Number($('span#scraped_nooga_today').text()), Number($('span#relevant_nooga_today').text())],
		['Pulse', Number($('span#scraped_pulse').text()), Number($('span#relevant_pulse').text())],
                ['WDEF', Number($('span#scraped_wdef').text()), Number($('span#relevant_wdef').text())]
            ]);

            var options = {
                chart: {
                    title: 'Chattanooga News Relevancy',
                    subtitle: 'Click/hover the bars for more info',
                },
                bars: 'horizontal',
                backgroundColor: {
                    fill: current_color
                },
                chartArea: {
                    backgroundColor: current_color
                }
            };

            var chart = new google.charts.Bar(document.getElementById('chart_div'));

            chart.draw(data, google.charts.Bar.convertOptions(options));

        }
    }
    
    var menu_link_clicked;
    var last_clicked;
    var rotate_amount = 0;
    
    $('.menu-item').click(function() {
        if ($('body').hasClass("device-xs") || $('body').hasClass("device-s") || $('body').hasClass("device-md")) {

            $('.primary-menu').velocity("slideUp", {duration: 500});

        }

        menu_link_clicked = $(this).find('.menu-link').attr('href');


    });

    $('.nav-item').click(function() {
        var clickedBtnID = this.id;
        var publisher = $(this).text().trim();
        $("li.active").toggleClass("active");
        $("li#" + clickedBtnID).toggleClass("active");
        if (this.id == 'all-nav' && clickedBtnID != last_clicked) {
            $(window).scrollTop(0);
            $(".col-md-4").velocity("fadeOut", { duration: 250 });
            $("h3#post-identifier").text('All Local Articles');
            $(".col-md-4").velocity("fadeIn", { duration: 500 });
        } else {
            if (clickedBtnID != last_clicked) {
                $(".col-md-4").velocity("fadeOut", { duration: 250 });
                $(window).scrollTop(0);
                $("div.col-md-4").not( function() {
                    if ($("article.entry > div.entry-title > div.entry-categories > a#published_by", this).text().includes(publisher)) {
                        $(this).velocity("fadeIn", { duration: 500 });
                        return true;
                    }
                });
                $("h3#post-identifier").text(publisher + ' Articles');
            }
        }
        last_clicked = this.id;
        return false;
    });

    $('.dark-mode').on( 'click', function() {
        jQuery("body").toggleClass('dark');
        if (jQuery("body").hasClass("dark")) {
            sessionStorage.colorScheme = "dark";
        }
        else {
            sessionStorage.colorScheme = "light";
        }
        SEMICOLON.header.logo();
        return false;
    });

    $(document).ready(function() {

        $('#main').velocity("fadeIn", {duration: 500});
        $('#content').velocity("fadeIn", {duration: 1000});

	// Loading animation
        /*$('#header-logo').velocity("fadeIn", {duration: 1000});
        $('#header-menu').velocity("fadeIn", {duration: 1250});
        $('#post-identifier').velocity('fadeIn', {duration: 1500});
        $('#publisher-menu').velocity("fadeIn", {duration: 1500});
        $('#found-articles').velocity('fadeIn', {duration: 1750});*/
	
	$(window).scrollTop(0);

	if ($('body').hasClass('device-xs') || $('body').hasClass('device-sm')) {
            $('#stats_break').attr("style", "display: block;")
        }
	
	if (typeof(Storage) !== "undefined") {
            if (sessionStorage.colorScheme == "light") {
		$("body").toggleClass("dark");
		SEMICOLON.header.logo();
            }
	}
	
    });

    // Smoothstate config and declaration
    (function ($) {
        'use strict';
        var translate_amount = 10,
            content  = $('#main').smoothState({

            loadingClass: "is-loading",

            blacklist: '.no-smoothstate',

             // onStart runs as soon as link has been activated
             onStart : {

                 // Set the duration of our animation
                 duration: 500,

                 // Alterations to the page
                 render: function ($container) {

                    if ($('body').hasClass("device-xs") || $('body').hasClass("device-s") || $('body').hasClass("device-md")) {
                        $('body').removeClass('primary-menu-open');
                    }

                    //animation tree
                     $('#content').velocity({
                         display: 'block',
                         opacity: 0,
                         translateZ: 0,
                         duration: 250
                     });
                
                 }
             },

             onReady : {

                duration: 600,

                render: function ($container, $newContent) {

                    var new_content_section = $($newContent[2]).find('.content-wrap')[0];
                    $('#content').html(new_content_section);

                    /*$('#content').velocity({
                        opacity: 1,
                        translateZ: 0,
			duration: 500
                    });*/

		    setTimeout(function() {$('#content').velocity({
                        opacity: 1,
                        translateZ: 0,
                        duration: 500
                    });}, 100)
		    
		    var current_color = ""

		    if (window.location.pathname == '/stats/') {

			google.charts.load('current', {'packages':['bar']});
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
			    var data = google.visualization.arrayToDataTable([
				['', 'Posted Articles', 'Relevant Articles'],
				['Chattanoogan', Number($('span#scraped_chattanoogan').text()), Number($('span#relevant_chattanoogan').text())],
				['Chronicle', Number($('span#scraped_chronicle').text()), Number($('span#relevant_chronicle').text())],
				['Chattanooga TFP', Number($('span#scraped_tfp').text()), Number($('span#relevant_tfp').text())],
				['Fox Chattanooga', Number($('span#scraped_fox_chattanooga').text()), Number($('span#relevant_fox_chattanooga').text())],
				['Nooga Today', Number($('span#scraped_nooga_today').text()), Number($('span#relevant_nooga_today').text())],
				['Pulse', Number($('span#scraped_pulse').text()), Number($('span#relevant_pulse').text())],
				['WDEF', Number($('span#scraped_wdef').text()), Number($('span#relevant_wdef').text())],
				['WRCB', Number($('span#scraped_wrcb').text()), Number($('span#relevant_wrcb').text())]
			    ]);
			    
			    var options = {
				chart: {
				    title: 'Chattanooga News Relevancy',
				    subtitle: 'Click/hover the bars for more info',
				},
				bars: 'horizontal',
				backgroundColor: {
				    fill: current_color
				},
				chartArea: {
				    backgroundColor: current_color
				}
			    };

			    var chart = new google.charts.Bar(document.getElementById('chart_div'));
			    
			    chart.draw(data, google.charts.Bar.convertOptions(options));

			}
		    }
		    
                }
             },

             onAfter : function($container, $newContent) {

                requirejs(['plugins_easing']);
                requirejs(['functions']);
                requirejs(['plugins.min']);

                var last_clicked;

                $('.nav-item').click(function() {
                    var clickedBtnID = this.id;
                    var publisher = $(this).text().trim();
                    $("li.active").toggleClass("active");
                    $("li#" + clickedBtnID).toggleClass("active");
                    if (this.id == 'all-nav') {
                        $(window).scrollTop(0);
                        $(".col-md-4").velocity("fadeOut", { duration: 250 });
                        $("h3#post-identifier").text('All Local Articles');
                        $(".col-md-4").velocity("fadeIn", { duration: 500 });
                    } else {
                        $(".col-md-4").velocity("fadeOut", { duration: 250 });
                        $(window).scrollTop(0);
                        $("div.col-md-4").not( function() {
                            if ($("article.entry > div.entry-title > div.entry-categories > a#published_by", this).text().includes(publisher)) {
                                $(this).velocity("fadeIn", { duration: 500 });
                                return true;
                            }
                        });
                        $("h3#post-identifier").text(publisher + ' Articles');
                    }
                    return false;
                });

                $(document).ready(function() {
                    //$('#main').velocity("fadeIn", {duration: 2000});
                    //$('#content').velocity("fadeIn", {delay: 1000, duration: 2000});

                    $('.primary-menu').removeAttr('style');
                    $('.menu-container').removeAttr('style');

		    $(window).scrollTop(0);

		    if ($('body').hasClass('device-xs') || $('body').hasClass('device-sm')) {
			$('#stats_break').attr("style", "display: block;")
		    }
		    
		    if (typeof(Storage) !== "undefined") {
			if (localStorage.colorScheme == "light") {
			    $("body").toggleClass("dark");
			    SEMICOLON.header.logo();
			}
		    }
		    
                });




             }
         }).data('smoothState'); // makes public methods available
    })(jQuery);

    $('#reload-trigger').click(function() {
        // Animate the icon
        rotate_amount = rotate_amount - 360;
        $(this).velocity({rotateZ: String(rotate_amount) + "deg"});
        if ($('body').hasClass('primary-menu-open')) {
            $('.primary-menu').velocity("slideUp", {duration: 500});
            $('body').removeClass('primary-menu-open');
        }
        $('#content').velocity("fadeOut", {duration: 500});
        $('#main').velocity("fadeOut", {duration: 750});
	/*$('#header-logo').velocity("fadeOut", {duration: 1250});
        $('#header-menu').velocity("fadeOut", {duration: 1000});
        $('#post-identifier').velocity('fadeOut', {duration: 750});
        $('#publisher-menu').velocity("fadeOut", {duration: 750});
        $('#found-articles').velocity('fadeOut', {duration: 500});*/

	setTimeout(function() {location.reload(); return true;}, 800);

    });
    
    function addDate() {

        var weekday = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"],
            month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            a = new Date();

        $('.date-today span').html( weekday[a.getDay()] + ', ' + month[a.getMonth()] + ' ' + a.getDate() );

    }

    addDate();

});

