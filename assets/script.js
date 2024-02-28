const PEXELS_API_BASE_URL = 'https://api.pexels.com'
const PEXELS_API_KEY = 'OrM0nTramqYKndiLvKhWRK8XseO1ZaYMvtRg9REZmRBBfaaWrxEHzErN'

const EDAMAM_API_BASE_URL = 'https://api.edamam.com'
const EDAMAM_API_APP_ID = '05613ea2'
const EDAMAM_API_APP_KEY = '476fd8d47c59459b1f1120279d263d8e'

var startBtnEl = document.getElementById('start-btn')
var generateBtnEl = document.getElementById('generate-recipe-btn')
var welcomePageEl = document.getElementById('welcome-page')
var recipePageEl = document.getElementById('recipe-page')
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
})
//change event on dishType options
let selectedDishType;
dishTypeSelect.addEventListener('change' , function(){
  selectedDishType = dishTypeSelect.value
})
//change event on diet options
let selectedDiets;
dietTypeSelect.addEventListener('change' , function(){
  selectedDiets = dietTypeSelect.value
})


function generateRecipe (){
  var apiUrlPexels = `${PEXELS_API_BASE_URL}/v1/search?query=${selectedMealType}&api_key=${PEXELS_API_KEY}`
  

  var apiUrlEdamam = `${EDAMAM_API_BASE_URL}/api/recipes/v2?mealType=${selectedMealType}&dishType=${selectedDishType}&health=${selectedDiets}&ingr=3-10&time=5-25&type=public&app_id=${EDAMAM_API_APP_ID}&app_key${EDAMAM_API_APP_KEY}`
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

