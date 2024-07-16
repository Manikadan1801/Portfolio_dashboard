$(document).ready(function () {

  // this for top nav bar
  var divWidth = $('#nav').width();
  if (divWidth > 960) {
    $('#navp').addClass('p-fixed');
  }

  // this for work section tabs
  $('.header-right-nav > a').click(function () {
    document.querySelectorAll('.header-right-nav > a').forEach(function (item) {
      item.classList.remove('active')
    })
    this.classList.add('active')
  });

  $('.nav-parent > a').click(function () {
    document.querySelectorAll('.nav-parent > a').forEach(function (item) {
      item.classList.remove('active')
    })
    this.classList.add('active')
  });


  // this for progrees bar animation
  function animateListItems() {
    var widths = ['80%', '95%', '95%', '55%', '90%', '25%'];
    $("li .progress-bar").each(function (index) {
      var widthIndex = index % widths.length;
      console.log(index);
      $(this).animate({
        width: widths[widthIndex]
      }, 1000);
    });
  }

  const observerConfig = {
    rootMargin: '-50% 0% -50% 0%',
    threshold: 0
  }

  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateListItems();
        textAnimation();
        observer.disconnect();
        console.log('intersecting')
      }
    });
  }, observerConfig);

  function textAnimation() {
    $("p, h2, h1").css({
      "opacity": "1",
      "transition": "opacity 1s"
    });
  }


  observer.observe($("#Intro")[0]);

});
