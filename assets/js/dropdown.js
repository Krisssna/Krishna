$(document).ready(function() {
    // Explicitly unbind Bootsnav's events
    $('.dropdown-content > li').off('mouseenter mouseleave');
    
    // Bind your custom hover behavior
    $('.dropdown-content > li').hover(function() {
        $(this).find('.sub-dropdown-content').show();
    }, function() {
        $(this).find('.sub-dropdown-content').hide();
    });

    // Optional: Handle click behavior for mobile or to toggle visibility
    $(window).on('resize', function() {
        if ($(window).width() <= 991) { // Assuming 991px is the breakpoint Bootsnav uses
            $('.dropdown-content > li').off('hover'); // Remove hover events for mobile
            $('.dropdown-content > li > a').on('click', function(e) {
                e.preventDefault(); // Prevent the default action of the link
                $(this).next('.sub-dropdown-content').toggle();
            });
        } else {
            $('.dropdown-content > li > a').off('click'); // Remove click events for desktop
        }
    }).trigger('resize'); // Trigger resize to set initial state
});
