$(function () {

  var $body = $('body');
  var $sidebarToggle = $('.js-sidebar-toggle');
  var $sidebar = $('.js-sidebar');
  var $content = $('.js-content');
  var $searchCall = $('.js-search-call');
  var $searchForm = $('.js-search-form');
  var $searchInput = $('.js-search-input');
  var $filterForm = $('.js-table-header');
  var $tableResultAppend = $('.js-table-result');
  var $searchError = $('.js-search-form-error');
  var $minHeightBlock = $('.js-min-height');
  var sttm;
  var $popupOverlay = $('.js-overlay');
  var $popup = $('.js-popup');
  var $video = $('.js-video');
  var $popupCloseLink = $('.js-close-popup');
  var $accordionLink = $('.js-accordion-link');

  var windowHeight = $(window).height();
  var windowWidth = $(window).width();

  $(window).on('resize', function () {
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    resizeSizes();
    openSideBarOnWidth();
  });

  /**
   * if width wide open sidebar
   */
  function openSideBarOnWidth() {

    if (windowWidth >= 1400 && $sidebar.hasClass('close') && $content.hasClass('b-inspection-page') ){
      $sidebar.removeClass('close');
      $content.addClass('shift');
    } else if (windowWidth < 1400 && !$sidebar.hasClass('close') && $content.hasClass('b-inspection-page') ){
      $sidebar.addClass('close');
      $content.removeClass('shift');
    }
  }
  openSideBarOnWidth();

  /**
   * accordion
   */
  $accordionLink.on('click', function (e) {
    e.preventDefault();

    var $thisBox = $(this).closest('.js-accordion-box');
    $thisBox.toggleClass('open');
    $('.js-accordion-item', $thisBox).slideToggle(250);
  });

  /**
   * close popup on click close link
   */
  $popupCloseLink.on('click', function (e) {
    e.preventDefault();
    closePopup();
  });

  /**
   * close any popup func
   */
  function closePopup() {
    $popupOverlay.removeClass('show').removeClass('b-overlay__grey');
    $popup.removeClass('show');
    $body.removeClass('overflow');

    if ($video.length){
      $video[0].pause();
      $video[0].currentTime = 0;
    }
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $popupOverlay.is(':visible')) {
      closePopup();
    }
  });

  /**
   * resize blocks values
   */
  function resizeSizes() {
    $minHeightBlock.css('min-height', windowHeight+'px');
  }
  resizeSizes();

  /**
   * inputs placeholder move
   */
  $(document).on('keyup paste change input', '.js-input', function () {

    var $parent = $(this).closest('.js-input-box');
    if ($(this).val() != '' && !$parent.hasClass('shifted')){
      $parent.addClass('shifted');
    } else if ($(this).val() == '' && $parent.hasClass('shifted')){
      $parent.removeClass('shifted');
    }
  });

  /**
   * toggle open sidebar
   */
  $sidebarToggle.on('click', function (e) {
    e.preventDefault();
    $sidebar.toggleClass('close');
    $content.toggleClass('shift');
  });


  /**
   * send form search on input
   */
  $searchInput.on('keyup paste', function (e) {
    if (sttm) {
      clearTimeout(sttm);
    }
    var key = 'which' in e ? e.which : e.keyCode;
    if (key === 13) {
      return;
    } else if (key != 27) {
      // var thisVal = $(this).val();

      sttm = setTimeout(function () {
        submitSearch($searchForm);
      }, 200);
    }
  });

  $searchForm.on('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    submitSearch($searchForm);
  });

  /**
   * seach submit
   */
  function submitSearch($form) {
    var data;

    if ($filterForm.length){
      data = {
        'filters': $filterForm.serialize(),
        'searchForm': $form.serialize()
      }
    } else {
      data = $form.serialize();
    }

    $.ajax({
      url: $form.attr('action'),
      processData: false,
      contentType: false,
      method: "GET",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessSearch(data.success) : showErrorSearch()
      },
      error: function () {
        // showErrorSearch();
        showSuccessSearch();
      }
    });
  }

  /**
   * error search
   */
  function showErrorSearch() {
    $tableResultAppend.html('');
    $searchError.removeClass('hidden');
  }
  
  function showSuccessSearch(data) {
    $tableResultAppend.html(data).addClass('searching');
  }



  /**
   * search click
   */
  $searchCall.on('click', function (e) {
    e.preventDefault();

    $searchCall.toggleClass('active');
    $searchForm.toggleClass('open');

    if ($searchForm.hasClass('open')){
      scrollTo($body);
      setTimeout(function () {
        $searchInput.focus();
      }, 500);
    } else {
      $tableResultAppend.removeClass('searching');
    }
  });

  /**
   * textarea height with content text
   */
  var defHeight = 50;
  $('textarea').each(function () {
    this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
  }).on('keyup paste change input focus', function () {
    this.style.height = '0';
    if ($(this).val() != ''){
      this.style.height = (this.scrollHeight) + 'px';
    } else {
      this.style.height = (defHeight) + 'px';
    }
  });

  /**
   * document click events
   */
  $(document).click(function (e) {
    var $target = $(e.target),
      $parent = undefined;

    // dropdown behaviour
    if ($target.is('.b-dropdown *')) {
      $parent = $target.parents('.b-dropdown');
      if ($target.is('.b-dropdown__item')) {
        $('.b-dropdown__item', $parent).removeClass('hidden active');
        $parent.removeClass('b-dropdown__first').removeClass('first-open');
        $target.addClass('hidden active');
        $('.b-dropdown__text', $parent).html($target.html()).addClass('js-link-stop');

        var $thisInputForSelect = $('.js-input-for-select', $parent.closest('.b-dropdown__box'));

        if ($target.data('letter') != undefined){
          $thisInputForSelect.val($target.data('letter')).trigger('change');
        } else {
          $thisInputForSelect.val($target.text()).trigger('change');
        }

        checkDropdownValueEmpty($thisInputForSelect, $parent);

        // if data-link go by url
        if ($target.data('link') != undefined)
          window.location = $target.data('link');
      }
      toggleDropdown($parent)
    } else {
      $('.b-dropdown').each(function () {
        if (!$(this).hasClass('first-open')){
          $(this).removeClass('b-dropdown_open');
        }
      })
    }
  });

  /**
   * add shifted class when input has value
   * @param $input
   * @param $parent
   */
  function checkDropdownValueEmpty($input, $parent) {
    if ($input.val() != '' && !$parent.hasClass('shifted')){
      $parent.addClass('shifted')
    } else if ($input.val() == '' && $parent.hasClass('shifted')){
      $parent.removeClass('shifted')
    }
  }

  /**
   * dropdown open | close func
   * @param parent
   */
  function toggleDropdown(parent) {
    if (parent.hasClass('b-dropdown_open')) {
      parent.removeClass('b-dropdown_open');
    } else {
      $('.b-dropdown').each(function () {
        if (!$(this).hasClass('first-open')){
          $(this).removeClass('b-dropdown_open');
        }
      });
      parent.addClass('b-dropdown_open');
      $('b-dropdown__text', parent).removeClass('js-link-stop');
    }
  }

});

/**
 * declension words
 */
declension = function(number, one, two, five) {
  number = Math.abs(number);
  number %= 100;
  if (number >= 5 && number <= 20) {
    return five;
  }
  number %= 10;
  if (number == 1) {
    return one;
  }
  if (number >= 2 && number <= 4) {
    return two;
  }
  return five;
};

/**
 * scroll to block
 * @param selector
 */
scrollTo = function(selector, offset, scrollElem, position) {
  setTimeout(function () {
    !offset ? offset = 0 : offset;
    if (!position == true){
      var scroll = $(selector).offset().top - offset;
    } else {
      var scroll = $(selector).position().top - offset;
    }

    if (!scrollElem){
      scrollElem = $('html,body');
    }
    scrollElem.animate({
      scrollTop: scroll
    }, 500);
  }, 10);
};