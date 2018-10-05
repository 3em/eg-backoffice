$(function () {

  var $navBox = $('.js-nav-box');
  var $navLink = $('.js-nav-link');
  var $navItems = $('.js-nav-items');
  var MAGIC_PADDING = 120;

  $(window).on('scroll resize', function () {
    fixNav();
    navActivation();
  });

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