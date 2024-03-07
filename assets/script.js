const PEXELS_API_BASE_URL = 'https://api.pexels.com'
const PEXELS_API_KEY = 'OrM0nTramqYKndiLvKhWRK8XseO1ZaYMvtRg9REZmRBBfaaWrxEHzErN'

const EDAMAM_API_BASE_URL = 'https://api.edamam.com'
const EDAMAM_API_APP_ID = '05613ea2'
const EDAMAM_API_APP_KEY = '476fd8d47c59459b1f1120279d263d8e'

var startBtnEl = document.getElementById('start-btn')
var generateBtnEl = document.getElementById('generate-recipe-btn')
var welcomePageEl = document.getElementById('welcome-page')
var recipePageEl = document.getElementById('recipe-page')
var imageEl = document.getElementById('image')
var photoCreditEl = document.getElementById('photo-credit')
var mealTypeSelectEl = document.getElementById('meal-type')
var cuisineTypeSelectEl = document.getElementById('cuisine-type')
var queryInputEl = document.getElementById('query-input')
var searchHistoryEl = document.getElementById('search-history')
var imageContainerEl = document.getElementById('img-container')
var recipeInfoEl = document.getElementById('recipe-info')


//code to show welcome page and hide recipe page :
welcomePageEl.style.display = 'block'
recipePageEl.style.display = 'none'
imageContainerEl.style.display = 'none'
recipeInfoEl.style.display = 'none'



//code to show recipe page and hide welcome page:
function showRecipePage(){
  welcomePageEl.style.display = 'none'
  recipePageEl.style.display = 'block'
  imageContainerEl.style.display = 'none'
recipeInfoEl.style.display = 'none'
}
startBtnEl.addEventListener('click' , showRecipePage)


var savedRecipes = JSON.parse(localStorage.getItem('recipe-key')) || []
savedRecipes.forEach(function(element){
  searchHistoryEl.innerHTML += `<div class="recent-searches">${element.query}<div>`
})


let selectedCuisineType; 
cuisineTypeSelectEl.addEventListener('change' , function(){
  selectedCuisineType = cuisineTypeSelectEl.value
  console.log(selectedCuisineType)
 })

let selectedMealType; 
mealTypeSelectEl.addEventListener('change' , function(){
  selectedMealType = mealTypeSelectEl.value 
  console.log(selectedMealType)
  })

let queryInput;
function clickGenerateBtn(){
  imageContainerEl.style.display = 'block'
recipeInfoEl.style.display = 'block'

   queryInput = queryInputEl.value
   searchHistoryEl.innerHTML += `<div class="recent-searches">${queryInput}<div>`

   savedRecipes.push({
    cuisineType: selectedCuisineType,
    mealType: selectedMealType,
    query: queryInput
  });

   localStorage.setItem('recipe-key' , JSON.stringify(savedRecipes))

    generateRecipe()
}

$(document).on('click' , '.recent-searches', function(){
  queryInput = $(this).text() //this keyword refers to the specific .recent-searches element that triggered the click event
  /*selectedMealType = 
  selectedCuisineType = */
  var clickedQuery = $(this).text(); // Get the text of the clicked recent search
  // Find the corresponding saved recipe in the savedRecipes array
  var clickedRecipe = savedRecipes.find(recipe => recipe.query === clickedQuery);
  if (clickedRecipe) {
    // Update selectedMealType and selectedCuisineType with the values from the clicked recipe
    selectedMealType = clickedRecipe.mealType;
    selectedCuisineType = clickedRecipe.cuisineType;
    generateRecipe();
  } else {
    console.log('Clicked recipe not found in saved recipes.');
  }
  generateRecipe()
})




