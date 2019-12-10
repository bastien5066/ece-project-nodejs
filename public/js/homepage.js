$(document).ready(function() {
    $(".sign-up").click(function() {
        $('.sign-in').toggle(500);
        $('.sign-up-form').toggle(500);
    });
    $(".sign-in").click(function() {
        $('.sign-up').toggle(500);
        $('.sign-in-form').toggle(500);
    });
    $(".msg-error").fadeTo(6000, 5, function() {
        $(this).slideUp(500, function() {
            $(this).remove();
        });
    });
    $(".msg-success").fadeTo(6000, 5, function() {
        $(this).slideUp(500, function() {
            $(this).remove();
        });
    });

});