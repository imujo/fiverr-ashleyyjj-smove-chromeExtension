chrome.runtime.sendMessage({
    message: 'popupOpened'
})


const routes = [
    {
        id: 1,
        title: 'Storage space:',
    },
    {
        id: 2,
        title: 'Bathroom size:',
    },
    {
        id: 3,
        title: 'No. of bedrooms:',
    },
    {
        id: 4,
        title: 'View:',
    },
]

const data = [
    {
        title: 'Storage space:',
        rating: 'Awful'
    },
    {
        title: 'Bathroom size:',
        rating: 'Amazing'
    },
    {
        title: 'No. of bedrooms:',
        rating: 'Good'
    },
    {
        title: 'View:',
        rating: 'Meh'
    }
]

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




document.getElementById('close').addEventListener('click', ()=>{
    window.close()
})




const content = document.getElementById('content')
content.innerHTML = `<rate-properties current-page='1' pages='${routes.length}' title="${routes[0].title}"></rate-properties>`





