class ImageLoader {    
    static preload() {
        let preloaders = document.getElementsByClassName('preloader');
        for (let preloader of preloaders) {
            const el = preloader.parentElement;
            const canvas = el.querySelector("canvas");
            const context = canvas.getContext("2d");
            var frameCount = parseInt(el.getAttribute('frames'));
            frameCount = frameCount ? frameCount : 1;

            const img = new Image();
            img.src = ImageLoader.currentFrame(el, 1);
            
            img.onload=function(){
                if (canvas.width==300&&canvas.height==150) {
                    canvas.width=img.width;
                    canvas.height=img.height;
                }
                context.drawImage(img, 0, 0);
            };

            for (let i = 1; i < frameCount; i++) {
                const img = new Image();
                img.src = ImageLoader.currentFrame(el, i);
            };

            canvas.classList.remove('d-none');
            preloader.classList.add('d-none');
        };
    };

    static currentFrame(el, index) {
        return `${el.getAttribute('location')}${index}.${el.getAttribute('format')}`;
    };
};