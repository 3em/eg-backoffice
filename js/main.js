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
  var sttm;

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