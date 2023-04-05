document.querySelector('.open-nav').addEventListener('click', () => {
    document.querySelector('.sub-nav-wrapper').classList.add('active')
    setTimeout(() => {
        document.querySelector('.sub-nav').classList.add('active')
    },150)
})

document.querySelector('.close-nav').addEventListener('click', () => {
    document.querySelector('.sub-nav').classList.remove('active')
    setTimeout(() => {
        document.querySelector('.sub-nav-wrapper').classList.remove('active')
    },550)
})

document.querySelector('.show-subnav-programs').addEventListener('click', () => {
    const activeSubnavDropdown = document.querySelector('.subnav-pg-link.active')
    if(activeSubnavDropdown && activeSubnavDropdown !== document.querySelector('.subnav-programs-wrapper')){
        document.querySelector('.subnav-pg-link.active').classList.remove('active')
    }
    if(document.querySelector('.subnav-programs-wrapper.active')){
       document.querySelector('.subnav-programs-wrapper.active').classList.remove('active')
   }else{
       document.querySelector('.subnav-programs-wrapper').classList.add('active')
   }
});

document.querySelector('.show-subnav-resources').addEventListener('click', () => {
    const activeSubnavDropdown = document.querySelector('.subnav-pg-link.active')
    const pageLinksWrapper = document.querySelector('.pg-links')
    if(activeSubnavDropdown && activeSubnavDropdown !== document.querySelector('.subnav-resources-wrapper')){
        document.querySelector('.subnav-pg-link.active').classList.remove('active')
    }
    if(document.querySelector('.subnav-resources-wrapper.active')){
        document.querySelector('.subnav-resources-wrapper.active').classList.remove('active')
    }else{
        document.querySelector('.subnav-resources-wrapper').classList.add('active')
    }
});

const newsletterForm = document.querySelector('footer form')

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let params =[...newsletterForm.querySelectorAll('input')].reduce((params,input) => {
        params += `${encodeURI(input.name)}=${encodeURI(input.value.trim())}&`;
        return params
    },'').slice(0,-1);
    fetch(`https://script.google.com/macros/s/AKfycbweHhV5WJC8ES7LldphS6CI3h8l3qPW_VfQ8pm4iU3riEJ6QBQb/exec?${params}`)
        .then(res => res.json())
        .then(res => {
            if(res.result === 'success'){
                console.log('submitted')
            }else{
                throw new Error(res)
            }
        })
        .catch(e => console.log(e))
});