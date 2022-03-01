function fastflip(index, el, canvas, context, img) {
    img.src = ImageLoader.currentFrame(el, index);
    context.drawImage(img, 0, 0);
};

function changePhotos() {
    let currentIndex
    return function(el, fraction) {
        'use strict'
        const callback = window[el.getAttribute('animation')];

        if (typeof callback == 'function') {
            const canvas = el.querySelector('canvas');
            const context = canvas.getContext('2d');
            let frameCount = parseInt(el.getAttribute('frames'));
            frameCount = frameCount ? frameCount : 1;
              
            let img = new Image();
            img.onload=function(){
                context.drawImage(img, 0, 0);
            }

            const frameIndex = Math.min(
                frameCount - 1,
                Math.max(1, Math.ceil(fraction * frameCount))
            );

            if (frameIndex != currentIndex) {
                requestAnimationFrame(() => callback(frameIndex + 1, el, canvas, context, img));
                currentIndex = frameIndex;
            };
        };
    };
};

function animateText() {
    let oldFraction, showClasses, hideClasses;
    return function(el, fraction){
        'use strict'
        const by = el.getAttribute('data-splitting');
        const splitting = Splitting({target: el, by: by})[0];
        const elements = splitting[by];
        const frameCount = elements.length;
        const bypass = parseInt(el.getAttribute('data-bypass'));
        const directionDown = oldFraction < fraction;
        const animationLen = (100 - bypass)/2;

        if (!showClasses && !hideClasses) {
            [showClasses, hideClasses] = AnimationDispatcher.getAnimationClasses(el);
        };

        let half, index;
        if (fraction*100 <= animationLen) {
            half = 0;
            index = Math.floor(frameCount * (fraction*100 / animationLen));
        } else if (fraction*100 >= animationLen+bypass) {
            half = 1;
            index = Math.floor(frameCount * (100-fraction*100) / animationLen);
        };

        if (!oldFraction) {
            oldFraction = half;
        };

        if (half == 0) {
            if (directionDown) {
                AnimationDispatcher.animateShow(elements[index], showClasses, hideClasses);
            } else {
                AnimationDispatcher.animateHide(elements[index], showClasses, hideClasses);
            };
        } else if (half == 1) {
            if (directionDown) {
                AnimationDispatcher.animateHide(elements[index], showClasses, hideClasses);
            } else {
                AnimationDispatcher.animateShow(elements[index], showClasses, hideClasses);
            };
        };

        oldFraction = fraction;
    };
};