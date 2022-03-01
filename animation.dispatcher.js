class AnimationDispatcher {
    
    static getScrollFraction(el) {
        const holder = el.parentElement;
        const bounds = holder.getBoundingClientRect();
        const scrollTop = -bounds.top;
        const maxScrollTop = bounds.height - window.innerHeight/2;
        return scrollTop / maxScrollTop;
    };

    static onVisibilityChange(
        el, 
        callback, 
        showClasses=null, 
        hideClasses=null) {
        let old_visible;
        return function () {
            let fraction = AnimationDispatcher.getScrollFraction(el);
            let visible = (fraction > 0 && fraction < 1);
            if (visible) {
                if (typeof callback == 'function') {
                    callback(el, fraction);
                };
            };
            if (visible != old_visible) {
                old_visible = visible;
                if (visible) {
                    AnimationDispatcher.animateShow(el, showClasses, hideClasses);
                } else {
                    AnimationDispatcher.animateHide(el, showClasses, hideClasses);
                };
            };
        };
    };

    static getAnimationClasses(el) {
        return [el.getAttribute('data-show-classes') ? el.getAttribute('data-show-classes').split(' ') : null,
                el.getAttribute('data-hide-classes') ? el.getAttribute('data-hide-classes').split(' ') : null]
    };

    static animateShow(el, showClasses, hideClasses) {
        if (hideClasses) {el.classList.remove('d-none', 'invisible', ...hideClasses)};
        if (showClasses) {el.classList.add(...showClasses)};
    };

    static animateHide(el, showClasses, hideClasses) {
        if (showClasses) {el.classList.remove(...showClasses)};
        if (hideClasses) {el.classList.add(...hideClasses)};
    };

    static adjustHeight(el) {
        const parent = el.parentElement;
        const blanket = parent.querySelector('.blanket');
        let height;
        if (el.getAttribute('data-height')) {
            height = parseInt(el.getAttribute('data-height'));
        } else if (el.getAttribute('fps') && el.getAttribute('frames')) {
            height = parseInt(el.getAttribute('fps')) * parseInt(el.getAttribute('frames'));
        };
        blanket.style.height = height + 'vh';
    };

    static moveToCenter(el) {
        el.style.top = Math.ceil((window.innerHeight-el.getBoundingClientRect().height)/2)+'px';
    }

    static init(el) {
        AnimationDispatcher.moveToCenter(el);

        AnimationDispatcher.adjustHeight(el);
        
        /* attach animation handles to each element */
        const [showClasses, hideClasses] = AnimationDispatcher.getAnimationClasses(el);
        const wrapper = window[el.getAttribute('callback')];
        const callback = wrapper ? wrapper() : undefined;
        const handler = AnimationDispatcher.onVisibilityChange(
            el,
            callback,
            showClasses,
            hideClasses
        );
        if (window.addEventListener) {
            addEventListener('scroll', handler, false);
            addEventListener('resize', ()=>{
                AnimationDispatcher.adjustHeight(el);
            }, false);
        } else if (window.attachEvent)  {
            attachEvent('onscroll', handler);
            attachEvent('onresize', ()=>{
                AnimationDispatcher.adjustHeight(el);
            });
        };
    };

    constructor(){
        let elements = document.querySelectorAll('[data-scroll]');
        for (let el of elements) {
            if (window.addEventListener) {
                addEventListener('load', ()=>{
                    AnimationDispatcher.init(el);
                }, false);
            } else if (window.attachEvent)  {
                attachEvent('onload', ()=>{
                    AnimationDispatcher.init(el);
                });
            };
        };
    }
};