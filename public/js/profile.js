$(document).ready(function() {

    function refreshDelete(path) {
        $("#metrics-delete").empty();
        var request = $.getJSON(path, function(data) {
            var txt = '';
            data.forEach(function(element) {
                txt += '<br><span id="txt-title">Timestamp:</span> ' + element.timestamp + ' <span id="txt-title">Height:</span> ' + element.height + '<span id="txt-title">Weight:</span> ' + element.weight + '<img src="/img/trash.png" id="metrics_<%=userEmail%>_' + element.timestamp + '" class="trash" width="30px"><br>';
            });
            html = $.parseHTML(txt);
            $('#metrics-delete').append(html);
        }).fail(function(request, status, error) {
            console.log('error', status, error)
        }).always(function() {
            console.log("complete");
        });
    }

    function refreshUpdate(path) {
        $("#metrics-update").empty();
        var request = $.getJSON(path, function(data) {
            var txt = '';
            data.forEach(function(element) {
                txt += ' <form id="' + element.timestamp + '" action="/user/<%= userName %>/metrics/update/metrics_<%=userEmail%>_' + element.timestamp + '" method="POST">' +
                    '<br><span id="txt-title">Timestamp:</span>' + element.timestamp +
                    '<span id="txt-title">Height:</span> <input class="update-field" min="1" max="999" type="number" name="metric_height" id="metric_height" value="' + element.height +
                    '"><span id="txt-title">Weight:</span> <input class="update-field" min="1" max="999" type="number" name="metric_weight" id="metric_weight" value="' + element.weight +
                    '"><button type="submit" value="" id="metrics_<%=userEmail%>_' + element.timestamp + '" class="btn-update" width="30px"></button><br></form>';
            });
            html = $.parseHTML(txt);
            $('#metrics-update').append(html);
        }).fail(function(request, status, error) {
            console.log('error', status, error)
        }).always(function() {
            console.log("complete");
        });

    }


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
    $("#form-button-metrics").click((e) => {
        $.ajax({
            url: '/user/<%= userName %>/metrics/create',
            success: function(data) {
                $("#weight").val("");
                $("#height").val("");
                refreshDelete("/user/<%= userName %>/metrics/read");
                refreshUpdate("/user/<%= userName %>/metrics/read");
            }
        });
    });
    $(".trash").live('click', function() {
        var paramID = $(this).attr("id");
        $('form#deleteForm').attr('action', '/user/<%= userName %>/metrics/delete/' + paramID);
        $('form#deleteForm').submit();
        refreshDelete("/user/<%= userName %>/metrics/delete/" + paramID)
        refreshUpdate("/user/<%= userName %>/metrics/read");
    });
    $(".btn-update").live('click', function() {
        var paramID = $(this).attr("id");
        $.ajax({
            url: '/user/<%= userName %>/metrics/update/' + paramID,
            success: function(data) {
                refreshUpdate('/user/<%= userName %>/metrics/update/' + paramID)
                refreshDelete("/user/<%= userName %>/metrics/read");
            }
        });

    });

    $('#search-delete').click((e) => {
        e.preventDefault();
        refreshDelete("/user/<%= userName %>/metrics/read");
    })
    $('#search-update').click((e) => {
        e.preventDefault();
        refreshUpdate("/user/<%= userName %>/metrics/read");
    });
    $('.update-field').live('input', function() {
        $(this).css('color', 'red');
        $("[type='number']").keypress(function(evt) {
            evt.preventDefault();
        });
    });
});