function generateRecipe (){
  //setting the value of the health parameter in the edamam query string.
 /* var healthParameterValue = selectedDiets.join(', ') // joins all the elements of the selectedDiets array into a single string that separates
  //them with commas. e.g. selectedDiets =  ['vegan' , 'vegetarian'] healthParameterValue = 'vegan,vegetarian'*/

  //pexels API
  var apiUrlPexels = `${PEXELS_API_BASE_URL}/v1/search?query=${selectedMealType}&orientation=landscape`
 
  fetch(apiUrlPexels,{
   headers: {
     Authorization: PEXELS_API_KEY
   } /*added api key in the 'header' because thats how the pexels api is authosied, not in the query string parameter.*/})
   .then(resp => {
    return resp.json()
  })
  .then(data => {
      console.log(data)
     
      var imgSrc = data.photos[0].src.medium
      imageEl.setAttribute('src' , imgSrc)
        var photographer = data.photos[0].photographer
        photoCreditEl.textContent= `Photo by ${photographer}`
        $('.meal-type-name').text(`${selectedCuisineType} ${selectedMealType} Recipe Ideas`)
      })

      queryInput = queryInputEl.value
      var apiUrlEdamam = `${EDAMAM_API_BASE_URL}/api/recipes/v2?mealType=${selectedMealType}&cuisineType=${selectedCuisineType}&q=${queryInput}&ingr=3-10&time=5-60&type=public&app_id=${EDAMAM_API_APP_ID}&app_key=${EDAMAM_API_APP_KEY}`
      fetch(apiUrlEdamam)
      .then(response => {
          if (!response.ok) {
              if (response.status === 404) {
                  throw new Error('No recipes found for the given criteria.');
              } else {
                  throw new Error('Unable to fetch recipes at this time.');
              }
          }
          return response.json();
      })
      
      .then(data => {
          console.log(data);
          // Check if the API returned recipes. This might depend on the specific structure of the Edamam API response.
          // Assuming the relevant data is in data.hits array
          if (!data.hits || data.hits.length === 0) {
            showModal();
          }

          function showModal() {
            // Show the modal
            $("#myModal").css("display", "block");
        
            // When the user clicks on <span> (x), close the modal
            $(".close-button").click(function() {
                $("#myModal").css("display", "none");
            });
        
            // When the user clicks anywhere outside of the modal, close it
            $(window).click(function(event) {
                if ($(event.target).is("#myModal")) {
                    $("#myModal").css("display", "none");
                }
            });
        }
        


    //this will add recipe info/content to each recipe div on the page
    $('.each-recipe').each(function(index){
      //accessing the recipe label, image and url from the data response
      var recipeName = data.hits[index].recipe.label
      var recipeImg = data.hits[index].recipe.images.SMALL.url /* OR  data.hits[i].recipe.image*/
      var recipeUrl = data.hits[index].recipe.url  
      

      //accessing the first 15 health labels of each recipe from the data response
      var healthLabel1 = data.hits[index].recipe.healthLabels[0]
      var healthLabel2 = data.hits[index].recipe.healthLabels[1]
      var healthLabel3 = data.hits[index].recipe.healthLabels[2]
      var healthLabel4 = data.hits[index].recipe.healthLabels[3]
      var healthLabel5 = data.hits[index].recipe.healthLabels[4]
      var healthLabel6 = data.hits[index].recipe.healthLabels[5]
      var healthLabel7 = data.hits[index].recipe.healthLabels[6]
      var healthLabel8 = data.hits[index].recipe.healthLabels[7]
      var healthLabel9 = data.hits[index].recipe.healthLabels[8]
      var healthLabel10 = data.hits[index].recipe.healthLabels[9]
      var healthLabel11 = data.hits[index].recipe.healthLabels[10]
      var healthLabel12 = data.hits[index].recipe.healthLabels[11]
      var healthLabel13 = data.hits[index].recipe.healthLabels[12]
      var healthLabel14 = data.hits[index].recipe.healthLabels[13]
      var healthLabel15 = data.hits[index].recipe.healthLabels[14]



      //creating a recipe container to display the data accessed from the response
      $(this).html(`<div class="recipe-container">
                      <div class="recipe-card">
                        <a class="recipe-url" href=${recipeUrl}>
                          <img src=${recipeImg} alt="recipe image" class="recipe-image"></img>
                        </a>
                        <div class="recipe-info">
                          <h2 class="recipe-name"> ${recipeName} </h2>
                          <a class="health-labels-container">
                          *${healthLabel1}   *${healthLabel2}   *${healthLabel3}   *${healthLabel4}   *${healthLabel5}   *${healthLabel6}   *${healthLabel7}   *${healthLabel8}   *${healthLabel9}   *${healthLabel10}   *${healthLabel11}   *${healthLabel12}   *${healthLabel13}   *${healthLabel14}   *${healthLabel15}
                          
                          </a>
                        </div>
                      </div>
                    </div>`)
    })


   $('.recipe-nutrients').each(function(index){
           //NUTRIENTS
           
       var calcium = data.hits[index].recipe.totalNutrients.CA.label
       var calciumQuantity = data.hits[index].recipe.totalNutrients.CA.quantity.toFixed(1) //(round it to 1dp using .toFixed)
       var calciumUnit = data.hits[index].recipe.totalNutrients.CA.unit
 
       var carbs = data.hits[index].recipe.totalNutrients.CHOCDF.label
       var carbsQuantity = data.hits[index].recipe.totalNutrients.CHOCDF.quantity.toFixed(1)
       var carbsUnit = data.hits[index].recipe.totalNutrients.CHOCDF.unit
 
       var cholesterol = data.hits[index].recipe.totalNutrients.CHOLE.label
       var cholesterolQuantity = data.hits[index].recipe.totalNutrients.CHOLE.quantity.toFixed(1)
       var cholesterolUnit = data.hits[index].recipe.totalNutrients.CHOLE.unit
 
       var kcal = data.hits[index].recipe.totalNutrients.ENERC_KCAL.label
       var kcalQuantity = Math.floor(data.hits[index].recipe.totalNutrients.ENERC_KCAL.quantity) //(round down usinf Math.floor)
       var kcalUnit = data.hits[index].recipe.totalNutrients.ENERC_KCAL.unit
 
       var fat = data.hits[index].recipe.totalNutrients.FAT.label
       var fatQuantity = data.hits[index].recipe.totalNutrients.FAT.quantity.toFixed(1)
       var fatUnit = data.hits[index].recipe.totalNutrients.FAT.unit
 
       var iron = data.hits[index].recipe.totalNutrients.FE.label
       var ironQuantity = data.hits[index].recipe.totalNutrients.FE.quantity.toFixed(1)
       var ironUnit = data.hits[index].recipe.totalNutrients.FE.unit
 
       var fiber = data.hits[index].recipe.totalNutrients.FIBTG.label
       var fiberQuantity = data.hits[index].recipe.totalNutrients.FIBTG.quantity.toFixed(1)
       var fiberUnit = data.hits[index].recipe.totalNutrients.FIBTG.unit
 
       var potassium  = data.hits[index].recipe.totalNutrients.K.label
       var potassiumQuantity = data.hits[index].recipe.totalNutrients.K.quantity.toFixed(1)
       var potassiumUnit = data.hits[index].recipe.totalNutrients.K.unit
 
       var magnesium = data.hits[index].recipe.totalNutrients.MG.label
       var magnesiumQuantity = data.hits[index].recipe.totalNutrients.MG.quantity.toFixed(1)
       var magnesiumUnit = data.hits[index].recipe.totalNutrients.MG.unit
 
       var sodium = data.hits[index].recipe.totalNutrients.NA.label
       var sodiumQuantity = data.hits[index].recipe.totalNutrients.NA.quantity.toFixed(1)
       var sodiumUnit = data.hits[index].recipe.totalNutrients.NA.unit
 
       var protein = data.hits[index].recipe.totalNutrients.PROCNT.label
       var proteinQuantity = data.hits[index].recipe.totalNutrients.PROCNT.quantity.toFixed(1)
       var proteinUnit = data.hits[index].recipe.totalNutrients.PROCNT.unit
 
       //SERVING SIZE
       var servings = data.hits[index].recipe.yield
 
       //TOTAL MINUTES
       var totalTime = data.hits[index].recipe.totalTime //(in minutes)
 
       $(this).html(`<div class="nutrients-container">
                        <div class="kcal-servings-time-div">
                          <h5 class="servings-div">Number of servings: ${servings}</h5>
                          <h4 class="kcal-h3">${kcalQuantity} ${kcalUnit}</h4>
                          <h5 class="total-time-div">Total Cooking time: ${totalTime} minutes</h5>
                        </div>
                        <div class="grams-div">
                          <div class ="protein-div">${protein}: ${proteinQuantity}${proteinUnit}</div>
                          <div class ="fat-div">${fat}: ${fatQuantity}${fatUnit}</div>
                          <div class ="protein-div">${carbs}: ${carbsQuantity}${carbsUnit}</div>
                          <div class ="protein-div">${fiber}: ${fiberQuantity}${fiberUnit}</div>
                        </div>
                        <div class="mg-div">
                          <div class ="cholesterol-div">${cholesterol}: ${cholesterolQuantity}${cholesterolUnit}</div>
                          <div class ="protein-div">${sodium}: ${sodiumQuantity}${sodiumUnit}</div>
                          <div class ="protein-div">${calcium}: ${calciumQuantity}${calciumUnit}</div>
                          <div class ="protein-div">${magnesium}: ${magnesiumQuantity}${magnesiumUnit}</div>
                          <div class ="protein-div">${potassium}: ${potassiumQuantity}${potassiumUnit}</div>
                          <div class ="protein-div">${iron}: ${ironQuantity}${ironUnit}</div>
                        </div>
                     </div>`)

                     

    })

   })

  }

  generateBtnEl.addEventListener('click' , clickGenerateBtn)





 



 






//code for jquery ui modal widget functionality
/*$( function() {
    $( "#error-message-modal" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  } );*/


