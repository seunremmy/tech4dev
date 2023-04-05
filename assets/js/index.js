document.querySelectorAll('.testimonial').forEach(e => {
    e.addEventListener('click',(event) => {
        if(!event.path[0].classList.contains('close-testimonial')){
            console.log(event.path[0].classList)
            e.classList.add('active');
            console.log(event.path[0])

        }
    })
});

document.querySelectorAll('.close-testimonial').forEach(e => {
    e.addEventListener('click', () => {
        document.querySelector('.testimonial.active').classList.remove('active');
    })
});

window.addEventListener('keydown', e => {
    if(e.key === 'Escape' || e.key === 'Esc'){
        if(document.querySelector('.testimonial.active')){
            document.querySelector('.testimonial.active').classList.remove('active');
        }
    }
});




//Partners infinite scroll
const infiniteScroll = async (parentClass) => {
    // Select all the images
    const images = document.querySelectorAll('.partners img');
    //Wait for all images to load before I do anything
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if([...images].findIndex(e => (e.complete === false)) === -1){
                clearInterval(interval);
                resolve(true)
            }
        },5)
    });
    //Select the initial div
    const scrollElement = document.querySelector(`.${parentClass}`);
    //Select it's parent
    const parent = scrollElement.parentNode;
    //Cloning the div
    const cloned = scrollElement.cloneNode(true);
    //Absolute positioning
    cloned.style.position = 'absolute';
    scrollElement.style.position = 'absolute';
    const positionOfDivEnd = scrollElement.offsetWidth;
    //Moved the cloned div to the of the normal div
    scrollElement.style.left = '0px';
    cloned.style.left = `${positionOfDivEnd}px`;
    //Append cloned element to parent div
    parent.append(cloned);
    //Set initial current and next images
    let current = scrollElement,next = cloned;
    parent.addEventListener('scroll', () => {
        //Calculate the position of the parent's scroll relative to the currently showing div
        const position = (parent.scrollLeft - next.offsetLeft)/parent.scrollWidth;
        if(position <= 0.2 && position > 0){
            //Calculate where the end of the showing one is
            const left = parseInt(next.style.left.split('px')[0]) + positionOfDivEnd;
            //Move the current one there
            current.style.left = `${left}px`;
            //Switch current and next
            let temp = current;
            current = next;
            next = temp;
        }
    });
};

const findCurrentIndex = (arrayName) => arrayName.findIndex((e) => {
    const parentLeftStr = e.parentElement.style.left || '0px';
    const parentLeft = parseInt(parentLeftStr.split('px')[0]);
    return (e.offsetLeft + parentLeft >= document.querySelector('.partners-wrapper').scrollLeft)
});

const findNext = () => {
    const sortedPartners = [...document.querySelectorAll('.partners')].sort((a,b) => {
        if(parseInt(a.style.left.split('px')[0]) < parseInt(b.style.left.split('px')[0])){
            return -1
        }else if(parseInt(a.style.left.split('px')[0]) > parseInt(b.style.left.split('px')[0])){
            return 1
        }else{
            return 0
        }
    });

    if(document.querySelector('.partners.current')){
        document.querySelector('.partners.current').classList.remove('current')
    }

    const activePartners = [...sortedPartners[0].querySelectorAll('.partner')];
    let currentIndex = findCurrentIndex(activePartners);

    let next = undefined;

    if(currentIndex === -1 || currentIndex === (activePartners.length - 1)){
        currentIndex = findCurrentIndex([...sortedPartners[1].children]);
        next = sortedPartners[1].children[currentIndex + 1]
    }else{
        next = sortedPartners[0].children[currentIndex + 1]
    }

    const parentLeftStr = next.parentElement.style.left || '0px';
    const parentLeft = parseInt(parentLeftStr.split('px')[0]);

    return next.offsetLeft + parentLeft
};

