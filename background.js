
/* ------------------ FUNCTIONS ------------------ */



const sendWebsiteDataToDatabase = (data) => {
    return fetch(`http://localhost:5000/api/properties`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => { console.log(json); return true})
        .catch(err => {console.log(err); return false });
}

const updateWebsiteData = (data) => {
    return fetch(`http://localhost:5000/api/properties`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => { console.log(json); return true})
        .catch(err => {console.log(err); return false });
}


const getWebsiteDataFromDatabase = (websiteUrl) => {
    return fetch(`http://localhost:5000/api/properties/one`, {
        method: "POST",
        body: JSON.stringify({websiteurl: websiteUrl}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
        .then(response => response.json()) 
        .then(json => {return json.data})
        .catch(err => console.log(err));
}

const getWebsiteDataFromWebsite = (websiteUrl, tabId, callbackFunction) => {
    chrome.tabs.sendMessage(tabId, {
        message: 'getData',
        websiteurl: websiteUrl
    }, res=> callbackFunction(res))
}

const goToRatingPage = () => {
    chrome.runtime.sendMessage({
        message: 'ratingPage'
    })
}

const goToErrorPage = () => {
    chrome.runtime.sendMessage({
        message: 'errorPage'
    })
}

const goToSummaryPage = () => {
    chrome.runtime.sendMessage({
        message: 'summaryPage'
    })
}

const goToInactivePage = () => {
    chrome.runtime.sendMessage({
        message: 'inactivePage'
    })
}

const injectForeground = (tabId, callbackFunction) => {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [`./foreground.js`]
    }, callbackFunction())
}


// CHECK IF IS PRODUCT PAGE
const isProductPage = (url) => {
    var isProductPage = false
    const pages = [
        "https://www.rightmove.co.uk/properties/",
        "https://www.zoopla.co.uk/for-sale/details/",
        "https://www.onthemarket.com/details/"
    ]

    pages.forEach(page=>{
        if (url.includes(page)){
            isProductPage=true
        }
    })
    return isProductPage
}

const objectValuesEqual = (object1, object2) => {
    var aValues = Object.values(object1)
    var bValues = Object.values(object2)

    if (aValues.length != bValues.length) {
        return false;
    }

    for (var i = 0; i < aValues.length; i++) {
        var valueName = aValues[i];


        if (!bValues.includes(valueName)) {
            return false;
        }
    }

    return true;
}



/* ------------------ LOGIC ------------------ */


// ON CHANGE TAB
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    
    
    if (changeInfo.status === 'complete' && /^http/.test(tab.url) && isProductPage(tab.url)){

        
        // INJECTING THE SCRIPTS
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [`./foreground.js`]
        })

    }
    return true;
})




// ON CLICK POPUP
chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{

    if (req.message === 'popupOpened'){

        


        // GET INFO ABOUT TAB
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tabId = tabs[0].id
            const websiteUrl = tabs[0].url

            if (isProductPage(websiteUrl)){
            

                // GET WEBSITE DATA
                getWebsiteDataFromWebsite(websiteUrl, tabId, (res)=>{
                    if (res.message = 'success'){

                        // CHECK IF THE PROPERTY IS ALREADY ADDED
                        getWebsiteDataFromDatabase(websiteUrl)
                            .then(data => {
                                // IF YES:
                                if (data){
                                    const dataFromWebsite = res.data
                                    let { dateadded, dateupdated, userid, note, id, ...dataFromDatabase } = data
            
                                    // CHECK IF ANY DATA CHANGED
                                    if (objectValuesEqual(dataFromDatabase, dataFromWebsite)){
                                        console.log('Website data is up to date!')
                                        goToSummaryPage()
                                    }else{
                                        // IF YES, UPDATE DATA IN DATABASE
                                        console.log('Website data updated')
                                        sendWebsiteDataToDatabase(dataFromWebsite)
                                            .then(isSent => {
                                                if (isSent){
                                                    goToSummaryPage()
                                                }else{
                                                    goToErrorPage()
                                                }
                                            })
                                    }
                                
                                }
                                // IF NO:
                                else{
                                    // SEND WEBSITE DATA TO DATABASE
                                    sendWebsiteDataToDatabase(res.data)
                                        .then(isSent => {
                                            if (isSent){
                                                goToRatingPage()
                                            }else{
                                                goToErrorPage()
                                            }
                                        })
                        
                                }
                            })
                    }else{
                        console.log("ERROR - couldn't get website data")
                    }
                })
            }
            else{
                goToInactivePage()
            }
       
            
            
        });

    }


    return true;
    
})



// ON NEXT PAGE
chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'nextPage'){

        console.log(req.data)
        
        // add rating to database
        // fetch(`http://localhost:5000/api/ratings`, {
        //     method: "POST",
        //     body: JSON.stringify(req.data),
        //     headers: {"Content-type": "application/json; charset=UTF-8"}
        //     })
        //     .then(response => response.json()) 
        //     .then(json => console.log(json))
        //     .catch(err => console.log(err));


        // send message to popup - next page
        chrome.runtime.sendMessage({
            message: 'popupNext',
            page: parseInt(req.currentPage)
        })
        
        
    }
    return true;
})