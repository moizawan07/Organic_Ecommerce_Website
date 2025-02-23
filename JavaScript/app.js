
// NAVBAR ON / OFF  FUNCTION
function navOn() {
  let ul =         document.querySelector(".navbar");          // GET KR RHA JIS JIS PR CLASS ADD KRNI
  let offerMsg =   document.querySelector(".offerMsg");
  let counterDiv = document.querySelector(".card-items-count");
  let profileDiv = document.querySelector(".profile");
    ul.classList.toggle('Show')                               // SET KR RHA CLASS JIS JIS KO GET KIYA
    offerMsg.classList.toggle('Show')
    counterDiv.classList.toggle('Show')
    profileDiv.classList.toggle('Show')
  
}

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


