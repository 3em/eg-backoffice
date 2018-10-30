$(function () {

  var $navBox = $('.js-nav-box');
  var $navLink = $('.js-nav-link');
  var $navItems = $('.js-nav-items');
  var $countInsert = $('.js-count');
  var $crashDocPics = $('.js-count-crash');
  var MAGIC_PADDING = 120;
  var MIN_VIEW = 5;
  var WIDTH_CHANGE = 1500;
  var windowWidth = $(window).width();

  $(window).on('resize', function () {
    windowWidth = $(window).width();
    fixNav();
    navActivation();
    crashPics();
  });

  $(window).on('scroll', function () {
    fixNav();
    navActivation();
  });

  function crashPics() {
    var length = $crashDocPics.length;
    $crashDocPics.addClass('hidden');

    (windowWidth >= WIDTH_CHANGE) ? MIN_VIEW = 8 : MIN_VIEW = 5;


    if (length <= MIN_VIEW+1){
      $countInsert.closest('.b-document').addClass('hidden');
      $crashDocPics.removeClass('hidden');
    } else {
      $crashDocPics.each(function (index) {
        var thisIndex = index + 1;
        if (thisIndex <= MIN_VIEW){
          $(this).removeClass('hidden')
        } else {
          return false;
        }
      })
    }

    var insertCount = length - MIN_VIEW;
    $('span', $countInsert).html('+'+insertCount);
  }
  crashPics();

  /**
   * nav click scroll
   */
  $navLink.on('click', function (e) {
    e.preventDefault();

    if (!$(this).hasClass('active')){
      var href = $(this).attr('href');

      if ($('#'+href))
        scrollTo($('#'+href), MAGIC_PADDING-1);
    }
  });

  function navActivation() {
    $navItems.each(function () {
      var vals = $(this)[0].getBoundingClientRect();
      var thisId = $(this).attr('id');
      var $thisLink = $('.js-nav-link[href='+thisId+']');


      if (vals.top <= MAGIC_PADDING && vals.top > vals.height * -1 + MAGIC_PADDING && !$thisLink.hasClass('active')){
        $navLink.removeClass('active');
        $thisLink.addClass('active')
      }
    })
  }
  navActivation();

  /**
   * fix nav
   */
  function fixNav() {
    var val_top = $navBox[0].getBoundingClientRect().top;

    if (val_top <= 0 && !$navBox.hasClass('fixed')){
      $navBox.addClass('fixed')
    } else if (val_top > 0 && $navBox.hasClass('fixed')){
      $navBox.removeClass('fixed')
    }
  }
  fixNav();

});