const findPrev = () => {
    const sortedPartners = [...document.querySelectorAll('.partners')].sort((a,b) => {
        if(parseInt(a.style.left.split('px')[0]) < parseInt(b.style.left.split('px')[0])){
            return -1
        }else if(parseInt(a.style.left.split('px')[0]) > parseInt(b.style.left.split('px')[0])){
            return 1
        }else{
            return 0
        }
    });

    if(document.querySelector('.partners.current')){
        document.querySelector('.partners.current').classList.remove('current')
    }

    sortedPartners[0].classList.add('current');

    let currentIndex = findCurrentIndex([...document.querySelectorAll('.current .partner')]);


    let prev = undefined;

    if(currentIndex === -1){
        currentIndex = findCurrentIndex([...sortedPartners[1].children]);
        prev = sortedPartners[1].children[currentIndex - 1] || sortedPartners.pop()
    }else{
        prev = sortedPartners[0].children[currentIndex - 1] || null
    }

    if(prev){
        const parentLeftStr = prev.parentElement.style.left || '0px';
        const parentLeft = parseInt(parentLeftStr.split('px')[0]);
        return prev.offsetLeft + parentLeft;
    }

    return null;
};

let scrollInterval = null;

window.addEventListener('DOMContentLoaded',async () => {
    infiniteScroll('partners');
    scrollInterval = setInterval(() => {
        document.querySelector('.partners-wrapper').scrollTo(findNext(),0)
    },3000);
});

[...document.querySelectorAll('.partners__scroll-btn')].forEach(e => {
    e.addEventListener('click', () => {
        if(e.classList.contains('left')){
            if(findPrev() !== null){
                document.querySelector('.partners-wrapper').scrollTo(findPrev(),0);
            }
        }else if(e.classList.contains('right')){
            document.querySelector('.partners-wrapper').scrollTo(findNext(),0);
        }
        clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
            document.querySelector('.partners-wrapper').scrollTo(findNext(),0)
        },3000);
    })
});

