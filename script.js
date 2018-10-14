"use strict";

/*--------------------------------------------------------------
1.0 Scrolling Animation initiate
--------------------------------------------------------------*/

 AOS.init();

 /*--------------------------------------------------------------
 2.0 Smooth scrolling
 --------------------------------------------------------------*/

// Select all links with hashes
$('a[href*="#"]')
// Remove links that don't actually link to anything
.not('[href="#"]')
.not('[href="#0"]')
.not('[href="#embed"]')
.click(function(event) {
  // On-page links
  if (
    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
    &&
    location.hostname == this.hostname
  ) {
    // Figure out element to scroll to
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 900, function() {
        // Callback after animation
        // Must change focus!
        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) { // Checking if the target was focused
          return false;
        } else {
          $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
          $target.focus(); // Set focus again
        };
      });
    }
  }
});

/*--------------------------------------------------------------
3.0 onScroll navbar animation
--------------------------------------------------------------*/

var iScrollPos = 0;

$(window).scroll(function () {

    var iCurScrollPos = $(this).scrollTop();

    if (iCurScrollPos > iScrollPos) {

        //Scrolling Down
$('#nav-bar').addClass('nav-gradient');
} else if (iCurScrollPos < 250){

       //Scrolling Up past 250px of top of page
$('#nav-bar').removeClass('nav-gradient');
    }

    iScrollPos = iCurScrollPos;

});

/*--------------------------------------------------------------
3.0 Mobile Menu
--------------------------------------------------------------*/

$('#mySidenav a').on('click', function() {
  $("#mySidenav").toggleClass('is-active');
  $("#js-menu-toggle").toggleClass('is-active');
  // $("body").toggleClass("stop-scrolling");
});

$('#js-menu-toggle').on('click', function() {
  $(this).toggleClass('is-active');
  $("#mySidenav").toggleClass('is-active');
    // $("body").toggleClass("stop-scrolling");
});

/*--------------------------------------------------------------
4.0 Arrow Top
--------------------------------------------------------------*/

if ($('#back-to-top').length) {
  var scrollTrigger = 100, // px
  backToTop = function () {
    var scrollTop = $(window).scrollTop();
    if (scrollTop > scrollTrigger) {
      $('#back-to-top').addClass('show');
    } else {
      $('#back-to-top').removeClass('show');
    }
  };
  backToTop();
  $(window).on('scroll', function () {
    backToTop();
  });
  $('#back-to-top').on('click', function (e) {
    e.preventDefault();
    $('html,body').animate({
      scrollTop: 0
    }, 700);
  });
}

/*--------------------------------------------------------------
5.0 Expand toggle buttons
--------------------------------------------------------------*/
var expanded = document.getElementById('js-toggle-specs');
var lessen = document.getElementById('lessen');

$("#js-toggle-specs").on('click', function() {
  $("#js-expand-specs").slideToggle();
  if (expanded.innerText == "+"){
    expanded.innerText = "-";
    lessen.innerText = "lessen List";
  }else{
    expanded.innerText = "+";
    lessen.innerText = "expand List";
  }
})

/*--------------------------------------------------------------
6.0 Miscellanous
--------------------------------------------------------------*/

// Example starter JavaScript for disabling form submissions if there are invalid fields
// (function() {
//   'use strict';
//   window.addEventListener('load', function() {
//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.getElementsByClassName('needs-validation');
//     // Loop over them and prevent submission
//     var validation = Array.prototype.filter.call(forms, function(form) {
//       form.addEventListener('submit', function(event) {
//         if (form.checkValidity() === false) {
//           event.preventDefault();
//           event.stopPropagation();
//         }
//         form.classList.add('was-validated');
//       }, false);
//     });
//   }, false);
// })();

// scroll-snapping - https://css-tricks.com/practical-css-scroll-snapping/
// const gra = function(min, max) {
//     return Math.random() * (max - min) + min;
// }
// const init = function(){
// 	let items = document.querySelectorAll('js-scroll-snapping');
// 	for (let i = 0; i < items.length; i++){
// 		items[i].style.background = randomColor({luminosity: 'light'});
// 	}
// 	cssScrollSnapPolyfill()
// }
// init();
