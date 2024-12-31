$(document).ready(function(){
    "use strict";
    
    /*==================================
    * Author        : "ThemeSine"
    * Template Name : Khanas HTML Template
    * Version       : 1.0
    ==================================== */

    /*=========== TABLE OF CONTENTS ===========
    1. Scroll To Top 
    2. Smooth Scroll spy
    3. Progress-bar
    4. owl carousel
    5. welcome animation support
    ======================================*/

    // 1. Scroll To Top 
    $(window).on('scroll',function () {
        if ($(this).scrollTop() > 600) {
            $('.return-to-top').fadeIn();
        } else {
            $('.return-to-top').fadeOut();
        }
    });
    $('.return-to-top').on('click',function(){
        $('html, body').animate({
            scrollTop: 0
        }, 1500);
        return false;
    });
    
    // 2. Smooth Scroll spy
        
    $('.header-area').sticky({
        topSpacing:0
    });
        
    // Smooth Scroll for internal links
    $('li.smooth-menu a:not([href^="http"])').bind("click", function(event) {
        event.preventDefault();
        var anchor = $(this);
        var target = $(anchor.attr('href')); // Check if target exists
        if(target.length) { // If target exists, do smooth scroll
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 0
            }, 1200,'easeInOutExpo');
        } else {
            // If the target doesn't exist, log it - this might be an external link or link error
            console.log("Link target not found in DOM, likely an external link or error in href.");
            // Uncomment the below line if you want to stop navigation for non-existent internal links
            // event.preventDefault();
        }
    });

    // Allow external links to open normally
    $('li.smooth-menu a[href^="http"]').on('click', function(e) {
        // Log the click for debugging
        console.log('External link clicked:', this.href);
        // No need to prevent default for external links
    });

    $('body').scrollspy({
        target:'.navbar-collapse',
        offset:0
    });

    // 3. Progress-bar
    
    var dataToggleTooTip = $('[data-toggle="tooltip"]');
    var progressBar = $(".progress-bar");
    if (progressBar.length) {
        progressBar.appear(function () {
            dataToggleTooTip.tooltip({
                trigger: 'manual'
            }).tooltip('show');
            progressBar.each(function () {
                var each_bar_width = $(this).attr('aria-valuenow');
                $(this).width(each_bar_width + '%');
            });
        });
    }
    
    // 4. owl carousel
    
    // i. client (carousel)
    
        $('#client').owlCarousel({
            items:7,
            loop:true,
            smartSpeed: 1000,
            autoplay:true,
            dots:false,
            autoplayHoverPause:true,
            responsive:{
                    0:{
                        items:2
                    },
                    415:{
                        items:2
                    },
                    600:{
                        items:4

                    },
                    1199:{
                        items:4
                    },
                    1200:{
                        items:7
                    }
                }
            });
            
            // Control autoplay
            $('.play').on('click',function(){
                $('#client').trigger('play.owl.autoplay',[1000])
            })
            $('.stop').on('click',function(){
                $('#client').trigger('stop.owl.autoplay')
            })

    // 5. welcome animation support

    $(window).load(function(){
        $(".header-text h2,.header-text p").removeClass("animated fadeInUp").css({'opacity':'0'});
        $(".header-text a").removeClass("animated fadeInDown").css({'opacity':'0'});
    });

    $(window).load(function(){
        $(".header-text h2,.header-text p").addClass("animated fadeInUp").css({'opacity':'0'});
        $(".header-text a").addClass("animated fadeInDown").css({'opacity':'0'});
    });

});
