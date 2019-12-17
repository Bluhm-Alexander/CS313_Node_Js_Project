/**
* Javascript handling AJAX
* 
* If values are empty don't post
**/

//event listener
$("#signup").click(signup);
$("#backToLogin").click(backToLogin);


function backToLogin(event) {
    window.location = "/";
}

//Post method
function signup(event) {
    var username = $("#username").val();
    var password = $("#password").val();
    var first_name = $("#first_name").val();
    var last_name = $("#last_name").val();

    if(username && password && first_name && last_name) {
        $.post("/signUp", {
            // These are associated with the form IDs Jquery grabs them and passes them on as named variables
            username: username,
            password: password,
            first_name: first_name,
            last_name: last_name
        },
            function(data, status) {

            if (status == "success")
            {
                if( data["success"] == false ) {
                    alert( "Error: User Name already exists in the database" );
                }
                else {
                    window.location = "/";
                }
            }
        });
    }
    else {
        alert("All fields must be filled in!")
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