
/* ------------------ FUNCTIONS ------------------ */

// GET DATA FROM CURRENT WEBSITE --- currently not used
const getDataFromWebsite = (tabId, website) => {
    chrome.tabs.sendMessage(tabId, {
        message: 'getData',
        website: website
    }, res=>{
        if (res.message === 'success'){
            console.log(res.data)
            return res.data
            // sendWebsiteDataToPopup(res.data)

        }else{
            console.log('ERROR - Getting websiteData')
            return null
        }
    })
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

        // GET INFO ABOUT TAB
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            const tabId = tabs[0].id
            const website = tabs[0].url.split('.')[1]

            if (req.message === 'popupOpened' && isProductPage(tabs[0].url)){

                
                // GET WEBSITE DATA
                chrome.tabs.sendMessage(tabId, {
                    message: 'getData',
                    website: website
                }, res=>{
                    if (res.message === 'success'){
                        console.log(res.data)
            
                    }else{
                        console.log('ERROR - Getting websiteData')
                    }
                })
            }
        });
        return true;
    
})