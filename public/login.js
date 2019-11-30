/**
* Javascript handling AJAX
**/

function login(username, password){
    $.post("/login", function(data, status) {
        //check status 200 is ok 
        if (status == 200)
        {
            console.log(data);
        }
    });
}