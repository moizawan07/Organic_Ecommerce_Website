// Firebase Services Import for the firebase.js
import { db , doc ,getDoc,addDoc, setDoc, collection, serverTimestamp,      
  auth,createUserWithEmailAndPassword,  signInWithEmailAndPassword, onAuthStateChanged, signOut,
} from './firebase.js'

// This organicStoreItems Is a Object in this all Products Information Stored.
import organicStoreItems from './productsStores.js'



// USER SignUp Function
window.signUp = function(){

  // Stored All SignUp Values in this Object
 let userValue = {
  name : document.querySelector('#Name').value.toLowerCase(),
  email : document.querySelector('#Email').value.toLowerCase(),
  phoneNum : document.querySelector('#phonenumber').value,
  pass : document.querySelector('#Password').value
 }


//  All Fiedls Regex Code Stored
 let nameRegex = /^[A-Za-z]{3,}(?: [A-Za-z]+)*$/;
 let emailRegex = /^[a-zA-Z0-9._%+-]{4,}@(gmail\.com|yahoo\.com|outlook\.com)$/;  // Email Regex Code
 let phoneRegex = /^\d{11}$/;
 let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

// Check User Form Fill Corrrect Or Not
 if(userValue.name && userValue.email && userValue.phoneNum && userValue.pass){
     if(nameRegex.test(userValue.name)){
           if(emailRegex.test(userValue.email)){
              if(phoneRegex.test(userValue.phoneNum)){
                 if(passwordRegex.test(userValue.pass)){
                  // allFieldsCorrect = true
                  // Call The function in This Func I add User Data In Db And Authen As well
                  setSignUpDataInFb()
                 }
                 else{
                  alert('Pass Must than a 6 chracter & contain at least one letter & one number')
                 }
              }
              else{
                alert('Invalid Phone Number')
               }
           }
           else{
            alert('Invalid Email')
           }
     }
     else{
      alert('Name must than 4 chracter')
     }
 }
 else{
  alert('All feilds complsary')
 }

 
 // If All Fields Fill Properly I call THIS Funct
async function setSignUpDataInFb(){

  
  try {
    //  First Add AUTHENTICATION 
    let autheUserData = await createUserWithEmailAndPassword(auth, userValue.email, userValue.pass)
    let authUserIdStore = autheUserData.user.uid;
    // console.log(authUserIdStore);
    
    

   //  SECOND Add USER Data In FireStore DB
  let dbUserData =  await setDoc(doc(db, 'SignUpUser', authUserIdStore),
  {
    ...userValue,  // This Object ki all Propety add hojai ais Obj ma
    userId: authUserIdStore, 
    role: 'User',
    createdAt: serverTimestamp() // Firebase ka automatic timestamp

  }, 
  { merge: true }) // → Agar document pehle se exist karta hai, to naye fields update honge bina purane delete kiye.

  
  // After SingUp SucessFully done Paged
   window.location.href = '../login/login.html'
  } 
  catch (error) {
    alert(error) 
  }

}
}

