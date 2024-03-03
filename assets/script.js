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
var mealTypeSelect = document.getElementById('meal-type')
var dishTypeSelect = document.getElementById('dish-type')
var dietTypeSelect = document.getElementById('diet-type')


//code to show welcome page and hide recipe page :
welcomePageEl.style.display = 'block'
recipePageEl.style.display = 'none'

//code to show recipe page and hide welcome page:
function showRecipePage(){
  welcomePageEl.style.display = 'none'
  recipePageEl.style.display = 'block'
}
startBtnEl.addEventListener('click' , showRecipePage)

//change event on mealtype options
let selectedMealType;
  mealTypeSelect.addEventListener('change' , function(){
  selectedMealType = mealTypeSelect.value 
  console.log(selectedMealType)
})
//change event on dishType options
let selectedDishType;
dishTypeSelect.addEventListener('change' , function(){
  selectedDishType = dishTypeSelect.value
  console.log(selectedDishType)
})

let selectedDiets = [];
dietTypeSelect.addEventListener('change', function() {
    selectedDiets = []; //clears the selected diets array each time a new option is clicked, to make sure it only contains currently selected options 
    // otherwise previous ones would remain in the array still.

    var selectedOptions = Array.from(dietTypeSelect.selectedOptions);
    //Array.from() a javascript method used to create an array of all the currently selected options in the diet type <select> element
    //.selectedOptions is a property on all <select> element objects in the DOM that accesses all the currently selected options in the specified <select> element (dietTypeSelect)

    selectedOptions.forEach(function(selectedOption) {
      //.forEach() funtion used to apply a function on each ELEMENT in an array (selectedOptions array) 
        selectedDiets.push(selectedOption.value); // Push each selected option(element)'s value into the selectedDiets array
    });

    console.log(selectedDiets);
});




function generateRecipe (){
  //setting the value of the health parameter in the edamam query string.
 /* var healthParameterValue = selectedDiets.join(', ') // joins all the elements of the selectedDiets array into a single string that separates
  //them with commas. e.g. selectedDiets =  ['vegan' , 'vegetarian'] healthParameterValue = 'vegan,vegetarian'*/

  var apiUrlPexels = `${PEXELS_API_BASE_URL}/v1/search?query=${selectedMealType}`
 
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
      $('.meal-type-name').text(`${selectedMealType} recipe ideas`)
    })

 
   var apiUrlEdamam = `${EDAMAM_API_BASE_URL}/api/recipes/v2?mealType=${selectedMealType}&dishType=${selectedDishType}&healthLabels=${selectedDiets}&ingr=3-10&time=5-25&type=public&app_id=${EDAMAM_API_APP_ID}&app_key=${EDAMAM_API_APP_KEY}`
   fetch(apiUrlEdamam)
   .then(response => response.json())
    .then(data => {

    console.log(data)

    $('.each-recipe').each(function(index){
      var recipeName = data.hits[index].recipe.label
      var recipeImg = data.hits[index].recipe.images.SMALL.url /* OR  data.hits[i].recipe.image*/
      var recipeUrl = data.hits[index].recipe.url  

      $(this).html(`<div class="recipe-container">
                      <div class="recipe-card">
                        <a class="recipe-url" href=${recipeUrl}>
                          <img src=${recipeImg} alt="recipe image" class="recipe-image"></img>
                        </a>
                        <div class="recipe-info">
                          <h3 class="recipe-name"> ${recipeName} </h3>
                          <div class="health-labels-div">
                          
                          </div>
                        </div>
                      </div>
                    </div>`)

      //attempting to display healthLabels in recipe div
      var healthLabelsArray = data.hits[index].recipe.healthLabels

      healthLabelsArray.forEach(function(element){
        var healthLabelsContainerEl = $('.health-labels-div')
        var healthLabeldivEl = $('<div></div>')
        healthLabeldivEl.text(healthLabelsArray[element])
        healthLabelsContainerEl.append(healthLabeldivEl)
        

      })
      

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
                          <div class ="protein-div">${protein}:     ${proteinQuantity}${proteinUnit}</div>
                          <div class ="fat-div">${fat}:     ${fatQuantity}${fatUnit}</div>
                          <div class ="protein-div">${carbs}:     ${carbsQuantity}${carbsUnit}</div>
                          <div class ="protein-div">${fiber}:     ${fiberQuantity}${fiberUnit}</div>
                        </div>
                        <div class="mg-div">
                          <div class ="cholesterol-div">${cholesterol}: ${cholesterolQuantity}${cholesterolUnit}</div>
                          <div class ="protein-div">${sodium}:     ${sodiumQuantity}${sodiumUnit}</div>
                          <div class ="protein-div">${calcium}:     ${calciumQuantity}${calciumUnit}</div>
                          <div class ="protein-div">${magnesium}:     ${magnesiumQuantity}${magnesiumUnit}</div>
                          <div class ="protein-div">${potassium}:     ${potassiumQuantity}${potassiumUnit}</div>
                          <div class ="protein-div">${iron}:     ${ironQuantity}${ironUnit}</div>
                        </div>
                     </div>`)

    })

   })
  }
 
 generateBtnEl.addEventListener('click' , generateRecipe)

 






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


