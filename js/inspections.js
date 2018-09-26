$(function () {

  var $sidebar = $('.js-sidebar');
  var $content = $('.js-content');
  var $resultTable = $('.js-result-table');
  var windowHeight = $(window).height();
  var $prolongateInput = $('.js-prolongate-input');
  var $prolongateForm = $('.js-prolongate-form');
  var $prolongateReset = $('.js-prolongate-reset');
  var $productListForm = $('.js-product-list-form');
  var $prolongateError = $('.js-prolongate-error');
  var $prolongateSuccess = $('.js-prolongate-success');
  var $prolongateSuccessClose = $('.js-prolongate-success-close');
  var $prolongateSuccess_date = $('.js-prolongate-date-success');
  var $tableCheckboxAll = $('.js-table-checkbox-all');
  var AMOUNT_TABLE_CHECKBOX = 0;
  var $prolongateAmountBar = $('.js-prolongate-amount');
  var $prolongateAmountSuccess = $('.js-prolongate-amount-success');
  var $tableResultAppend = $('.js-table-result');
  var $filterForm = $('.js-table-header');
  var $searchPageInput = $('.js-search-page-input');
  var $scrollTop = $('.js-scroll-top');

  $(window).on('scroll', function () {
    fixFilter();
  });

  $(window).on('resize', function () {
    windowHeight = $(window).height();

    setMinTableHeight();
    fixFilter();
  });

  $scrollTop.on('click', function (e) {
    e.preventDefault();

    scrollTo($('body'));
  });

  /**
   * fix filter and make it short view
   */
  function fixFilter() {
    var vals = $filterForm[0].getBoundingClientRect();

    if (vals.top <= vals.height * -1 && !$filterForm.hasClass('fixed')){
      $scrollTop.addClass('show');
      $filterForm.addClass('fixed moveTop');
      setTimeout(function () {
        $filterForm.removeClass('moveTop');
      }, 10);
    } else if (vals.top > vals.height * -1 && $filterForm.hasClass('fixed')){
      $filterForm.removeClass('fixed');
      $scrollTop.removeClass('show');
    }

    // short
    if (vals.top <= vals.height * -1 && !$filterForm.hasClass('short')){
      $filterForm.addClass('short');
    } else if (vals.top > vals.height * -1 && $filterForm.hasClass('short')){
      $filterForm.removeClass('short');
    }
  }
  fixFilter();

  /**
   * show prolongate
   */
  function showProlongate() {
    if (AMOUNT_TABLE_CHECKBOX != 0){
      var wordAmount = declension(AMOUNT_TABLE_CHECKBOX, 'выбранного осмотра', 'выбранных осмотров', 'выбранных осмотров');
      $prolongateForm.addClass('show');
      $content.addClass('padding');
      $prolongateAmountBar.html(AMOUNT_TABLE_CHECKBOX+' '+wordAmount);
    } else if (AMOUNT_TABLE_CHECKBOX == 0){
      $prolongateForm.removeClass('show');
      $content.removeClass('padding');
      $prolongateForm[0].reset();
      $('input', $prolongateForm).trigger('change');
    }
  }

  /**
   * checkbox in table counter
   */
  $(document).on('change', '.js-table-checkbox', function () {

    countAmountChecked();

    (AMOUNT_TABLE_CHECKBOX == $('.js-table-checkbox').length) ?
      $tableCheckboxAll.prop('checked', true) :
      $tableCheckboxAll.prop('checked', false);

    showProlongate();
  });

  /**
   * make check all checkbox for count
   */
  function countAmountChecked() {
    AMOUNT_TABLE_CHECKBOX = 0;
    $('.js-table-checkbox').each(function () {
      if ($(this).is(':checked'))
        AMOUNT_TABLE_CHECKBOX++
    });
  }

  /**
   * checkbox all behaviour
   */
  $tableCheckboxAll.on('change', function () {
    ($(this).is(':checked')) ?
      $('.js-table-checkbox').prop('checked', true).trigger('change') :
      $('.js-table-checkbox').prop('checked', false).trigger('change');

  });

  /**
   * prolongate success close click
   */
  $prolongateSuccessClose.on('click', function (e) {
    e.preventDefault();

    $prolongateSuccess.addClass('hidden');
  });

  /**
   * submit prolongate
   */
  $prolongateForm.on('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if ($prolongateInput.val() != ''){
      submitProlongate();
    } else {
      $prolongateInput.datepick('show')
    }
  });

  /**
   * fn submit prolongate
   */
  function submitProlongate() {
    var data = $prolongateForm.serialize();
    var list = $productListForm.serialize();

    $.ajax({
      url: $prolongateForm.attr('action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: {
        'date': data,
        'list': list,
        'filters': $filterForm.serialize()
      },
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessProlongate(data.success) : showErrorProlongate()
      },
      error: function () {
        // showErrorProlongate();
        showSuccessProlongate();
      }
    });
  }

  /**
   * success prolongate
   */
  function showSuccessProlongate(data){
    var wordAmount = declension(AMOUNT_TABLE_CHECKBOX, 'осмотр был продлен', 'осмотра были продлены', 'осмотров были продлены');
    $prolongateSuccess.removeClass('hidden');
    $prolongateForm.removeClass('show');
    $prolongateForm[0].reset();
    $('input', $prolongateForm).trigger('change');
    $prolongateAmountSuccess.html(AMOUNT_TABLE_CHECKBOX + ' ' + wordAmount);

    $productListForm[0].reset();
    $tableCheckboxAll.prop('checked', false);
    AMOUNT_TABLE_CHECKBOX = 0;
    $content.removeClass('padding');

    // $tableResultAppend.html(data);

    setTimeout(function () {
      $prolongateSuccess.addClass('hidden');
    }, 10000);
  }

  /**
   * show error
   */
  function showErrorProlongate() {
    $prolongateError.removeClass('hidden');

    setTimeout(function () {
      $prolongateError.addClass('hidden');
    }, 3000);
  }

  /**
   * reset date prolongate
   */
  $prolongateReset.on('click', function (e) {
    e.preventDefault();

    $tableCheckboxAll.prop('checked', false).trigger('change');

  });

  /**
   * set fill class when datepicker for prolongate selected
   */
  $prolongateInput.on('keyup paste change input', function () {

    var $parent = $(this).closest('.b-prolongate__date');
    if ($(this).val() != '' && !$parent.hasClass('filled')){
      $parent.addClass('filled');
    } else if ($(this).val() == '' && $parent.hasClass('filled')){
      $parent.removeClass('filled');
    }
  });

  /**
   * datepicker for prolongate
   */
  $prolongateInput.datepick({
    regionalOptions: ['ru'],
    useMouseWheel: false,
    popupContainer: $prolongateInput.closest('.b-prolongate__date-box'),
    prevText: '',
    nextText: '',
    dateFormat: 'dd M',
    monthNames: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
      'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    onSelect: function (dates) {
      $prolongateInput.trigger('change');
      $prolongateSuccess_date.html($prolongateInput.val());
    }
  });

  /**
   * default settings
   */
  function defaultSettings() {
    $sidebar.addClass('close');
    $content.addClass('b-inspection-page');
    var tabVal = $('.b-top-links__link.active').html();
    $searchPageInput.val('осмотры '+tabVal);
  }
  defaultSettings();

  /**
   * set min height to table to have it full screen
   */
  function setMinTableHeight() {
    var tableTop = $resultTable[0].getBoundingClientRect().top;
    var minHeight = windowHeight - tableTop;

    $resultTable.css('min-height', minHeight+'px');
  }
  setMinTableHeight();

  /**
   * doc click
   */
  $(document).on('click', '.js-table-item-toggle', function (e) {
    var $target = $(e.target);

    // open more info on tab
    if (!$target.is('.b-table-checkbox *')) {
      var $thisItem = $(this).closest('.js-table-item');
      $thisItem.toggleClass('open');
    }
  })

});