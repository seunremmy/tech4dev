const transformElement = (element, placeholder) => ({
    src: element.src,
    placeholder,
    reference: element
});

const getOffsetTop = (element, top = 0) => element.offsetParent ? getOffsetTop(element.offsetParent, top + element.offsetTop) : top;

const lazy = (elements, loadAt = 100) => {
    const elementsModded = elements.map(element => ({
        ...element,
        offsetTop: getOffsetTop(element.reference),
        changed: false
    }));
    elementsModded.forEach(element => {
        element.reference.src = element.placeholder
    });
    window.addEventListener('scroll', () => {
        elementsModded.filter(el => (window.scrollY + window.innerHeight) >= el.offsetTop - loadAt).forEach((el) => {
            if(!el.changed){
                el.reference.src = el.src;
                el.changed = true
            }
        })
    })
};