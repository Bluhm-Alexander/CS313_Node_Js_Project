/**
* Javascript for mainpage
**/

//Declaring global variable to hold all of the recipe data so we only call to the database once
window.allRecipes = [];
window.selectedRecipeId = -1;

// When Page loads get all pertinent information from the server
$( document ).ready(function() {
    $.get("/getUserInfo", function(data, status){
        $("#currentUser").html(data);
    });
    $.get("/getUserRecipes", function(data, status){
        window.allRecipes = data;
        console.log( window.allRecipes );
        
        //loop through all recipes and put them in the table
        if( window.allRecipes.length > 0 ) {
            $("#allRecipes").empty();
            for( var i = 0; i < window.allRecipes.length; i++ ){
                $("#allRecipes").append('<button class="recipeButtons" onclick="showRecipe(' + i + ')">' + window.allRecipes[i].recipe_name + '</button>');
            }
        }
    });
});

/**************************************************************
 *  FUNCTION: showRecipe
 *      
 *      Plop all info retrieved from directions into procedures
 *      ID based on index passed in.
 **************************************************************/
function showRecipe( index ){
    //console.log(index);
    window.selectedRecipeId = window.allRecipes[index].recipe_id;
    $("#procedure").empty();
    $("#procedure").html('<h1>' + window.allRecipes[index].recipe_name + '</h1>')
    $("#procedure").append(window.allRecipes[index].directions);
}

//listeners
$("#logout").click(logout);
$("#addRecipe").click(addRecipe);
$("#deleteRecipe").click(deleteRecipe);

function deleteRecipe(event) {
    var recipeId = window.selectedRecipeId;

    if( window.selectedRecipeId == -1 ) {
        alert("Error: Select a recipe to delete");
    }
    else
    {
        $.post("/deleteRecipe", {
            recipeId: recipeId
        },
            function(data, status) {
            if ( data["success"] == false )
            {
                alert("Error: Could not delete recipe");
            }
            else
            {
                window.location = "/mainPage";
            }
        });
    }
}

function addRecipe() {
    window.location = "/addRecipe";
}

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
        }
    });
}