$(function(){
    // re-create the bootstrap collapse... but slide from left
    $(document).on('click', '[data-toggle="slide-collapse"]', function(event) {
        event.preventDefault(event);
        var collapsed = this.classList.contains('collapsed');
        $btn = $(this);
        target = $btn.data('target');
        if (!collapsed) {
            $('[data-toggle="slide-collapse"][data-target="' + target + '"]').addClass('collapsed');
            hide_sidebar();
        } else {
            $('[data-toggle="slide-collapse"][data-target="' + target + '"]').removeClass('collapsed');
            show_sidebar();
        }
    });
    
    // trigger the events to allow module js scripts to attach actions to the events
    function show_sidebar(options) {
        // @note: assumes the css animation takes 300ms
        $('#sidebar').trigger('show.sidebar.collapse');
        setTimeout(function(){
            $('#sidebar').trigger('shown.sidebar.collapse');
        }, 350);
        $('body').removeClass('collapsed').addClass('expanded');
    }
    function hide_sidebar(options) {
        // @note: assumes the css animation takes 300ms
        $('#sidebar').trigger('hide.sidebar.collapse');
        setTimeout(function(){
            $('#sidebar').trigger('hidden.sidebar.collapse');
        }, 350);
        $('body').addClass('collapsed').removeClass('expanded');
    }

    // open sidebar if active page link clicked
    $('#left-nav li a').on('click', function(event){
        event.preventDefault();
        // if the [data-sidebar] attribute has a selector that matches a menu, then show/hide it
        $link = $(this);
        $sidebar_inner = $($link.data('sidebar')); // (.sidebar_inner)

        // alter tab states
        $link.parent().addClass('active').siblings().removeClass('active');

        // hide if not sidebar found
        if ($sidebar_inner.length == 0) {
            hide_sidebar();
        } else {
            if ($('body').hasClass('collapsed')) {
                show_sidebar();
            } else {
                if ($sidebar_inner.hasClass('active')) {
                    // hide sidebar if clicked item already active
                    hide_sidebar();
                } else {
                    // enable correct sidebar inner based on clicked tab
                    $sidebar_inner.addClass('active').siblings().removeClass('active');
                }
            }
        }
    });

    // $(document).on('click', '#left-nav li.active a', function(event){
    //     event.preventDefault();
    //     if($(this).attr('id') !== 'sidebar-toggle') {
    //         $('#sidebar-toggle').click();
    //     }
    // });

    // on trigger sidebar hide/show
    $('#sidebar').on('hide.sidebar.collapse show.sidebar.collapse', function(event){
        // resize after slight delay
        var interval = setInterval(function(){
            if (typeof graph_resize === 'function'){
                graph_resize();
            }
            if (typeof graph_draw === 'function'){
                graph_draw();
            }
        }, 75);
        // stop resizing
        setTimeout(function(){
            clearInterval(interval);
        }, 300);
    });

    // on finish sidebar hide/show
    $('#sidebar').on('hidden.sidebar.collapse shown.sidebar.collapse', function(event){
        // resize once finished animating
        if (typeof graph_resize === 'function'){
            graph_resize();
        }
        if (typeof graph_draw === 'function'){
            graph_draw();
        }
        if (typeof resize === 'function'){
            resize();
        }
    });

    $('#sidebar_user_dropdown').collapse({'toggle':false});
    $(window).click(function(event) {
        //Hide the footer menus if visible
        if(event.target.id !== 'sidebar_user_toggle'){
            var footer_nav = $('#footer_nav').removeClass('expanded');
            var list = $('#sidebar_user_dropdown').collapse('hide');
            var toggle = $('#sidebar_user_toggle').addClass('collapsed');
        }
    });
    // hide sidebar on smaller devices
    window.addEventListener('resize', function(event) {
        if ($(window).width() < 870) {
            hide_sidebar();
            document.body.classList.add('narrow');
        }
        if ($(window).width() >= 870 && $(document.body).hasClass('collapsed')) {
            show_sidebar();
            document.body.classList.remove('narrow');
        }
    })
    
    // hide sidebar on load on narrow devices
    if ($(window).width() < 870) {
        document.body.classList.add('narrow','collapsed');
        $('#sidebar').trigger('hidden.sidebar.collapse');
        hide_sidebar();
        // allow narrow screens to expand sidebar after delay to avoid animation of hiding sidebar
        setTimeout(function(){
            document.body.classList.add('has-animation');
        }, 500);
    }

});

// open / close sidebar based on swipe
// disabled on devices with a mouse
// @todo: test on more devices (emrys,2019-02-14)
if(typeof Hammer !== 'undefined') {
    var sidebarSwipeOptions = typeof hammerOptions !== 'undefined' ? hammerOptions:{};
    var sidebar_switch = document.querySelector('#sidebar-toggle-bar');
    var sidebar = document.querySelector('#sidebar');

    if(sidebar_switch) {
        var mc_switch = new Hammer(sidebar_switch, sidebarSwipeOptions);
        mc_switch.on('swiperight', onSidebarSwipe);
    }
    if(sidebar) {
        var mc_sidebar = new Hammer(sidebar, sidebarSwipeOptions);
        mc_sidebar.on('swipeleft', onSidebarSwipe);
    }
    var onSidebarSwipe = function(event) {
        // console.log('hammer js ' + event.type + ' event');
        document.querySelector('#sidebar-toggle').click()
    }
}
// backward compatible empty function
if(typeof init_sidebar !== 'function') var init_sidebar = function(){}