// USER Login Function
window.login = function(){
  let emailRegex = /^[a-zA-Z0-9._%+-]{4,}@(gmail\.com|yahoo\.com|outlook\.com)$/;  // Email Regex Code
  let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  let userEmail = document.querySelector('#email2').value
  let userPass = document.querySelector('#password2').value

  if(userEmail && userPass){
     if(emailRegex.test(userEmail)){
        if(passwordRegex.test(userPass)){
           
          signInWithEmailAndPassword(auth, userEmail, userPass)
          .then(data => {
            let loginUserUid = data.user.uid
            // Set The User id  In The Local Storage That Confirm ka  User Login Ha
            localStorage.setItem('userLogin',loginUserUid)
           
            // Ab Jis User Ne Login Kiya Us User ka ROLE kiya ha Admin HA YA User
            // Check US Hisab Se Hi Use Route krai ga YA to Dashbord ya To Home Page 

            getDoc(doc(db, 'SignUpUser',loginUserUid))
            .then(userD => {
             let loginUserRole = userD.data().role;
           
               if(loginUserRole === "Admin"){ // If Admin To Dashbaord
                 window.location.href = '../Dashboard/dashboard.html'
               }
               else{ // AGR ADMIN NHI MEANS USER TO HOME PAGE
                window.location.href = '../index.html'
               }
             
              
            })
            .catch(err => alert(err))
            

            // Condditional Rendering If Admin Go to The Dashboard If User To Go the Home Page

            // if(userEmail)
          }) 
          .catch((err) => alert(err))
        }
        else{
          alert('Invalid Passsword')
        }
     }
     else{
      alert('Invalid Email')
    }
  }
  else{
    alert('brhhhh')
  }
   
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

// SLIDEBAR / Crousel CODE START
window.crousel = function (){
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



// Set Products Data in Database
 function addProductsInFB  (){
     setDoc(doc(db, 'OrganicProducts/allProducts'), organicStoreItems)
  } 
 
// get Products Data by DataBase
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


// Categories like fruit drinks div Praint
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
  let mainDiv = document.querySelector('.section3ProductsMain')
  mainDiv.innerHTML = '<div class="loader"></div>'   // Old Values Empty

  let snapC = getProductsInFb()
   .then((data) => {
   let allproducts = data.allProductsArr
       mainDiv.innerHTML = ''   // Old Values Empty
      
       allproducts.forEach(i => {
         if(i.categoryName === productCate){

             i.items.forEach(e => {
               mainDiv.innerHTML += `
                 <div class="S2Card">
                     <img src=${e.imgSrc}  alt="products Image">
                     <h3>${e.name}</h3>
                     <p>Rs.${e.currentPrice}<s>${e.oldPrice}</s></p>
                     <p class="S2CardDescr">An ${e.name} contains essential nutrients like vitamins, minerals, fiber, and antioxidants, hes very which are the most beneficial for overall the body & health.</p>
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
if(window.location.href.includes('shop')){
  crousel()
  addProductsInFB()
  getProductsInFb()
  categoryDivcPrint()
  productsPrint('Fruits')
}



// Product Select Function on + Icon Div
window.productSelect = function (e){
  let img = document.getElementById('product-img')
  let name = document.getElementById('proname')
  let price = document.getElementById('ProductPrice')
  let uPrice = document.getElementById('updateProductPrice')
  let description = document.getElementById('Productdetail')
  let modaalDiv = document.querySelector('.section4ModaalMain')
  let background = document.querySelector('.background-blur')

      modaalDiv.style.display = 'block'
      background.style.display = 'block'

  let selectProductInfo = {
    imgSrc : e.parentNode.childNodes[1].src,
    name : e.parentNode.childNodes[3].innerText,
    price : e.parentNode.childNodes[5].childNodes[0].nodeValue,
    des : e.parentNode.childNodes[7].innerText
  }
  //   User Product  values set Them in Modal Div
     img.src = selectProductInfo.imgSrc;
     name.innerHTML = selectProductInfo.name;
     price.innerHTML = selectProductInfo.price.slice(3)
     description.innerHTML = selectProductInfo.des.slice(0,90) + "<b onclick='productViewMore()'> View More </b>"
   
     console.log(e.parentNode.childNodes[7].innerText);
     
  
}

// Product Select Modaal Div Close  on X Icon Div
window.productSelectModaalOff = function (){
  let modaalMainDiv = document.querySelector('.section4ModaalMain')
  let oprice = document.getElementById('ProductPrice')
  let uPrice = document.getElementById('updateProductPrice')
  let counterDiv = document.querySelector('#proqunanumber')
  let background = document.querySelector('.background-blur')

      modaalMainDiv.style.display = 'none'
      oprice.style.display = 'block'
      uPrice.innerText = ''
      counterDiv.innerText = 1
      background.style.display = 'none'

}

// Product Select Description View More Function
window.productViewMore = function (){
   let productDesShowDiv = document.querySelector('#Productdetail')
   let fullDesc = productDesShowDiv.innerHTML.slice(0,90) + `hes very which are the most beneficial for overall the body & health. <b onclick='productViewLess(this)'> View less </b>`;
   
  // console.log(fullDesc);
  
       productDesShowDiv.innerHTML = fullDesc
}

// Product Select Description View Less Function
window.productViewLess = function (e){
  let productDesShowDiv = document.querySelector('#Productdetail')
  let halfDesc = e.parentNode.innerHTML;
    halfDesc = halfDesc.slice(0,90);
      
 
      productDesShowDiv.innerHTML = halfDesc + " <b onclick='productViewMore()'> View More </b>"

      // console.log(productFullDescr);
      
}

// Product Select Quantity Increment +
window.pSQuantityIncre = function(){
  let oprice = document.getElementById('ProductPrice')
  let opriceConvertToNum = Number(oprice.innerText)
  let uPrice = document.getElementById('updateProductPrice')
      uPrice.style.display = 'block'
  let counterDiv = document.querySelector('#proqunanumber')
  let converToNum =    parseInt(counterDiv.innerText)

    if(counterDiv.innerText < 10){
      counterDiv.innerText = converToNum + 1   // Plus number
      oprice.style.display = 'none' // Old Price None

       // Multiply Update price Number
      uPrice.innerText = counterDiv.innerText * opriceConvertToNum
      
      
    }
}
// Product Select Quantity Decrement -
window.pSQuantityDecre = function(){
  let counterDiv = document.querySelector('#proqunanumber')
  let oprice = document.getElementById('ProductPrice')
  let uPrice = document.getElementById('updateProductPrice')

   if(counterDiv.innerText > 1){
      counterDiv.innerText = --counterDiv.innerText // Minus number

      // Minus Update price 
      uPrice.innerText = uPrice.innerText - oprice.innerText
   }
  
}

// ADD TO A CARD PRODUCT FUNCTION 
window.Addtocardclicked = function(prodInfo){
  // Yhn Agr LocalStorege ma hoga whi array aajiga wrna new Create hojai ga
  let AddToCardItems = JSON.parse(localStorage.getItem('AddToCardProducts')) || []
  let productLenghtPrint = document.querySelector('#item-counte')
  let modalOffDiv = document.querySelector('.section4ModaalMain');
  let backGroundBlur = document.querySelector('.background-blur')
  let QuanicounterSet = document.querySelector('#proqunanumber')

  let selectPInfoSto = {
      name :  prodInfo.parentNode.parentNode.childNodes[3].childNodes[3].innerText,
      imgSrc :prodInfo.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[1].src,
      price :  null,
      quantity :Number(prodInfo.parentNode.parentNode.childNodes[3].childNodes[11].innerText),
  }


  //  Price Asal ma 2 Element ka andr Stored ha yhn ma ye Check
  // krRha ka knsi User ka pass Show Horhi Whi Obj Store kr rha 
let oldPrice = prodInfo.parentNode.parentNode.childNodes[3].childNodes[7].childNodes[1];
let updatedPrice = prodInfo.parentNode.parentNode.childNodes[3].childNodes[7].childNodes[3];

  if(getComputedStyle(oldPrice).display === 'block'){
    selectPInfoSto.price = Number(oldPrice.innerText)
  }else{
    selectPInfoSto.price = Number(updatedPrice.innerText)
  }

  // First Check USER Login Or Not
   if(!window.localStorage.getItem('userLogin')){
    alert('first login')
   return window.location.href = '../login/login.html'
   }

   
    
// Now Check ka Agr Aik item Add HA agli br User whi Add kra To Sirf Us kiii
// Quantity Increment hu dobra wo Product kii alll Info Stored na hu
  
if(AddToCardItems.length != 0){

  let proQuaniIncreObj = AddToCardItems.findIndex((item) => item.name === selectPInfoSto.name)
   console.log(proQuaniIncreObj);

   if(proQuaniIncreObj != -1){
       AddToCardItems[proQuaniIncreObj].quantity += selectPInfoSto.quantity
       AddToCardItems[proQuaniIncreObj].price += selectPInfoSto.price
   }
   else{
    AddToCardItems.push(selectPInfoSto)
    productLenghtPrint.innerText =Number(productLenghtPrint.innerText) + 1 
   }
   
   
}
else{
   AddToCardItems.push(selectPInfoSto)
  productLenghtPrint.innerText =Number(productLenghtPrint.innerText) + 1 
  }

  localStorage.setItem('AddToCardProducts', JSON.stringify(AddToCardItems))
  alert('adddToCard Done')
  // productLenghtPrint.innerText =Number(productLenghtPrint.innerText) + 1 || ''
  
  console.log(modalOffDiv);
  
modalOffDiv.style.display = 'none'
backGroundBlur.style.display = 'none'
oldPrice.style.display = 'block'
updatedPrice.style.display = 'none'
QuanicounterSet.innerText = 1
  
   
}

// This Function go to the user in Your Card page
window.gotoTheCardPage = function(){
  window.location.href = '../Card/card.html'
  let itemCounter = document.getElementById('item-counte')
      itemCounter.innerText = 0
}

// This Function Prints All AddTo Card Product In The Card File
window.addToCardProductPrints = function(){
   let printDiv = document.querySelector('#sl-Secondline-main')
   let msg = document.querySelector('#msg')
   let AddToCardItems = JSON.parse(localStorage.getItem('AddToCardProducts')) || []
   
   console.log(AddToCardItems);
   
  if(AddToCardItems.length > 0){
     msg.style.display = 'none'

     AddToCardItems.forEach(item =>{
      // console.log(item);
      
      printDiv.innerHTML += `
      <div class="allLine-flex">
        <div class="Img-and-description-main">
          <img src="${item.imgSrc}">
          <h3> ${item.name} </h3>
        </div>
        <div class="Quantity-and-Price-main">
          <h2 class="Quantity"> ${item.quantity}</h2>
          </div>
          <h2 class="Price"> ${item.price} </h2>
        <div class="remove-btns">
          <button class="heart">❤</button>
          <button class="delete" onclick = 'removeAddToCard(this)'>Remove</button>
        </div>
      </div>
    `;
     })
  }
  else{
    msg.style.display = 'block'
  }

  ProductTotaPricePrint()
   
   
}

// This Function Remove the Product By the Cart
window.removeAddToCard = function(e){
  let productName = e.parentNode.parentNode.childNodes[1].childNodes[3].innerText
  let AddToCardItems = JSON.parse(localStorage.getItem('AddToCardProducts')) 
  let msg = document.querySelector('#msg')

  // FindIndex se user ka selct Kiya hua Product KA index Niakl
  // rha And array me Se US Product Object Ko REmove Kr rha 
  
   let findIndex = AddToCardItems.findIndex(item => item.name === productName)
   AddToCardItems.splice(findIndex, 1)

   localStorage.setItem('AddToCardProducts', JSON.stringify(AddToCardItems)) // Updated Array Set In LocalStorage
     
   e.parentNode.parentNode.remove() // Jis Prdoduct ko User ne Remove Kiya us ka DIV  REMOVE KRAYA RUN TIME PA

  //  If Array Empty Msg Show And Remove AddToCardProducts Array By the LocalStoarge
   if(AddToCardItems.length === 0){
    localStorage.removeItem("AddToCardProducts")
    msg.style.display = 'block'
   }

   ProductTotaPricePrint()
  
}


// This Function Print The Total AddTocard Product Price Print
// I Call This In the Two Function Firts addToCardProductPrints
// Second removeAddToCard Reson That KA Product Remove Hone pa
// Value CHanged hoti rha
window.ProductTotaPricePrint  = function(){
  let printDiv = document.getElementById('Total')
  let AddToCardItems = JSON.parse(localStorage.getItem('AddToCardProducts'))
  let totalPriceStored = 0;

  if(AddToCardItems){
  AddToCardItems.forEach((item) => {totalPriceStored+= item.price;})
}
else{
  console.log('else ma');
  
  totalPriceStored = 0
}
printDiv.innerHTML = totalPriceStored
}

if(window.location.href.includes('card')){
  addToCardProductPrints()
}


// PRODUCTS PURCHASE FUNCTION

window.PurchaseProduct = async function(){
 let addToCardArr = JSON.parse(window.localStorage.getItem('AddToCardProducts'))
 let userLoginId = window.localStorage.getItem('userLogin')

//  Check user Login Or Not 
//& Check user AddProductIn card or not 
  if(!userLoginId || !addToCardArr){
        alert('gooo')
        window.location.href = '../Shop/shop.html'
        return
  }

  //  If User Login And AddtoCardProduct This Code Run

  try {
    let orderRef = doc(db, 'Orders', userLoginId)

    // FIRST GET USER KA ORDER OBJ IF OBJ HA USER KA TO US OBJ
    // KA ANDR ITEMS KA ARRAY KA ANDR AUR ITEMS ADD HOJYEE
    // ELSE MA OBJ ADD HOJYEE DIRECT
    let querySnap =  await getDoc(orderRef)  // Get User Order Obj 


    
    if(querySnap.exists()){        // Agr User ka Obj mile To If New Items be Add Hojyeee ga
      console.log('ifff ma');
      
      let userOrderObj = querySnap.data()
      userOrderObj.items.push(...addToCardArr)
     
      setDoc(orderRef, userOrderObj)
    }

    else{                         // nhi To Create hojyee ga User Obj and Add User Obj In DAtabase
      console.log('Else ma');
 
      setDoc(orderRef, {
            userId : userLoginId,
            items : addToCardArr,
            status : 'Pending',
            createdAt: serverTimestamp(), // Firebase ka automatic timestamp
          },
          { merge: true }) // → Agar document pehle se exist karta hai, to naye fields update honge bina purane delete kiye.))

    }




  // //  LocalStorege SE ADDTOCARD ARRAY Delete
   alert('AddTo Card SucessFully')
  localStorage.removeItem('AddToCardProducts')

  let msg = document.querySelector('#msg')   
  let allProductsPrice = document.getElementById('Total')
  let productsPrintMain = document.querySelectorAll('.allLine-flex')
      productsPrintMain.forEach(item => item.remove())
      msg.style.display = 'block' 
      allProductsPrice.innerHTML = 0

     



  
    
  } 
  catch (error) {
    console.log('err',error);
    
  }




 
  
}

