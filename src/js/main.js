// Application Scripts:

// Десктоп меню (выпадайки)
// Мобильное меню
// Кнопка скролла страницы
// Модальное окно
// Слайдер на главной
// Слайдер логотипов клиентов
// Маска для телефонного номера
// Гармошка на страницах Оплата, Документы
// Автовыравнивание блоков по высоте
// Галерея изображений
// Вкладки на странице
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
        $menu.find('li').has('ul').children('a').addClass('has-menu');

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
        var $menu = $('.js-mm'),
            $btn = $('.js-mm-toggle'),
            BREAKPOINT=992,
            method = {};

        method.showMenu = function () {
            $btn.addClass('active');
            $menu.addClass('active');
            $overlay.show().bind('click', method.hideMenu);
            $html.css('overflow', 'hidden');

        }

        method.hideMenu = function () {
            $btn.removeClass('active');
            $menu.removeClass('active');
            $html.css('overflow', 'auto');
            $overlay.hide().unbind('click', method.hideMenu);
            $menu.find('.m-menu__btn').removeClass('active'); //свернем все подменю
            $menu.find('.m-submenu').hide();
        }

        method.checkSize = function () {
            var winW = verge.viewportW();
            if (winW >= BREAKPOINT) {
                method.hideMenu();
            }
        }

        method.showSubmenu = function (el) {
            el.addClass('active').parent('li').children('ul').slideDown();
        }

        method.hideSubmenu = function (el) {
            el.removeClass('active').parent('li').find('ul').slideUp();
            el.parent('li').find('.m-menu__btn').removeClass('active'); //свернем дочерние субменю
        }

        //добавим кнопки для раскрытия суб-меню
        $menu.find('li').has('ul').addClass('has-menu').append('<button type="button" class="m-menu__btn"><i class="icon-down-open-big"></i></button>')

        $('.b-header__main').on('click', '.js-mm-toggle', function () {//показать / скрыть панель моб.меню
            if ($(this).hasClass('active')) {
                method.hideMenu();
            } else {
                method.showMenu();
            }
        });

        $menu.on('click', '.m-menu__label', function () {//закроем панель по клику на заголовок меню
            method.hideMenu();
        });

        $menu.on('click', '.m-menu__btn', function () {//развернем - свернем подменю
            var $el = $(this);
            if ($el.hasClass('active')) {
                method.hideSubmenu($el);
            } else {
                method.showSubmenu($el);
            }
        });

        $window.on('resize', function () {//если перешли с малого экрана на десктоп и оставили открытое меню - закроем
            setTimeout(method.checkSize, 500);
        });

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
    if ($('.js-slider').length) { initMainSlider() }

    //
    // Слайдер логотипов клиентов
    //---------------------------------------------------------------------------------------
    function initClientSlider() {
        var $slider = $('.js-client-slider'),
            getSliderSettings = function () {//будем показывать разное кол-во слайдов на разных разрешениях
                var setting,
                    settings1 = {
                        maxSlides: 1,
                    },
                    settings2 = {
                        maxSlides: 2,
                    },
                    settings3 = {
                        maxSlides: 3,
                    },
                    settings4 = {
                        maxSlides: 4,
                    },
                    common = {
                        minSlides: 1,
                        moveSlides: 1,
                        slideWidth: 261,
                        slideMargin: 42,
                        pager: false,
                        controls: false,
                        ticker: true,
                        speed: 60000
                    },
                    winW = $window.width();

                if (winW < 600) {
                    setting = $.extend(settings1, common);
                }
                if (winW >= 600 && winW < 900) {
                    setting = $.extend(settings2, common);
                }
                if (winW >= 900 && winW < 1200) {
                    setting = $.extend(settings3, common);
                }
                if (winW >= 1200) {
                    setting = $.extend(settings4, common);
                }
                return setting;
            }
        $slider = $slider.bxSlider(getSliderSettings()); //запускаем слайдер

        $window.on('resize', function () {
            setTimeout(recalcSliderSettings, 500);
        });

        function recalcSliderSettings() {
            $slider.reloadSlider($.extend(getSliderSettings(), { startSlide: $slider.getCurrentSlide() }));
        }

    }
    if ($('.js-client-slider').length) { initClientSlider() }

    //
    // Маска для телефонного номера
    //---------------------------------------------------------------------------------------
    $('.js-phone').mask('+7 (999) 999 99 99');

    //
    // Гармошка на странице Оплата
    //---------------------------------------------------------------------------------------
    function initAccordion() {
        var $list = $('.js-accordion'),
            $btn = $list.find('.b-fold__row'),
            $target = $list.find('.b-fold__inner'),
            method = {};

        method.showInner = function (el) {
            el.addClass('active').nextAll('.b-fold__inner').slideDown();
        }
        method.hideInner = function (el) {
            el.removeClass('active').nextAll('.b-fold__inner').slideUp();
        }

        //раскроем первый блок, свернем остальные
        $target.not(':first').hide();
        $btn.filter(':first').addClass('active');

        //клик по заголовку
        $list.on('click', '.b-fold__row', function () {
            var $el = $(this);
            if ($el.hasClass('active')) {
                method.hideInner($el);
            } else {
                method.showInner($el);
            }
        });
    }
    if ($('.js-accordion').length) { initAccordion() }

    //
    // Автовыравнивание блоков по высоте
    //---------------------------------------------------------------------------------------
    $('.js-autoheight').matchHeight({});

    //
    // Галерея изображений
    //---------------------------------------------------------------------------------------
    $('.js-gallery').lightbox({ blur: false });

    //
    // Вкладки на странице
    //---------------------------------------------------------------------------------------
    function initTabs() {
        //старт - спрячем лишние вкладки, оставим текущую (по умолчанию - первую)
        var $tabs = $('.js-tabs');
        $('.b-tabs__content').hide();
        $tabs.each(function () {
            var $current = $(this).find('a.current');
            if (!$current.length) { $(this).find('a:first').addClass('current'); }
            var target = $(this).find('a.current').attr('href');
            $(target).show();
        });

        //клик по вкладкам
        $tabs.on('click', 'a[href^="#"]', function (e) {
            e.preventDefault();
            var $btn = $(this).parents('ul').find('a');
            var tab_next = $(this).attr('href');
            var tab_current = $btn.filter('.current').attr('href');
            $(tab_current).hide();
            $btn.removeClass('current');
            $(this).addClass('current');
            $(tab_next).fadeIn();
            history.pushState(null, null, window.location.search + $(this).attr('href'));
            return false;
        });

        //Откроем нужную вкладку по ссылке
        var wantedTag = window.location.hash;
        if (wantedTag != "") {
            try {
                var $allTabs = $tabs.find("a[href^=" + wantedTag + "]").parents('ul').find('a');
                var defaultTab = $allTabs.filter('.current').attr('href');
                $(defaultTab).hide();
                $allTabs.removeClass('current');
                $tabs.find("a[href^=" + wantedTag + "]").addClass('current');
                $("#" + wantedTag.replace('#', '')).show();
            } catch (e) {
                // 
            }
        }
    }
    if ($('.js-tabs').length) { initTabs() }

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

    if ($html.hasClass('lt-ie9')) {
        $('.b-feature__item:nth-child(4n+1)').css('margin-left', 0);
        $('.b-catalog__item:nth-child(4n+1)').css('margin-left', 0);
    }
    
});
