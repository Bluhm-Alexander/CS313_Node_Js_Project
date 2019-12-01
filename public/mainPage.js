/**
* Javascript for mainpage
**/

// When Page loads get all pertinent information from the server
$( document ).ready(function() {
    $.get("/getUserInfo", function(data, status){
        $("#currentUser").html(data);
    });
});