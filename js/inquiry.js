$(function () {

  var $agentsList = $('.js-agents-list');
  var $inquiryForm_agnent = $('.js-inquiry-form-agent');
  var $inquiryForm_personal = $('.js-inquiry-form-personal');
  var status_send = true;
  var STATUS_SUBMIT = false;
  var $buttonBar = $('.js-button-bar');
  var windowHeight = $(window).height();
  var $addItem = $('.js-add-item');
  var AGENTS_ID = 'agents';
  var PERSONAL_ID = 'personal';
  var $tabItemForm = $('.js-tab-item');
  var $formSuccess = $('.js-tab-item-success');
  var $tabLink = $('.js-top-tab');
  var $tabItem = $('.js-tab-item');

  $(window).on('scroll', function () {
    fixButtonBar();
  });

  $(window).on('resize', function () {
    windowHeight = $(window).width();
  });


  /**
   * tabs
   */
  $tabLink.on('click', function (e) {
    e.preventDefault();

    if (!$(this).hasClass('active')){
      $tabLink.removeClass('active');
      $(this).addClass('active');
      $tabItem.addClass('hidden');
      var thisId = $(this).attr('href');
      $(thisId).removeClass('hidden');

      checkDisabledButtonAgent($(thisId));
    }
  });

  /**
   * submit form
   */
  $tabItemForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);


    submit($this, $this.serialize());
    return false;
  });


  /**
   * fn submit form
   * @param $form
   * @param data
   */
  function submit($form, data) {

    $.ajax({
      url: $form.attr('action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccess($form) : showError($form)
      },
      error: function () {
        // showError($form);
        showSuccess($form);
      }
    });

  }

  /**
   * show error
   * @param $form
   */
  function showError($form) {
    $('.js-tab-item-error', $form).removeClass('hidden');
    setTimeout(function () {
      $('.js-tab-item-error', $form).addClass('hidden');
    }, 3000);
  }

  /**
   * show success
   * @param $form
   */
  function showSuccess($form) {
    $('.js-inquiry-item', $form).remove();
    $('.js-add-item', $form).trigger('click');
    $formSuccess.removeClass('hidden');

    setTimeout(function () {
      $formSuccess.addClass('hidden');
    }, 5000);
  }


  /**
   * add new item to form
   */
  $addItem.on('click', function (e) {
    e.preventDefault();

    var $thisForm = $(this).closest('.js-tab-item');
    var thisFormId = $thisForm.attr('id');
    var appendHtml;
    var newItemIndex = $('.js-inquiry-item', $thisForm).length + 1;


    if (thisFormId == AGENTS_ID){

      appendHtml = '<div class="js-inquiry-item b-inquiry__item">'+
          '<div class="js-input-box b-input__box b-input__box_name">'+
            '<input id="agents_'+newItemIndex+'_name" name="agents_'+newItemIndex+'[name]" class="js-required js-input js-input-agents b-input" type="text">'+
            '<label for="agents_'+newItemIndex+'_name" class="b-input__label">ФИО агента</label>'+
            '<a href="#" class="js-reset-input b-input__reset"></a>'+
            '<ul class="js-agents-list b-agents-list hidden"></ul>'+
          '</div>'+
          '<div class="js-input-box b-input__box b-input__box_contract">'+
            '<input id="agents_'+newItemIndex+'_number_1" name="agents_'+newItemIndex+'[number_1]" class="js-input js-input-contract b-input" type="text">'+
            '<label for="agents_'+newItemIndex+'_number_1" class="b-input__label">Номер договора</label>'+
            '<a href="#" class="js-reset-input b-input__reset"></a>'+
          '</div>'+
        '</div>';

      $(appendHtml).insertBefore('.js-button-bar-agent');
    } else if (thisFormId == PERSONAL_ID) {
      appendHtml = '<div class="js-inquiry-item b-inquiry__item show-contracts">'+
        '<div class="js-input-box b-input__box b-input__box_name">'+
        '<input id="personal_'+newItemIndex+'_name" name="personal_'+newItemIndex+'[name]" class="js-required js-input b-input" type="text">'+
        '<label for="personal_'+newItemIndex+'_name" class="b-input__label">ФИО клиента</label>'+
        '<a href="#" class="js-reset-input b-input__reset"></a>'+
        '<ul class="js-agents-list b-agents-list hidden"></ul>'+
        '</div>'+
        '<div class="js-input-box b-input__box b-input__box_contract">'+
        '<input id="personal_'+newItemIndex+'_number" name="personal_'+newItemIndex+'[number]" class="js-input js-required b-input" type="text">'+
        '<label for="personal_'+newItemIndex+'_number" class="b-input__label">Номер договора</label>'+
        '<a href="#" class="js-reset-input b-input__reset"></a>'+
        '</div>'+
        '</div>';

      $(appendHtml).insertBefore('.js-button-bar-personal');
    }

    if (thisFormId == AGENTS_ID) {
      var $thisItem = $('.js-inquiry-item', $thisForm).eq(newItemIndex - 1);
      var $thisAgentList = $('.js-agents-list', $thisItem);
      setDefaultAgentsList($thisAgentList, defaultList);
    }

    checkDisabledButtonAgent($thisForm);
  });


  /**
   * fix button bar
   */
  function fixButtonBar() {
    $buttonBar.each(function () {
      if ($(this).is(':visible')){

        console.log('asda');

        var vals = $(this)[0].getBoundingClientRect();
        if (vals.top > windowHeight - vals.height && !$(this).hasClass('fixed')){
          $(this).addClass('fixed')
        } else if (vals.top <= windowHeight - vals.height && $(this).hasClass('fixed')){
          $(this).removeClass('fixed')
        }

      }
    });
  }
  fixButtonBar();


  /**
   * make check for button on change input
   */
  $(document).on('keyup paste change input', $('input, textarea', $inquiryForm_agnent), function () {
    checkDisabledButtonAgent($inquiryForm_agnent);
  });

  $(document).on('keyup paste change input', $('input, textarea', $inquiryForm_personal), function () {
    checkDisabledButtonAgent($inquiryForm_personal);
  });

  /**
   * disabled button check
   * @param $form
   */
  function checkDisabledButtonAgent($form) {
    STATUS_SUBMIT = false;

    if ($form.hasClass('js-inquiry-form-agent')){
      $('.js-inquiry-item', $form).each(function () {
        if ( $('.js-input-agents', $(this)).val() != '' ){
          STATUS_SUBMIT = true;
        } else {
          STATUS_SUBMIT = false;
          return false;
        }

        if (STATUS_SUBMIT){
          $('.js-input-contract', $(this)).each(function () {
            if ($(this).val() != ''){
              STATUS_SUBMIT = true;
              return false;
            } else {
              STATUS_SUBMIT = false;
            }
          });
        }
      });
    } else if ($form.hasClass('js-inquiry-form-personal')) {
      $('.js-required', $form).each(function () {
        if ($(this).val() == ''){
          STATUS_SUBMIT = false;
          return false;
        } else {
          STATUS_SUBMIT = true;
        }
      })
    }

    if (STATUS_SUBMIT){
      $('.b-button', $form).removeAttr('disabled');
      $('.js-add-item', $form).removeClass('hidden');
    } else {
      $('.b-button', $form).attr('disabled', 'disabled');
      $('.js-add-item', $form).addClass('hidden');
    }
  }

  /**
   * add new contract
   */
  var sttm2;
  $('body').on('keyup', '.js-input-contract', function () {

    var $thisInquiryItem = $(this).closest('.js-inquiry-item');
    var itemIndex = $thisInquiryItem.index()+1;
    var $thisContractsInput = $('.js-input-contract', $thisInquiryItem);
    var count = 0;
    var amountContractsInput = $thisContractsInput.length;
    var newIndex = 0;

    if (sttm2) {
      clearTimeout(sttm2);
    }

    $thisContractsInput.each(function () {
      if ($(this).val().replace(/[a ]/g, '') != ''){
        count++;
        var thisIndex = parseInt($(this).attr('id').replace('agents_'+itemIndex+'_number_', ''));

        if (thisIndex > newIndex){
          newIndex = thisIndex
        }

      }
    });

    sttm2 = setTimeout(function () {
      if (count === amountContractsInput){
        newIndex = newIndex+1;
        $thisInquiryItem.append('<div class="js-input-box b-input__box b-input__box_contract">'+
          '<input id="agents_'+itemIndex+'_number_'+newIndex+'" name="agents_'+itemIndex+'[number_'+newIndex+']" class="js-required js-input js-input-contract b-input" type="text">'+
          '<label for="agents_'+itemIndex+'_number_'+newIndex+'" class="b-input__label">Номер договора</label>'+
          '<a href="#" class="js-reset-input b-input__reset"></a>'+
          '</div>');
      }
    }, 100);
  });


  /**
   * inputs move or items move
   */
  $(document).on('click', '.js-reset-input', function (e) {
    e.preventDefault();

    var $parent = $(this).closest('.js-input-box');
    var $thisForm = $(this).closest('.js-tab-item');
    var $thisInquiryItem = $(this).closest('.js-inquiry-item');

    if ($parent.hasClass('b-input__box_contract')){

      if ($('.b-input__box_contract .js-reset-input', $thisInquiryItem).length > 1){
        $parent.remove();
      } else {
        $('.js-input', $parent).val('').trigger('change');
      }

    } else if ($parent.hasClass('b-input__box_name')) {
      $thisInquiryItem.remove();
    }

    checkDisabledButtonAgent($thisForm);

  });


  /**
   * focus agent input status
   */
  $('body').on('focus', '.js-input-agents', function () {
    status_send = true;
  });

  /**
   * agent list input
   */
  var sttm;
  $('body').on('keyup', '.js-input-agents', function () {

    if (status_send){
      var $thisInquiryItem = $(this).closest('.js-inquiry-item');
      $thisInquiryItem.removeClass('show-contracts');

      if (sttm) {
        clearTimeout(sttm);
      }

      var val = $(this).val();
      var $thisInputBox = $(this).closest('.js-input-box');
      var $blockListAppend = $('.js-agents-list', $thisInputBox);

      if (val.length > 0){
        sttm = setTimeout(function () {
          submitAgentName(val, $blockListAppend);
        }, 400);
      } else {
        setDefaultAgentsList($blockListAppend, defaultList);
      }
    }
  });

  /**
   * submit agent name to get list of agents
   * @param val
   * @param $blockListAppend
   */
  function submitAgentName(val, $blockListAppend) {
    var actionAgents = $inquiryForm_agnent.attr('data-action-list');

    $.ajax({
      url: actionAgents,
      processData: false,
      contentType: false,
      method: "GET",
      data: val,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessList($blockListAppend, data) : showErrorList()
      },
      error: function () {
        // showErrorList();
        showSuccessList($blockListAppend);
      }
    });
  }

  /**
   * show success list agents
   * @param $blockListAppend
   */
  function showSuccessList($blockListAppend) {
    var data = [
      {
        "title": "Юрьевский Константин Семенович",
        "views": "18"
      },{
        "title": "Константинов Александр Потапович",
        "views": "21"
      }
    ];

    $blockListAppend.html('');
    makeListAgent($blockListAppend, data);
  }

  /**
   * set default list of agents
   * @param $blockListAppend
   * @param list
   */
  function setDefaultAgentsList($blockListAppend, list) {
    makeListAgent($blockListAppend, list);

    // set focus on input when page loaded
    var $thisInputBox = $blockListAppend.closest('.js-input-box');
    $('.js-input-agents', $thisInputBox).focus();
  }
  setDefaultAgentsList($agentsList, defaultList);

  /**
   * dropdown agent list
   * @param $blockListAppend
   * @param list
   */
  function makeListAgent($blockListAppend, list) {
    $blockListAppend.html('');
    if (list){
      $.each(list, function (key, val) {
        var word = declension(val.views, 'осмотр', 'осмотра', 'осмотров');
        $blockListAppend.append('<li>'+
          '<a href="#" data-letter="'+val.views+' '+word+'" class="js-agents-list-link b-agents-list__link">'+val.title+'</a>'+
          '</li>')
      });
      $blockListAppend.removeClass('hidden');
    }
  }

  /**
   * agents item click and set val to input
   */
  $(document).on('click', '.js-agents-list-link', function (e) {
    e.preventDefault();
    status_send = false;
    var thisText = $(this).html();
    var $thisInquiryItem = $(this).closest('.js-inquiry-item');
    var $thisAgentsList = $(this).closest('.js-agents-list');
    var $thisInputBox = $(this).closest('.js-input-box');

    $thisInputBox.addClass('shifted');
    $('.js-input-agents', $thisInputBox).val(thisText).trigger('change');
    $(':focus').blur();

    if (sttm) {
      clearTimeout(sttm);
    }

    setTimeout(function () {
      $thisAgentsList.addClass('hidden');
      if (!$thisInquiryItem.hasClass('show-contracts')){
        $thisInquiryItem.addClass('show-contracts');
      }
      fixButtonBar()
    }, 100);
  });



});