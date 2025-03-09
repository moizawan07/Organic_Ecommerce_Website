// Firebase Service Import for the firebase.js
import { db , setDoc, doc, getDoc, collection } from "./firebase.js";
// This organicStoreItems Is a Object in this all Products Information Stored.
import organicStoreItems from './productsStores.js'

console.log(organicStoreItems);


// Set Products Data in Database
 function addProductsInFB  (){
     setDoc(doc(db, 'OrganicProducts/allProducts'), organicStoreItems)
  } 
 

async function getProductsInFb () {
  let allProductsStore;
     try {
      let snapC = await getDoc(doc(db,'OrganicProducts/allProducts'))
        allProductsStore = snapC.data()}
     catch (error) {
      console.error(error)
    }
// RETURN THE allProductsStore VARIABLE in this var stored all Categories and Products ARRAY
  return allProductsStore;
}




function categoryDivcPrint () {
  let mainDiv = document.querySelector('.section2Categoriesmain')
  let snapC = getProductsInFb()

  .then(data => {
    //Print Category div Not Products
    data.allProductsArr.forEach((eachItem) => {
      let {categoryName, items, categoryPic} = eachItem    // Desturing    

      // Print it Start
      mainDiv.innerHTML += `
         <div class="s2selectbox-card1" id=${categoryName} onclick="productsPrint('${categoryName}')">
             <img src=${categoryPic} alt="">
             <h2>${categoryName}</h2>
             <p>${items.length} items</p>
         </div>`
})})
  .catch(err => console.error(err))
}

//  This Function Prints Categories ka jo  Products Ha Woh
window.productsPrint = function (productCate){
  console.log(productCate)
  let mainDiv = document.querySelector('.section3ProductsMain')
      mainDiv.innerHTML = ''   // Old Values Empty
      
  let snapC = getProductsInFb()
   .then((data) => {
   let allproducts = data.allProductsArr

       allproducts.forEach(i => {
         if(i.categoryName === productCate){

             i.items.forEach(e => {
               mainDiv.innerHTML += `
                 <div class="S2Card">
                     <img src=${e.imgSrc}  alt="products Image">
                     <h3>${e.name}</h3>
                     <p>Rs.${e.currentPrice}<s>${e.oldPrice}</s></p>
                     <p class="S2CardDescr">An apple contains essential nutrients like vitamins, minerals, fiber, and antioxidants, which are beneficial for overall health. <b onclick="viewMore(this)">View More</b></p>
                      <div class="off">${e.off} OFF</div>
                     <div onclick="productSelect(this)" class="S2CardIcon">
                       <i class="fa-solid fa-plus"></i>
                     </div>
                 </div> 
               `
             })
         }
          
     })
      
   })
   .catch(err => console.error(err)) 
}


// This condition is when true jb page shop ka hu ga
if(window.location.href.includes('shop.html')){
  addProductsInFB()
  getProductsInFb()
  categoryDivcPrint()
  productsPrint('Fruits')
}







// NAVBAR ON / OFF  FUNCTION
window.navOn = function () {
  let ul =         document.querySelector(".navbar");          // GET KR RHA JIS JIS PR CLASS ADD KRNI
  let offerMsg =   document.querySelector(".offerMsg");
  let counterDiv = document.querySelector(".card-items-count");
  let profileDiv = document.querySelector(".profile");
    ul.classList.toggle('Show')                               // SET KR RHA CLASS JIS JIS KO GET KIYA
    offerMsg.classList.toggle('Show')
    counterDiv.classList.toggle('Show')
    profileDiv.classList.toggle('Show')
}
// document.getElementById('navOn').addEventListener('click', navOn)


// SLIDEBAR CODE START
//  shop ki file ma gya to he slidebar chale ga slidebar sirf shop wali file ma ha
if (window.location.href.indexOf("shop") != -1) {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const bullets = document.querySelectorAll(".bullet-btn");
  const totalSlides = slides.length;

  function showSlide(index) {
    if (index >= totalSlides) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = totalSlides - 1;
    } else {
      currentSlide = index;
    }

    // Move the slider to the correct slide
    const slider = document.querySelector(".slider");
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update the active bullet
    bullets.forEach((bullet) => bullet.classList.remove("active"));
    bullets[currentSlide].classList.add("active");
  }

  // Automatic slide change every 3 seconds
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000);

  // Bullet navigation
  bullets.forEach((bullet) => {
    bullet.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.slide);
      showSlide(index);
    });
  });

  // Initialize the first slide
  showSlide(currentSlide);
}
// SLIDEBARCODE END
