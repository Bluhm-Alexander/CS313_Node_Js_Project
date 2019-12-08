/**
* Javascript handling AJAX
* 
* If values are empty don't post
**/

//event listener
$("#login").click(login);


//Post method
function login(event) {
    var username = $("#username").val();
    var password = $("#password").val();

    if(username || password ) {
        $.post("/login", {
            // These are associated with the form IDs Jquery grabs them and passes them on as named variables
            username: username,
            password: password
        },
            function(data, status) {
            //check status 200 is ok 
            console.log(data, status);
            if (status == "success")
            {
                if( data["success"] == false ) {
                    $("#errorMessage").html("Invalid Username or Password");
                }
                else {
                    window.location = "/mainPage";
                }
            }
        });
    }
    else {
        $("#errorMessage").html("Invalid Username or Password");
    }
}

//logout post method
$("#logout").click(logout);

function logout(event) {
    $.post("/logout", 
        function(data, status) {
        //check status 200 is ok 
        console.log(data, status);
        if ( data["success"] == true )
        {
            window.location = "/";
        }
        else
        {
            $("#errorMessage").html("You are not logged in");
        }
    });
}