// Application Scripts:

// Десктоп меню (выпадайки)
// Мобильное меню
// Кнопка скролла страницы
// Модальное окно
// Если браузер не знает о плейсхолдерах в формах

jQuery(document).ready(function ($) {
    //Кэшируем
    var $window = $(window),
        $html=$('html'),
        $body = $('body');

    $body.append('<div id="overlay" class="overlay"></div>');
    var $overlay = $('#overlay');//оверлей

    //
    // Десктоп меню (выпадайки)
    //---------------------------------------------------------------------------------------
    var initDesktopMenu = (function () {
        var $menu = $('.js-menu');
        $menu.children('li').has('ul').children('a').addClass('has-menu').append('<i class="icon-down-open-mini"></i>');
        $menu.find('li').on({
            mouseenter: function () {
                $(this).find('ul:first').stop(true, true).fadeIn('fast');
                $(this).find('a:first').addClass('hover');
            },
            mouseleave: function () {
                $(this).find('ul').stop(true, true).fadeOut('slow');
                $(this).find('a:first').removeClass('hover');
            }
        })
    })();

    //
    // Мобильное меню
    //---------------------------------------------------------------------------------------
    var initMobileMenu = (function () {
        //...
    })();

    

    //
    // Кнопка скролла страницы
    //---------------------------------------------------------------------------------------
    var initPageScroller = (function () {
        var $scroller = $('<div class="scroll-up-btn"><i class="icon-up-open-big"></i></div>');
        $body.append($scroller);
        $window.on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $scroller.show();
            } else {
                $scroller.hide();
            }
        });
        $scroller.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false;
        });
    }());


    //
    // Модальное окно
    //---------------------------------------------------------------------------------------
    var showModal = (function (link) {
        var
        method = {},
        $modal,
        $close;

        $close = $('<a class="modal__close" href="#"><i class="icon-cancel"></i></a>'); //иконка закрыть


        $close.on('click', function (e) {
            e.preventDefault();
            method.close();
        });

        // центрируем окно
        method.center = function () {
            var top, left;

            top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
            left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;

            $modal.css({
                top: top + $window.scrollTop(),
                left: left + $window.scrollLeft()
            });
        };


        // открываем
        method.open = function (link) {
            $modal = $(link);
            $modal.append($close);
            method.center();
            $window.bind('resize.modal', method.center);
            $modal.show();
            $overlay.show().bind('click', method.close);
        };

        // закрываем
        method.close = function () {
            $modal.hide();
            $overlay.hide().unbind('click', method.close);
            $window.unbind('resize.modal');
        };

        return method;
    }());

    // клик по кнопке с атрибутом data-modal - открываем модальное окно
    $('[data-modal]').on('click', function (e) {//передаем айди модального окна
        e.preventDefault();
        var link = $(this).data('modal');
        if (link) { showModal.open(link); }
    });

    //
    // Слайдер на главной
    //---------------------------------------------------------------------------------------
    function initMainSlider() {
        var $slider = $('.js-slider');
        $slider.bxSlider({
            auto: true,
            pager: false,
            mode: 'fade',
            pause: 8000,
            autoHover: true,
            nextSelector: '.b-slider__arrow--next',
            prevSelector: '.b-slider__arrow--prev',
            nextText: 'Вперед',
            prevText: 'Назад'
        });
    }
    if($('.js-slider').length){initMainSlider()}

    //
    // Если браузер не знает о плейсхолдерах в формах
    //---------------------------------------------------------------------------------------
    if (!("placeholder" in document.createElement("input"))) {
        $("input[placeholder], textarea[placeholder]").each(function () {
            var val = $(this).attr("placeholder");
            if (this.value == "") {
                this.value = val;
            }
            $(this).focus(function () {
                if (this.value == val) {
                    this.value = "";
                }
            }).blur(function () {
                if ($.trim(this.value) == "") {
                    this.value = val;
                }
            })
        });

        $('form').submit(function () {
            $(this).find("input[placeholder], textarea[placeholder]").each(function () {
                if (this.value == $(this).attr("placeholder")) {
                    this.value = "";
                }
            });
        });
    }
    
});
