$(function () {

  var $body = $('body');
  var $video = $('.js-video');
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  var $videoCall = $('.js-video-call');
  var $popupOverlay = $('.js-overlay');
  var $popupVideo = $('.js-video-popup');
  var $mapPic = $('.js-map');
  var $mapPopup = $('.js-map-popup');
  var $mapCall = $('.js-map-call');
  var $notificationLink = $('.js-notification');
  var $sliderDocs = $('.js-slider-docs');
  var $sliderPic = $('.js-slider-pic');
  var $docCall = $('.js-doc-call');
  var $docsPopup = $('.js-docs-popup');
  var $photoCall = $('.js-photos-item');
  var $photosTitle = $('.js-photos-title');
  var $photosPopup = $('.js-photos-popup');
  var $sliderPhotos = $('.js-slider-photos');
  var $appendReshootBox = $('.js-append-reshoot-box');
  var $reshootAmount = $('.js-reshoot-amount');
  var $reshootAppend = $('.js-append-reshoot');
  var $urlPhoto = $('.js-url-photo');
  var $rotateLink = $('.js-rotate');
  var $commentCall = $('.js-comment-call');
  var $commentForm = $('.js-comment-form');
  var $commentInput = $('.js-comment-input');
  var $commentDel = $('.js-comment-del');
  var $commentError = $('.js-comment-error');
  var $buttonAgree = $('.js-button-agree');
  var $status = $('.js-status');
  var $buttonResultBox = $('.js-button-result');
  var $buttonAgree_error = $('.js-button-agree-error');
  var $denyTheme = $('.js-deny-theme');
  var $denyNext = $('.js-deny-next');
  var $denyForm = $('.js-deny-form');
  var $productId = $('.js-product-id');
  var $denyForm_error = $('.js-deny-form-error');
  var $denyCall = $('.js-button-deny-call');
  var $denyPopup = $('.js-deny-popup');
  var $expertiseButton = $('.js-expertise');


  $(window).on('resize', function () {
    windowWidth = $(window).width();
    windowHeight = $(window).height();
    setVideoSize();
    mapSize();
    sliderPicSize();
  });

  /**
   * expertise send
   */
  $expertiseButton.on('click', function (e) {
    e.preventDefault();

    $.ajax({
      url: $(this).attr('data-action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: $productId.html(),
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessExpertise() : showErrorResultOk()
      },
      error: function () {
        showErrorResultOk();
      }
    });
  });

  /**
   * success expertise
   */
  function showSuccessExpertise() {
    $expertiseButton.addClass('hidden');
  }

  /**
   * call popup deny
   */
  $denyCall.on('click', function (e) {
    e.preventDefault();

    $body.addClass('overflow');
    $popupOverlay.addClass('show').addClass('b-overlay__grey');
    $denyPopup.addClass('show');
  });

  /**
   * deny form submit
   */
  $denyForm.on('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    $.ajax({
      url: $(this).attr('action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: $(this).serialize(),
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessDeny() : showErrorDeny()
      },
      error: function () {
        showErrorDeny();
      }
    });
  });
  
  function showSuccessDeny() {
    
  }

  /**
   * show error deny
   */
  function showErrorDeny() {
    $denyForm_error.removeClass('hidden');
    setTimeout(function () {
      $denyForm_error.addClass('hidden');
    }, 3000);
  }

  /**
   * show denay next fields after choose theme
   */
  $denyTheme.on('change', function () {

    ($(this).val() != '') ? $denyNext.removeClass('hidden') : $denyNext.addClass('hidden');

    $('textarea', $denyNext).trigger('change');

  });


  /**
   * prove submit
   */
  $buttonAgree.on('click', function (e) {
    e.preventDefault();

    $.ajax({
      url: $(this).attr('data-action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: $productId.html(),
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessResultOk() : showErrorResultOk()
      },
      error: function () {
        // showErrorResultOk();
        showSuccessResultOk();
      }
    });
  });

  /**
   * error result ok
   */
  function showErrorResultOk() {
    $buttonAgree_error.removeClass('hidden');
    setTimeout(function () {
      $buttonAgree_error.addClass('hidden');
    }, 3000);
  }

  /**
   * success result ok
   */
  function showSuccessResultOk() {
    $status.html('Принят');
    $buttonResultBox.addClass('hidden');
    scrollTo($body);
  }

  /**
   * comment submit
   */
  $commentForm.on('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    $.ajax({
      url: $(this).attr('action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: $(this).serialize(),
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessComment() : showErrorComment()
      },
      error: function () {
        // showErrorComment();
        showSuccessComment();
      }
    });
  });

  /**
   * show error
   */
  function showErrorComment() {
    $commentError.removeClass('hidden');
    setTimeout(function () {
      $commentError.addClass('hidden');
    }, 3000)
  }

  /**
   * success comment
   */
  function showSuccessComment() {
    $commentCall.removeClass('active');
    $commentForm.removeClass('open');
  }

  /**
   * delete comment and submit
   */
  $commentDel.on('click', function (e) {
    e.preventDefault();
    $commentInput.val('').trigger('change');
    $commentForm.trigger('submit');
  });

  /**
   * toggle open comment box
   */
  $commentCall.on('click', function (e) {
    e.preventDefault();
    var val = $commentInput.val();

    if (val != ''){
      $(this).addClass('active');
      $commentForm.addClass('open');
    } else {
      $(this).toggleClass('active');
      $commentForm.toggleClass('open');
    }


    if ($commentForm.hasClass('open')){
      $commentInput.val('').val(val).trigger('focus');

      if (val != '')
        $(':focus').blur();
    }
  });

  /**
   * rotate pic
   */
  $rotateLink.on('click', function (e) {
    e.preventDefault();
    var $thisPopup = $(this).closest('.b-popup');
    var $activeSlick = $('.slick-active', $thisPopup);
    var $thisPic = $('.js-slider-pic', $activeSlick);
    var counter = 1;
    var rotateCounter = parseInt($thisPic.attr('data-rotate'));


    if (rotateCounter){
      counter = rotateCounter + 1;
    }

    $thisPic.attr('data-rotate', counter);
    var rotateVal = 90 * counter;
    $thisPic.css('transform', 'translate(-50%, -50%) rotate('+rotateVal+'deg)');
    changeSliderSizeAfterRotate($thisPic, counter, $activeSlick);
  });

  /**
   * photos popup call and open current slide photo
   */
  $photoCall.on('click', function (e) {
    e.preventDefault();

    var thisIndex = parseInt($(this).attr('data-id'));

    $body.addClass('overflow');
    $popupOverlay.addClass('show');
    $photosPopup.addClass('show');

    slickPhotosInit();
    $sliderPhotos.slick('slickGoTo', thisIndex);
  });

  /**
   * docs popup call and show current clicked slide
   */
  $docCall.on('click', function (e) {
    e.preventDefault();

    var thisIndex = parseInt($(this).attr('data-id'));
    var thisIdDocs = $(this).attr('data-popup');

    $body.addClass('overflow');
    $popupOverlay.addClass('show');
    $('#'+thisIdDocs).addClass('show');

    slickDocsInit();
    $sliderDocs.slick('slickGoTo', thisIndex);
  });

  /**
   * slick docs photos
   */
  function slickDocsInit() {
    if (!$sliderDocs.hasClass('slick-slider')){
      $sliderDocs.slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        touchThreshold: 20
      });
    }
  }

  /**
   * slick photos
   */
  function slickPhotosInit() {
    if (!$sliderPhotos.hasClass('slick-slider')){
      $sliderPhotos.slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        touchThreshold: 20
      });


      $sliderPhotos.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        var $nextSlide = $('.b-slider__item', $sliderPhotos).eq(nextSlide);
        var title = $nextSlide.attr('data-title');
        var url = $nextSlide.attr('data-url');
        $photosTitle.html(title);
        $urlPhoto.attr('href', url);

        if ($nextSlide.attr('data-reshoot')){
          var arrImg = $nextSlide.attr('data-reshoot').split(',');
          var length = arrImg.length;
          $reshootAppend.html('');

          $.each(arrImg, function (key, value) {
            $reshootAppend.append('<img src="'+value+'" alt="" class="js-slider-pic b-photos__reshoot-pic">')
          });

          sliderPicSize();
          var word = declension(length, 'раз', 'раза', 'раз');
          $reshootAmount.html('<span>'+length + '</span> ' + word);
          $appendReshootBox.removeClass('hidden');

        } else {
          $appendReshootBox.addClass('hidden');
        }

      });
    }
  }

  /**
   * scroll to notification section
   */
  $notificationLink.on('click', function (e) {
    e.preventDefault();
    var thisId = $(this).attr('data-id');

    if ($('#'+thisId).length){
      scrollTo($('#'+thisId));
    }

  });

  /**
   * map popup call
   */
  $mapCall.on('click', function (e) {
    e.preventDefault();

    $body.addClass('overflow');
    $popupOverlay.addClass('show');
    $mapPopup.addClass('show');
  });

  /**
   * map size
   */
  function mapSize() {
    var mapWidth = windowWidth - 30;
    $mapPic.css('width', mapWidth+'px');
  }
  mapSize();

  /**
   * slider pic size
   */
  function sliderPicSize() {
    var height = windowHeight - 200;
    $('.js-slider-pic').each(function () {
      var thisRotate = parseInt($(this).attr('data-rotate'));

      if (thisRotate){

        if ( thisRotate & 1 ){
          $(this).css({height: 'auto', width: height+'px'});
        } else {
          $(this).css({height: height+'px', width: 'auto'});
        }

      } else {
        $(this).css({height: height+'px', width: 'auto'});
      }

    });

    $('.b-slider__item').css('height', height+'px');
  }
  sliderPicSize();

  /**
   * change img slick size after rotate
   * @param $block
   * @param count
   */
  function changeSliderSizeAfterRotate($block, count, $slickActive) {
    var height = windowHeight - 200;
    if ( count & 1 ){
      $block.css({height: 'auto', width: height+'px'});
    } else {
      $block.css({height: height+'px', width: 'auto'});
    }

    $slickActive.css('height', height+'px');

  }

  /**
   * video open popup
   */
  $videoCall.on('click', function (e) {
    e.preventDefault();

    $body.addClass('overflow');
    $popupOverlay.addClass('show');
    $popupVideo.addClass('show');

    $video.get(0).play();
  });

  /**
   * def settings
   */
  function defSettings() {
    $body.addClass('check-page');
  }
  defSettings();

  /**
   * set size video
   */
  function setVideoSize() {
    if (windowWidth >= windowHeight && windowWidth >= 1200){
      var videoHeight = windowHeight - 160;
      $video.css({height: videoHeight+'px', width: 'auto'});

      var currentVideoWidth = $video.width();
      if (currentVideoWidth >= windowWidth){
        var videoWidth = windowWidth - 160;
        $video.css({width: videoWidth+'px', height: 'auto'});
      }

    } else if (windowWidth < windowHeight && windowWidth >= 1200) {
      var videoWidth = windowWidth - 160;
      $video.css({width: videoWidth+'px', height: 'auto'});
    }
  }
  setVideoSize();

});