window.addEventListener('DOMContentLoaded', () => {
    const clickListener = (buttonInstance,className, parentClassName) => {
        const items = [...document.querySelectorAll(`.${className}`)];
        const wrapper = document.querySelector(`.${parentClassName}`);
        const currentIndex = items.findIndex(e => wrapper.scrollLeft <= e.offsetLeft);
        if(buttonInstance.classList.contains('left')) {
            const targetScroll = items[currentIndex - 1].offsetLeft;
            wrapper.scrollTo(targetScroll, 0)
        }else{
            const targetScroll = items[currentIndex + 1].offsetLeft;
            wrapper.scrollTo(targetScroll, 0);
        }
    };

    const scrollWatcher = (className, parentClassName) => {
        const wrapper = document.querySelector(`.${parentClassName}`);
        if(wrapper.scrollLeft > 0){
            document.querySelector(`.${className}.left`).classList.add('active');
        }else{
            document.querySelector(`.${className}.left`).classList.remove('active');
        }
        if(Math.floor(wrapper.scrollWidth) === Math.floor(wrapper.scrollLeft) + Math.floor(wrapper.offsetWidth)){
            document.querySelector(`.${className}.right`).classList.remove('active');
        }else{
            document.querySelector(`.${className}.right`).classList.add('active');
        }
    };

    document.querySelectorAll('.program-scroll-btn').forEach(e => {
        e.addEventListener('click', () => clickListener(e,'program','programs-wrapper'))
    });

    document.querySelector('.programs-wrapper').addEventListener('scroll', () => scrollWatcher('program-scroll-btn','programs-wrapper'));

    document.querySelectorAll('.testimonial-scroll-btn').forEach(e => {
        e.addEventListener('click', () => clickListener(e,'testimonial','testimonials-wrapper'))
    });

    document.querySelector('.testimonials-wrapper').addEventListener('scroll', () => scrollWatcher('testimonial-scroll-btn','testimonials-wrapper'));

    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if(window.scrollY > window.innerHeight){
            backToTop.classList.add('active');
            backToTop.disabled = false
        }else{
            backToTop.classList.remove('active');
            backToTop.disabled = true
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    });

    let activeCarousel = 1;
    let togglePicture = setInterval(() => {
        document.querySelector('.carousel__change-btn.right').click()
    },3000);

    const carouselImages = [
        {
            src: './assets/images/home/sliderimage/slider-15b.jpg',
            loaded: false
        },
        {
            src: './assets/images/home/sliderimage/slider-13b.jpg',
            loaded: false
        },
        {
            src: './assets/images/home/sliderimage/slider-16b.jpg',
            loaded: false
        },
        {
            src: './assets/images/home/sliderimage/index-3b.png',
            loaded: false
        },
        {
            src: './assets/images/home/sliderimage/index-2b.png',
            loaded: false
        },
        // {
        //     src: './assets/images/home/sliderimage/slider-9b.jpg',
        //     loaded: false
        // },
        // {
        //     src: './assets/images/home/sliderimage/slider-10b.jpg',
        //     loaded: false
        // },
    ];


    carouselImages.forEach((e,i) => {
        document.querySelector(`.carousel-img:nth-of-type(${i + 2})`).addEventListener('load', () => {
            carouselImages[i].loaded = true
        });
        document.querySelector(`.carousel-img:nth-of-type(${i + 2})`).src = carouselImages[i].src;
    });

    [...document.querySelectorAll('.carousel__change-btn')].forEach(e => {
        e.addEventListener('click', () => {
            if(!carouselImages.find(({loaded}) => loaded === false)){
                if(e.classList.contains('left')){
                    activeCarousel = activeCarousel - 1 || 6;
                }else if(e.classList.contains('right')){
                    activeCarousel = activeCarousel < 6 ? activeCarousel + 1 : 1
                }
            }
            clearInterval(togglePicture);
            togglePicture = setInterval(() => {
                document.querySelector('.carousel__change-btn.right').click()
            },3000);
            document.querySelector('.carousel-img.active').classList.remove('active');
            document.querySelector(`.carousel-img:nth-of-type(${activeCarousel})`).classList.add('active');
        })
    });

    const iframeLinks = ['https://www.youtube.com/embed/snJClianGwA','https://www.youtube.com/embed/4LASYETL58M','https://www.youtube.com/embed/qcZKRUH2KAc'];
    const iframes = [...document.querySelectorAll('.video iframe')];
    [...document.querySelectorAll('.iframe-placeholder')].forEach((e,i) => {
       e.addEventListener('click', () => {
           const iframe = iframes[i];
           iframe.addEventListener('load', () => {
               e.classList.add('iframe-placeholder--hide');
           });
           iframe.src = iframeLinks[i]
       })
    });
});

const programImages = [...document.querySelectorAll('.program img')].map((el) => transformElement(el, './assets/images/placeholder.jpg'));
const testimonialImages = [...document.querySelectorAll('.testimonial__image')].map((el) => transformElement(el, './assets/images/female-avatar.png'));

const images = [
    ...programImages,
    transformElement(document.querySelector('.job-details__image'), ''),
    transformElement(document.querySelector('.concept_details__image img'), './assets/images/placeholder.jpg'),
    ...testimonialImages
];

const counterFunction = () =>{
    const counters = document.querySelectorAll('.stat-header')
    const finalCount = ["41,079","10M+", "36","1000+" , "15"]
    const speed = 200;
    counters.forEach((counter)=>{
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed

            if(count < target){
               counter.innerText = count + inc;
               setTimeout(updateCounter, 10)
            }else{
                if(target == 41079){
                    counter.innerText = finalCount[0]
                }
                if(target == 10000000){
                    counter.innerText = finalCount[1]
                }
                if(target == 36){
                    counter.innerText = finalCount[2]
                }
                if(target == 1000){
                    counter.innerText = finalCount[3]
                }
                if(target == 15){
                    counter.innerText = finalCount[4]
                }
            }
        }

    updateCounter()
    })
}
const observer = new IntersectionObserver(function(entries) {
    console.log("i am visible")
	if(entries[0].isIntersecting === true){
        counterFunction();
    }
}, { threshold: [0] });

observer.observe(document.querySelector(".difference-stats"));



lazy(images);



