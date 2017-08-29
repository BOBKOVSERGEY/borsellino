$(function () {
  $('.slider-new-product').slick({
    nextArrow: '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    prevArrow: '<i class="fa fa-angle-left" aria-hidden="true"></i>',
    infinite: true,
    slidesToShow: 5,
    dots: false,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          nextArrow: '<i class="hidden" aria-hidden="true"></i>',
          prevArrow: '<i class="hidden" aria-hidden="true"></i>',
          slidesToShow: 2
        }
      }
    ]
  });
})


$(document).on('click','.xFortun_spinBut',function(){
  if(!$(this).is('.disabled') && !$(this).is('.notWheel')){
    $(this).addClass('disabled');
    var time = (Math.floor(Math.random() * 100) + 1); // костыль что бы в базу не приходили одновременно запросы с разных страниц

    setTimeout(function(){
      twist_slot();
    }, time);
  } else if ($(this).is('.notWheel')) {
    $(this).addClass('disabled');
    free_twist_slot();
  }
}).on('click','.butG',function(e){
  e.preventDefault();
  buy();
}).on('click','.xFortun_workCon .nameArr',function(){
  $(this).is('.active') ? $(this).removeClass('active').next().slideUp(300) : $(this).addClass('active').next().slideDown(300);
}).on('click', '#fortunaModal a.login', function(e) {
  e.preventDefault();
  $('.arcticmodal-container').click();
  $('#enter_but').click();
}).on('user.auth', function() {
  window.location.reload();
});

/* для авторизованных
function twist_slot(){
  var num = 18, // Число слотов
    numRev = 5,	// Количество прокручиваний на скорости
    speed = 200,
    speed2 = 100,
    but = $('.xFortun_spinBut'),
    slot = $('.xFortun_wheelDiv'),
    slotNow = parseFloat(slot.attr('data-select')),
    slotDeg = 20,
    result_id,
    sumWheel = $('#curWheel'),
    array,
    prize = $('.xFortun_wheelLine'),
    win;

  if (!Number(sumWheel.html())) {
    alerts(dictionary.notWheel);
    but.removeClass('disabled');
    return;
  }

  array = [
    {id1:11, id2: 18, id3: 6, num: 1}, // 0
    {id:2, num: 2}, // 25
    {id:3, num: 3}, // 50
    {id:5, num: 4}, // 100
    {id:8, num: 5}, // 500
    {id:9, num: 6}, // 1 000
    {id:12, num: 7}, // 3 000
    {id:14, num: 8}, // 5 000
    {id:15, num: 9}, // 10 000
    {id:17, num: 10}, // 100 000
    {id:13, num: 11}, // 250 000
    {id:7, num: 12}, // 500 000
    {id:1, num: 13}, // 1 000 000
    {id:10, num: 14}, // Телефон
    {id:16, num: 15}, // Планшет
    {id:4, num: 16} // Ноутбук
  ];

  $.ajax({
    url    : '/fortuna/func',
    type   : "GET",
    dataType: 'json',
    data : {type: 'rotate'},
    success: function (data) {

      if (typeof(data.errors) != 'undefined' && data.errors == 5) {
        alerts(dictionary.notWheel);
        but.removeClass('disabled');
        return;
      } else if (typeof(data.Code) != 'undefined' && Number(data.Code) == 2) {
        alerts(dictionary.MemoryError_8);
        but.removeClass('disabled');
        return;
      } else if (!data || !Number(data.Result) || typeof(data.errors) != 'undefined' &&data.errors == 6) {
        alerts(dictionary.genCouponError);
        but.removeClass('disabled');
        return;
      }


      if (data.Result === 1) {
        result_id = array[0]['id' + (Math.floor(Math.random() * 3) + 1)]; // у нас три слота с 0, выбираем рандомный
      } else {
        result_id = array[data.Result - 1].id;
      }

      if (Number(data.Freebie)) {
        sumWheel.html(Number(sumWheel.html()) - 1);
      } else {
        sumWheel.html((typeof(data.Rotations) != 'undefined' ? data.Rotations : Number(sumWheel.html()) - 1));
      }

      var maxR = (num + 1 - slotNow) + (num * numRev) - (result_id - 1);

      $('.xFortun_wheelLine:nth-child('+ slotNow +')').find('.sector').animate({opacity: 0},100);

      var $n11 = 30,
        $n21 = $n11 * slotDeg,
        $n31 = $n11 * speed,
        $n13 = 30,
        $n23 = $n13 * slotDeg,
        $n33 = $n13 * speed,
        $n12 = maxR - ($n11 + $n13),
        $n22 = $n12 * slotDeg,
        $n32 = $n12 * speed2;

      slot.transition({rotate: '-=3deg'},600,'ease').transition({rotate: '+=3deg'},600,'ease-in')
        .transition({rotate: '+='+ $n21 +'deg'},$n31,'ease-in')
        .transition({rotate: '+='+ $n22 +'deg'},$n32,'linear')
        .transition({rotate: '+='+ $n23 +'deg'},$n33,'ease-out',function(){
          $('.xFortun_wheelLine:nth-child('+ result_id +')').find('.sector')
            .animate({opacity: 0},200)
            .animate({opacity: 1},70)
            .animate({opacity: 0},70)
            .animate({opacity: 0},20)
            .animate({opacity: 1},70)
            .animate({opacity: 0},70)
            .animate({opacity: 0},20)
            .animate({opacity: 1},70)
            .animate({opacity: 0},70)
            .animate({opacity: 0},200)
            .animate({opacity: 1},100,function(){
              slot.attr('data-select', result_id);
              but.removeClass('disabled');

              if (Number(data.Freebie)) {
                $('#fortunaModal_2').arcticmodal();
                sumWheel.html((typeof(data.Rotations) != 'undefined' ? data.Rotations : Number(sumWheel.html()) + 3));
              } else if (Number(data.ExtraBonus)) {
                $('#fortunaModal_3').arcticmodal();
                $('#ExtraBonus').html(data.ExtraBonus);
              } else if (data.Result !== 1) {
                prize = prize.eq(result_id - 1).find('.name').html();
                if (Number(prize)) {
                  win = dictionary.youWin + ' ' + prize + ' ' + dictionary.bonusBalls;
                } else {
                  win = dictionary.youWin + ' ' + prize + ' !';
                }
                alerts(win, dictionary.congratulations);
              }
            });
        });
    }
  });
}
*/


