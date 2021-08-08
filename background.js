
/* ------------------ FUNCTIONS ------------------ */



const sendWebsiteDataToDatabase = (data) => {
    return fetch(`http://localhost:5000/api/properties`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => { console.log(json); return json.isSuccess})
        .catch(err => {console.log(err); return false });
}

const updateWebsiteDatabaseData = (data) => {
    return fetch(`http://localhost:5000/api/properties`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => { console.log(json); return true})
        .catch(err => {console.log(err); return false });
}

const addWebsiteToUser = (websiteurl) => {
    return fetch(`http://localhost:5000/api/userproperties`, {
        method: "POST",
        body: JSON.stringify({ websiteurl: websiteurl}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => { console.log(json); return true})
        .catch(err => {console.log(err); return false });
}


const getUserRatings = (websiteUrl) => {
    return fetch(`http://localhost:5000/api/ratings/all`, {
        method: "POST",
        body: JSON.stringify({
            websiteurl: websiteUrl
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
        .then(response => response.json())
        .then(data=> {return data.data})
        .catch(e=> {console.log('There has been an error getting user ratings'); return false})

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
        .catch(err => {return false});
}

const getWebsiteDataFromWebsite = (websiteUrl, tabId, callbackFunction) => {
    chrome.tabs.sendMessage(tabId, {
        message: 'getData',
        websiteurl: websiteUrl
    }, res=> callbackFunction(res))
}

const goToRatingPage = (websiteUrl, page) => {


    if( page <= 4){
        fetch(`http://localhost:5000/auth/user`)
            .then(response => response.json()) 
            .then(user => {
    
                const ratingOption = user[`ratingoption${page}`]
                console.log(ratingOption)
    
                
    
                fetch(`http://localhost:5000/api/ratings`, {
                    method: "POST",
                    body: JSON.stringify({
                        websiteurl: websiteUrl,
                        ratingoption: ratingOption
                    }),
                    headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                    .then(response => response.json()) 
                    .then(data => {
                         
                        if (data.rating){
                            goToRatingPage(websiteUrl, page + 1)
                        }else{
                            chrome.runtime.sendMessage({
                               message: 'ratingPage',
                               ratingoption: ratingOption,
                               page: page
                           })
                        }
    
    
                    })
                    .catch(err => console.log('There has been an error getting user ratings'));
            
    
            })
            .catch(err => console.log('There has been an error getting user'));

    }else{
        goToSummaryPage(websiteUrl)
    }
}

const goToErrorPage = () => {
    chrome.runtime.sendMessage({
        message: 'errorPage'
    })
}

const addNoteToDatabase = (websiteUrl) => {
    chrome.runtime.sendMessage({
        message: 'getNote'
    }, (note)=>{
        fetch(`http://localhost:5000/api/userproperties/note`, {
            method: "PUT",
            body: JSON.stringify({ note: note, websiteurl: websiteUrl}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
            .then(response => response.json()) 
            .then(json => console.log(json))
            .catch(err => console.log('ERROR - note not added'));
    })
}


const goToSummaryPage = (websiteUrl) => {

    getUserRatings(websiteUrl)
        .then(data=> {
            let ratings = []

            data.forEach(rating=>{
                ratings.push({
                    ratingOption: rating.ratingoption,
                    rating: rating.rating
                })
            })

            chrome.runtime.sendMessage({
                message: 'summaryPage',
                ratings: ratings
            })

        })
        // .catch(()=> {console.log('There has been an error getting ratings'); goToErrorPage()})

    
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

const addRating = (websiteurl, ratingoption, rating) => {
    return fetch(`http://localhost:5000/api/ratings/add`, {
        method: "POST",
        body: JSON.stringify({
            websiteurl: websiteurl,
            ratingoption: ratingoption,
            rating: rating
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => { console.log(json); return json})
        .catch(err => {console.log('There has been an error adding rating'); return false });
}


// CHECK IF IS PRODUCT PAGE
const isProductPage = (url) => {
    var isProductPage = false
    const pages = [
        "https://www.rightmove.co.uk/properties/",
        "https://www.zoopla.co.uk/for-sale/details/",
        "https://www.zoopla.co.uk/new-homes/details/",
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
                                    let { dateadded, dateupdated, note, id, ...dataFromDatabase } = data
            
                                    // CHECK IF ANY DATA CHANGED
                                    if (objectValuesEqual(dataFromDatabase, dataFromWebsite)){
                                        console.log('Website data is up to date!')
                                    }else{
                                        // IF YES, UPDATE DATA IN DATABASE
                                        updateWebsiteData(dataFromWebsite)
                                            .then(()=> console.log('Website data updated!'))
                                            .catch(()=> goToErrorPage())
                                    }

                                    // CHECK IF USER HAS PROPERTY
                                    getUserRatings(websiteUrl)
                                        .then(userRatings=>{

                                            // IF YES:
                                            if (userRatings.length){
                                                // userRatings.forEach((rating, i)=>{
                                                //     if(!rating.rating){// -->> ODE NESTO NE VALJA
                                                //         goToRatingPage(websiteUrl, i)
                                                //     }else{
                                                //         goToSummaryPage(websiteUrl)
                                                //     }
                                                // })
                                                goToSummaryPage(websiteUrl)
                                            // IF NO:
                                            }else{
                                                addWebsiteToUser(websiteUrl)
                                                    .then(()=>goToRatingPage(websiteUrl, 1))
                                                    .catch(()=>goToErrorPage(websiteUrl, 1))
                                            }
                                        })


                                
                                }
                                // IF NO:
                                else{
                                    // SEND WEBSITE DATA TO DATABASE
                                    sendWebsiteDataToDatabase(res.data)
                                        .then(isSuccess => {
                                            if (isSuccess){
                                                // CONNECT USER TO PROPERTY
                                                addWebsiteToUser(websiteUrl)
                                                    .then(()=> goToRatingPage(websiteUrl, 1))
                                                    .catch(()=> goToErrorPage())
                                            }else{
                                                goToErrorPage()
                                            }
                                        })
                                        .catch(()=> goToErrorPage())
                        
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


        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, tabs => {
                const websiteUrl = tabs[0].url

                const currentPage = req.currentPage
                const ratingoption = req.data.ratingoption.replace(':', '')
                const rating = req.data.rating

                addNoteToDatabase(websiteUrl)


                addRating(websiteUrl, ratingoption, rating)
                    .then((ret)=>{
                        ret.isSuccess ?
                            goToRatingPage(websiteUrl, parseInt(currentPage) + 1)
                        :
                            console.log('There has been an error adding rating')
                    })
                    .catch(()=>console.log('There has been an error adding rating'))

            });
          });


        
        // add rating to database
        // fetch(`http://localhost:5000/api/ratings`, {
        //     method: "POST",
        //     body: JSON.stringify(req.data),
        //     headers: {"Content-type": "application/json; charset=UTF-8"}
        //     })
        //     .then(response => response.json()) 
        //     .then(json => console.log(json))
        //     .catch(err => console.log(err));


      
        
        
        
    }
    return true;
})