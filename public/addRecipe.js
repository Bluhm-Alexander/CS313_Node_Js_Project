/**
* Javascript for mainpage
**/
window.ingredientsNum = 1;
window.stepsNum = 1;

$("#logout").click(logout);
$("#recipe-view").click(recipeView);
$("#add-ingredient").click(addIngredient);
$("#add-step").click(addStep);
$("#save-recipe").click(canSave);

function logout(event) {
    $.post("/logout", 
        function(data, status) {
        //check status 200 is ok 
        console.log(data, status);
        if ( data["success"] == false )
        {
            window.location = "/";
        }
        else
        {
            $("#currentUser").html("You are not logged in");
            window.location = "/"
        }
    });
}

$( document ).ready(function() {
    $.get("/getUserInfo", function(data, status){
        if( data != "" )
            $("#currentUser").html(data);
        else
            $("#currentUser").html( "Not Logged in");
    });
});

function canSave(event) {
    $.get("/getUserInfo", function(data, status){
        if( data != "" )
            saveRecipe();
        else
            alert( "You cannot save, you are not logged in" );
    });
}

function recipeView(event) {
    window.location = "/mainPage";
}

function addIngredient(event) {
    ingredientsNum++;
    $("#ingredients-table").append( '<tr>' +
                                        '<td>' +
                                            '<label for="ingredients' + ingredientsNum + '">Ingredient ' + ingredientsNum + '</label>' +
                                        '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<td>' +
                                            '<input type="text" name="ingredients' + ingredientsNum + '" id="ingredients' + ingredientsNum + '" value="" size="100">' +
                                        '</td>' +
                                    '</tr>');
}

function addStep(event) {
    stepsNum++;
    $("#instructions-table").append( '<tr>' +
                                        '<td>' +
                                            '<label for="step' + stepsNum + '">Step ' + stepsNum + '</label>' +
                                        '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<td>' +
                                            '<input type="text" name="step' + stepsNum + '" id="step' + stepsNum + '" value="" size="100">' +
                                        '</td>' +
                                    '</tr>');
}

//wrap everything up into html and store it in the database
function saveRecipe(event) {
    //loop through all ingredients and put name in it's own variable
    var newRecipeName = $("#recipe-name").val();
    if( newRecipeName == "" ) {
        alert( "Warning: Cannot Parse Empty Recipe Name Field" );
        return;
    }

    // Parse all of the Ingredients 
    var newRecipe = "";
    newRecipe += '<h2>Ingredients:</h2>\n';
    newRecipe += '<ul>\n';
    for (var i = 1; i <= ingredientsNum; i++) {
        var ingredientParse = $('#ingredients' + i).val();
        if( ingredientParse != "" ) {
            newRecipe += '<li>' + ingredientParse + '</li>\n';
        }
        else {
            alert( "Warning: Cannot Parse Empty Field in Ingredient " + i );
            return;
        }
    }
    newRecipe += '</ul>\n';

    newRecipe += '<h2>Procedure:</h2>\n';
    newRecipe += '<ol>\n';
    // Parse the steps
    for (var i = 1; i <= stepsNum; i++) {
        var stepParse = $('#step' + i).val();
        if( stepParse != "" ) {
            newRecipe += '<li>' + stepParse + '</li>\n';
        }
        else {
            alert( "Warning: Cannot Parse Empty Field in Ingredient " + i );
            return;
        }
    }
    newRecipe += '</ol>\n';

    //console.log(newRecipeName + '\n' + newRecipe);
    //continue to post
    if(newRecipe || newRecipeName ) {
        $.post("/addRecipe", {
            // These are associated with the form IDs Jquery grabs them and passes them on as named variables
            newRecipeName: newRecipeName,
            newRecipe: newRecipe
        },
            function(data, status) {
            //check status 200 is ok 
            console.log(data, status);
            if (status == "success")
            {
                if( data["success"] == false ) {
                    alert("Error: could not post to database");
                }
                else {
                    window.location = "/mainPage";
                }
            }
        });
    }
    else {
        alert( "Error: No Input" )
    }
}