function free_twist_slot(){ // проще сделать отдельно, чем костылить в полной
  var num = 18, // Число слотов
    numRev = 5,	// Количество прокручиваний на скорости
    speed = 200,
    speed2 = 100,
    but = $('.xFortun_spinBut'),
    slot = $('.xFortun_wheelDiv'),
    slotNow = parseFloat(slot.attr('data-select')),
    slotDeg = 20,
    result_id,
    array;

  but.addClass('disabled');

  array = [
    {id1:11, id2: 18, id3: 6, num: 1}, // 0
    {id:2, num: 2}, // 25
    {id:3, num: 3}, // 50
    {id:5, num: 4}, // 100
    {id:8, num: 5}, // 500
    {id:9, num: 6}, // 1 000
    {id:12, num: 7}, // 3 000
    {id:14, num: 8}, // 5 000
    {id:15, num: 9}, // 10 000
    {id:17, num: 10}, // 100 000
    {id:13, num: 11}, // 250 000
    {id:7, num: 12}, // 500 000
    {id:1, num: 13}, // 1 000 000
    {id:10, num: 14}, // Телефон
    {id:16, num: 15}, // Планшет
    {id:4, num: 16} // Ноутбук
  ];

  result_id = array[Math.floor(Math.random() * (array.length - 1)) + 1].id;

  var maxR = (num - 1 + slotNow) - (num * numRev) - (result_id - 1); // + на минус

  //var maxR = (num + 1 - slotNow) + (num * numRev) + (result_id - 1); // оригинал

  $('.xFortun_wheelLine:nth-child('+ slotNow +')').find('.sector').animate({opacity: 0},100);

  var $n11 = 30,
    $n21 = $n11 * slotDeg,
    $n31 = $n11 * speed,
    $n13 = 30,
    $n23 = $n13 * slotDeg,
    $n33 = $n13 * speed,
    $n12 = maxR - ($n11 + $n13),
    $n22 = $n12 * slotDeg,
    $n32 = $n12 * speed2;

  slot.transition({rotate: '-=3deg'},600,'ease').transition({rotate: '+=3deg'},600,'ease-in')
    .transition({rotate: '+='+ $n21 +'deg'},$n31,'ease-in')
    .transition({rotate: '+='+ $n22 +'deg'},$n32,'linear')
    .transition({rotate: '+='+ $n23 +'deg'},$n33,'ease-out',function(){
      $('.xFortun_wheelLine:nth-child('+ result_id +')').find('.sector')
        .animate({opacity: 0},200)
        .animate({opacity: 1},70)
        .animate({opacity: 0},70)
        .animate({opacity: 0},20)
        .animate({opacity: 1},70)
        .animate({opacity: 0},70)
        .animate({opacity: 0},20)
        .animate({opacity: 1},70)
        .animate({opacity: 0},70)
        .animate({opacity: 0},200)
        .animate({opacity: 1},100,function(){
          slot.attr('data-select', result_id);
          but.removeClass('disabled');
          console.log('Колесо остановилось ' + result_id);

        });
    });
}

function buy() {
  var sum = Number($('#sellNum').val()),
    url,
    params,
    dir = Number($('#promoSelect').val()),
    curWheel = $('#curWheel');

  if (!sum || sum < 1) {
    return;
  }

  if (dir) {
    params = {type : 'buy', 'sum': sum * 50, 'idPromo' : 41};
    url = '/promo/func';
  } else {
    params = {type : 'buy', 'sum' : sum};
    url = '/fortuna/func';
  }

  $.ajax({
    url    : url,
    type   : "GET",
    dataType: 'json',
    data   : params,
    success: function (data) {
      if (!dir) {
        if (Number(data) == 4) {
          alerts(dictionary.noMoney);
          return;
        }

        if (Number(data.res) == 2) {
          alerts(dictionary.MemoryError_8);
          return;
        }

        if (Number(data.res)) {
          alerts(dictionary.noMoney);
        } else {
          alerts(dictionary.fortunaBuy);
          sendAnalyticsData('Ставка Успешная', 'Бонусные игры', 'Колесо фортуны');
        }
      } else {
        data = data.result;
        if (Number(data.err) == 2) {
          alerts(dictionary.MemoryError_8);
          return;
        }

        if (data.err == 6 || data.err == 1) {
          alerts(dictionary.noMoney);
          return;
        }
        alerts(dictionary.fortunaBuy);
        sendAnalyticsData('Ставка Успешная', 'Бонусные игры', 'Колесо фортуны');
      }

      curWheel.html(Math.ceil(data.rotation_after));
      refreshBalance();
    }
  });
}