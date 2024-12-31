$(document).ready(function() {
    // Hide all sub-dropdowns initially
    $('.sub-dropdown-content').hide();

    // Show sub-dropdown on hover (replace click with hover for showing)
    $('.dropdown-content > li').hover(function() {
        $(this).find('.sub-dropdown-content').show();
    }, function() {
        $(this).find('.sub-dropdown-content').hide();
    });

    // Hide sub-dropdown when clicking outside (optional if you prefer hover)
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown-content').length) {
            $('.sub-dropdown-content').hide();
        }
    });
});
