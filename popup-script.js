chrome.runtime.sendMessage({
    message: 'popupOpened'
})



chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'popupNext'){
        
        const page = req.page
        
        
        
        const content = document.getElementById('content')

        
        if (page < routes.length){
            content.innerHTML = `<rate-properties current-page='${page + 1}' pages='${routes.length}'  title="${routes[page].title}"></rate-properties>`
        }else{
            
            content.innerHTML = `<rating-summary data='${JSON.stringify(data)}' ></rating-summary>`
        }
        
        
    }
    return true;
})

chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'summaryPage'){
        const content = document.getElementById('content')
        const note = document.querySelector('.note')
        if (note){
            note.remove()
        }
        content.innerHTML = `<rating-summary data='${JSON.stringify(req.ratings)}' ></rating-summary>`
    }
    return true;
})

chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'errorPage'){
        const content = document.getElementById('content')
        content.innerHTML = `<h1> There has been an error </h1>`
        const note = document.querySelector('.note')
        if (note){
            note.remove()
        }
    }
    return true;
})

chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'inactivePage'){
        const content = document.getElementById('content')
        content.innerHTML = `<h1> Inactive page </h1>`
        const note = document.querySelector('.note')
        if (note){
            note.remove()
        }
    }
    return true;
})

chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'ratingPage'){
        const content = document.getElementById('content')
        const ratingoption = req.ratingoption
        const page = req.page

        content.innerHTML = `<rate-properties current-page='${page}' pages='4' title="${ratingoption}:"></rate-properties>`
    }
    return true;
})


document.getElementById('close').addEventListener('click', ()=>{
    window.close()
})







