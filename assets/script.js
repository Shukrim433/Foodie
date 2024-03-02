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
                        <img src=${recipeImg} alt="recipe image" class="recipe-image"></img>
                        <div class="recipe-info">
                          <h3 class="recipe-name"> ${recipeName} </h3>
                          <a class="recipe-url" href=${recipeUrl}>${recipeUrl}</a>
                        </div>
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


