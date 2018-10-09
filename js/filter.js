$(function () {

  var $filterInput = $('.js-filter-input');
  var $filterReset = $('.js-filter-input-reset');
  var $filterDropdownLabel = $('.js-filter-dropdown-label');
  var $filterDropdownItem = $('.js-filter-dropdown-item');
  var $filterDate = $('.js-filter-datepicker');
  var $filterForm = $('.js-table-header');
  var $formsError = $('.js-forms-error');
  var $tableResultAppend = $('.js-table-result');

  $(window).on('scroll', function () {
    hideFiltersDropdowns();
  });

  /**
   * hide filters fropdown on scroll when table header is fixed
   */
  function hideFiltersDropdowns() {
    if ($filterForm.hasClass('fixed')){
      // hide filter dropdown
      var $filterDropdownColumn = $filterInput.closest('.b-result-table__column');
      if ($filterDropdownColumn.hasClass('focus')){
        $filterDropdownColumn.removeClass('focus');
      }

      // hide filter datepicker
      if ($('.datepick-popup', $filterForm).is(':visible')){
        $filterDate.datepick('hide');
      }
    }
  }


  /**
   * datepicker filter
   */
  $filterDate.datepick({
    rangeSelect: true,
    regionalOptions: ['ru'],
    useMouseWheel: false,
    popupContainer: $filterDate.closest($('.b-result-table__column')),
    prevText: '',
    nextText: '',
    dateFormat: 'dd MM',
    monthNames: ['Янв','Фев','Мар','Апр','Май','Июн',
      'Июл','Авг','Сен','Окт','Ноя','Дек'],
    onSelect: function(dates) {
      $filterDate.trigger('change');
    }
  });


  /**
   * inputs placeholder move
   */
  $filterInput.on('keyup paste change input', function () {

    var $parent = $(this).closest('.js-filter-input-box');
    if ($(this).val() != '' && !$parent.hasClass('filled')){
      $parent.addClass('filled');
    } else if ($(this).val() == '' && $parent.hasClass('filled')){
      $parent.removeClass('filled');
    }

    // if ($filterForm.hasClass('short')){
    //   $filterForm.removeClass('short');
    // }
    submitFilter();
  });


  /**
   * func submit filters form
   */
  function submitFilter() {
    $.ajax({
      url: $filterForm.attr('action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: $filterForm.serialize(),
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? filterSuccess(data.success) : filterError()
      },
      error: function () {
        filterError();
      }
    });
  }

  /**
   * success append data to list
   */
  function filterSuccess(data) {
    // data = '<li class="js-table-item b-result-table__item"><div class="js-table-item-toggle b-result-table__item-top"><div class="b-result-table__checkbox"><div class="b-table-checkbox"><input id="item1" name="item1" type="checkbox" class="b-table-checkbox__input"><label for="item1" class="b-table-checkbox__label"><span class="b-table-checkbox__icon"></span></label></div></div><div class="b-result-table__column"># 001-232-42</div><div class="b-result-table__column"><span class="b-result-table__status">Ожидает</span></div><div class="b-result-table__column">15 авг в 20:30</div><div class="b-result-table__column">Константин П.</div><div class="b-result-table__column">Леонид К.</div><div class="b-result-table__column">*T26841</div><div class="b-result-table__column">К186НВ<sup>777</sup></div></div><div class="b-result-table__info b-result-table__info_auto"><a href="#" class="b-result-table__button"></a><div class="b-result-table__info-table"><div class="b-result-table__info-tr"><div class="b-result-table__info-column"><span>Марка</span>Mercedes-Benz</div><div class="b-result-table__info-column"><span>Модель</span>CLA 250 4MA</div><div class="b-result-table__info-column"><span>Год выпуска</span>2017</div><div class="b-result-table__info-column"><span>VIN номер</span>4USBT53544LT26841</div><div class="b-result-table__info-column"><span>Государственный номер</span>A 091 XE<sup>777</sup></div></div><div class="b-result-table__info-tr"><div class="b-result-table__info-column"><span>Фамилия</span>Константинопольский</div><div class="b-result-table__info-column"><span>Имя</span>Константин</div><div class="b-result-table__info-column"><span>Отчество</span>Константинович</div><div class="b-result-table__info-column"><span>Мобильный телефон</span>8 965 072 18 66</div><div class="b-result-table__info-column"><span>E-mail</span>kostyan777@gmail.com</div></div></div></div></li>'
    $tableResultAppend.html(data);
  }

  /**
   * error forms
   */
  function filterError() {
    $formsError.addClass('show');
    setTimeout(function () {
      $formsError.removeClass('show');
    }, 4000);
  }

  /**
   * focus set css to column and focus out
   */
  $filterInput.on('focus', function () {
    var $parent = $(this).closest('.b-result-table__column');
    $parent.addClass('focus');
  }).on('focusout', function () {
    var $parent = $(this).closest('.b-result-table__column');
    $parent.removeClass('focus');
  });

  /**
   * reset filter input
   */
  $filterReset.on('click', function (e) {
    e.preventDefault();

    var $parent = $(this).closest('.js-filter-input-box');
    $('input', $parent).val('').trigger('change');
  });

  /**
   * add focus to label when dropdown click
   */
  $filterDropdownLabel.on('click', function (e) {
    e.preventDefault();

    var $target = $(e.target);
    if ($target.is($filterReset)){
      $(this).removeClass('focus');
    } else {
      $(this).toggleClass('focus');
    }
  });

  /**
   * document click events
   */
  $(document).click(function (e) {
    var $target = $(e.target);

      // set value of dropdown filter on click to item
      if ($target.is($filterDropdownItem)) {
        var thisText = $target.html();
        $filterDropdownItem.closest('li').removeClass('active');
        $target.closest('li').addClass('active');
        $('.js-filter-input', $filterDropdownLabel).val(thisText).trigger('change');
      }

      // close dropdown filter on click anywhere not this label
      if (!$target.is('.js-filter-dropdown-label *') && !$target.is('.js-filter-dropdown-label')) {
        $filterDropdownLabel.removeClass('focus');
      }
  });

});