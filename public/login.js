/**
* Javascript handling AJAX
**/

//event listener
$("#login").click(login);


//Post method
function login(event) {
    var username = $("#username").val();
    var password = $("#password").val();
    $.post("/login", {
        username: username,
        password: password
    },
        function(data, status) {
        //check status 200 is ok 
        console.log(data, status);
        if (status == "success")
        {
            if(data == "Invalid Username or Password") {
                $("#errorMessage").html(data);
            }
            else {
                window.location = "/success";
            }
        }
    });
}