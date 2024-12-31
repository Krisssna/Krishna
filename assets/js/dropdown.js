
$(document).ready(function() {
    // Hide all sub-dropdowns initially
    $('.sub-dropdown-content').hide();

    // Toggle sub-dropdown on click
    $('.dropdown-content > li > a').on('click', function(e) {
        e.preventDefault();
        $(this).next('.sub-dropdown-content').toggle();
    });

    // Hide sub-dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown-content').length) {
            $('.sub-dropdown-content').hide();
        }
    });
});
