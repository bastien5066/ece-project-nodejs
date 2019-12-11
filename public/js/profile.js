$(document).ready(function() {
    $(".title").fadeTo(5000, 0.001, function() {
        $(this).slideUp(500, function() {
            $(this).remove();
        });
    });
    $("#password").click(function() {
        if ($(this).attr("type") === 'password') {
            $(this).prop("type", "text");
            $(this).css("background-image", "url(../img/visibility.png)");
        } else {
            $(this).prop("type", "password");
            $(this).css("background-image", "url(../img/no-visibility.png)");
        }
    });
    $(".profile").click(function() {
        $('.metrics').toggle(500);
        $('.profile-form').toggle(500);
    });
    $(".metrics").click(function() {
        $('.profile').toggle(500);
        $('.metrics-action').toggle(500);
        $(".metrics-create").hide("slow");
        $(".metrics-read").hide("slow");
        $(".metrics-update").hide("slow");
        $(".metrics-delete").hide("slow");

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
    $("#btn-settings").click(function() {
        $("#btn-settings").toggleClass("rotate");
        $(".metrics-create").hide("slow");
        $(".metrics-read").hide("slow");
        $(".metrics-update").hide("slow");
        $(".metrics-delete").hide("slow");
    });
    $("#btn-settings").click(function() {
        $('#btn-create').toggle(500);
        $('#btn-read').toggle(500);
        $('#btn-update').toggle(500);
        $('#btn-delete').toggle(500);
    });

    $("#btn-create").click(function() {
        $(".metrics-create").toggle(500);
    });
    $("#btn-read").click(function() {
        $(".metrics-read").toggle(500);
    });
    $("#btn-update").click(function() {
        $(".metrics-update").toggle(500);
    });
    $("#btn-delete").click(function() {
        $(".metrics-delete").toggle(500);
    });
    $('#hide-delete').click((e) => {
        if (($('#metrics-delete').is(':visible'))) {
            $('#hide-delete').attr("src", "/img/no-visibility.png");
        } else {
            $('#hide-delete').attr("src", "/img/visibility.png");
        }
        $('#metrics-delete').toggle(500);
    });
    $('#hide-update').click((e) => {
        if (($('#metrics-update').is(':visible'))) {
            $('#hide-update').attr("src", "/img/no-visibility.png");
        } else {
            $('#hide-update').attr("src", "/img/visibility.png");
        }
        $('#metrics-update').toggle(500);
    });
    $("[type='number']").keypress(function(evt) {
        evt.preventDefault();
    });
});