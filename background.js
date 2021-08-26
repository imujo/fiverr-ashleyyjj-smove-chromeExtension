

//#region <------------------ FUNCTIONS ------------------>

const sendWebsiteDataToDatabase = (data) => {
    return fetch(`http://localhost:5000/api/properties`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => {return json.isSuccess})
        .catch(err => {console.log(err); return false });
}


 const addWebsiteToUser = (websiteurl) => {
    return fetch(`http://localhost:5000/api/userproperties`, {
        method: "POST",
        body: JSON.stringify({ websiteurl: websiteurl}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => {return true})
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
        .catch(e=> {console.log(e); return false})

}

const getUserProperty = (websiteUrl) => {
    return fetch(`http://localhost:5000/api/userproperties/one`, {
        method: "POST",
        body: JSON.stringify({
            websiteurl: websiteUrl
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
        .then(response => response.json())
        .then(data=> {return data.data})
        .catch(e=> {console.log(e); return false})

}

const getUserRatingOptions = () => {
    return fetch(`http://localhost:5000/api/user/ratingoptions`)
        .then(response => response.json())
        .then(data=> {return data.data})
        .catch(e=> {console.log(e); return false})

}

 const updateWebsiteData = (data) => {
    return fetch(`http://localhost:5000/api/properties`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => {return true})
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
        .catch(err => {console.log(err); return false});
}


 const getWebsiteDataFromWebsite = (websiteUrl, tabId, callbackFunction) => {
    chrome.tabs.sendMessage(tabId, {
        message: 'getData',
        websiteurl: websiteUrl
    }, res=> callbackFunction(res))
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
            .then(() => console.log('Note added')) 
            .catch(err => {
                console.log(err)
                console.log("Couldn't add the note")
            });
    })
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
        .then(json => {return json})
        .catch(err => {console.log(err); return false });
}

const updateRating = (websiteurl, ratingoption, rating) => {
    return fetch(`http://localhost:5000/api/ratings`, {
        method: "PUT",
        body: JSON.stringify({
            websiteurl: websiteurl,
            ratingoption: ratingoption,
            newrating: rating
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => {return json})
        .catch(err => {console.log(err); return false });
}

const updateDashboardLocation = (websiteurl, dashboardlocation) => {
    return fetch(`http://localhost:5000/api/userproperties/dashboardlocation`, {
        method: "PUT",
        body: JSON.stringify({
            websiteurl: websiteurl,
            dashboardlocation: dashboardlocation
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(json => {return json})
        .catch(err => {console.log(err); return false });
}

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

const addUnratedRatings = (ratingOptions, websiteUrl) => {
    Object.values(ratingOptions).forEach(ratingOption =>{
        console.log(ratingOption)
        addRating(websiteUrl, ratingOption, 'Unrated')
            .then(d => console.log('Unrated rating added'))
            .catch(d => console.log("ERROR - Couldn't add unrated rating"))
    })
}


//#endregion





//#region <------------------ ROUTES ------------------>

const goToRatingPage = (websiteUrl, page) => {

    // IF PAGE < 4
    if( page <= 4){
        console.log("Go to rating page")
        // GET USER DATA
        fetch(`http://localhost:5000/api/user/ratingoptions`)
            .then(response => response.json()) 
            .then(user => {
                console.log(user, 'user')
    
                const ratingOption = user.data[`ratingoption${page}`]
                console.log(ratingOption)
                
                // GET RATINGS
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
                         // IF RATED GO TO NEXT RATING OPTION
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
                    .catch(err => console.log("ERROR - Couldn't get user ratings"));
            
    
            })
            .catch(err => console.log("ERROR - Couldn't get rating options"));

    }else{
        goToSummaryPage(websiteUrl)
    }
}

const goToErrorPage = () => {
    chrome.runtime.sendMessage({
        message: 'errorPage'
    })
}


const goToSummaryPage = (websiteUrl) => {
    console.log("Go to summary page")

    getUserRatings(websiteUrl)
        .then(data=> {
            let ratings = []
            let unratedExists = false

            data.forEach(rating=>{
                if (rating.rating === 'Unrated'){
                    unratedExists = true
                }

                ratings.push({
                    ratingOption: rating.ratingoption,
                    rating: rating.rating
                })
            })

            if (!unratedExists){
                getUserProperty(websiteUrl)
                    .then(userProperty=>{
                        if (userProperty.dashboardlocation === 'unrated'){
                            updateDashboardLocation(websiteUrl, 'top')
                                .catch(e=> console.log("ERROR - Couldn't update dashboard location"))
                        }
                    })
                    .catch(e=> console.log("ERROR - Couldn't get user property"))
            }

            chrome.runtime.sendMessage({
                message: 'summaryPage',
                ratings: ratings
            })

        })
        .catch(()=> {console.log("ERROR - Couldn't get user ratings"); goToErrorPage()})

    
}

const goToInactivePage = () => {
    chrome.runtime.sendMessage({
        message: 'inactivePage'
    })
}

//#endregion





//#region <------------------ LOGIC ------------------>

// ON CHANGE TAB
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    
    
    if (changeInfo.status === 'complete' && /^http/.test(tab.url) && isProductPage(tab.url)){

        
        // INJECTING THE SCRIPTS
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: [`./foreground.js`]
        }, () => console.log('Script injected'))

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
                                    console.log('Website is already in the database')
                                    const dataFromWebsite = res.data
                                    let { dateadded, dateupdated, note, id, ...dataFromDatabase } = data
            
                                    // CHECK IF ANY DATA CHANGED
                                    if (objectValuesEqual(dataFromDatabase, dataFromWebsite)){
                                        console.log('Website data is up to date!')
                                    }else{
                                        // IF YES, UPDATE DATA IN DATABASE
                                        console.log('Website data is not up to date')
                                        updateWebsiteData(dataFromWebsite)
                                            .then(()=> console.log('Website data updated!'))
                                            .catch(()=> {
                                                console.log("ERROR - Couldn't update website data")
                                                goToErrorPage()
                                            })
                                    }

                                    // CHECK IF USER HAS PROPERTY
                                    getUserProperty(websiteUrl)
                                        .then(userProperty=>{

                                            // IF YES:
                                            if (userProperty){
                                                console.log('User was already assigned the property')
                                                
                                                getUserRatings(websiteUrl)
                                                    .then(userRatings =>{
                                                        console.log(userRatings)

                                                        let unratedNumbers = 0

                                                        userRatings.forEach(userRating => {
                                                            if (userRating.rating === 'Unrated'){
                                                                unratedNumbers++
                                                            }
                                                        })

                                                        if (unratedNumbers < 4){
                                                            goToSummaryPage(websiteUrl)
                                                            
                                                        }else{
                                                            goToRatingPage(websiteUrl, 1)
                                                            sendRes('openNote')
                                                        }
                                                    })
                                                
                                            // IF NO:
                                            }else{
                                                console.log("User wasn't already assigned the property")
                                                addWebsiteToUser(websiteUrl)
                                                    .then(()=>{
                                                        getUserRatingOptions()
                                                            .then(ratingOptions => {
                                                                addUnratedRatings(ratingOptions, websiteUrl)
                                                                goToRatingPage(websiteUrl, 1)
                                                                sendRes('openNote')
                                                            })
                                                            .catch(()=> console.log("ERROR - Couldn't get rating options"))
                                                        
                                                    })
                                                    .catch(()=>{
                                                        console.log("ERROR - Couldn't assign property to user")
                                                        goToErrorPage(websiteUrl, 1)
                                                    })
                                            }
                                        })


                                
                                }
                                // IF NO:
                                else{
                                    console.log('Website is not in the database')
                                    // SEND WEBSITE DATA TO DATABASE
                                    sendWebsiteDataToDatabase(res.data)
                                        .then(isSuccess => {
                                            if (isSuccess){
                                                console.log('Property added to database')
                                                // CONNECT USER TO PROPERTY
                                                addWebsiteToUser(websiteUrl)
                                                    .then(()=>{
                                                        console.log('Property assigned to user')
                                                        getUserRatingOptions()
                                                        .then(ratingOptions => {
                                                            addUnratedRatings(ratingOptions, websiteUrl)
                                                            goToRatingPage(websiteUrl, 1)
                                                            sendRes('openNote')
                                                        })
                                                        .catch(()=> console.log("ERROR - Couldn't get rating options"))
                                                        
                                                    })
                                                    .catch(()=>{
                                                        console.log("ERROR - Couldn't assign property to user")
                                                        goToErrorPage(websiteUrl, 1)
                                                    })
                                            }else{
                                                console.log("ERROR - Couldn't add property data to database")
                                                goToErrorPage()
                                            }
                                        })
                                        .catch(()=> {
                                            console.log("ERROR - Couldn't add property data to database")
                                            goToErrorPage()
                                        })
                        
                                }
                            })
                    }else{
                        console.log("ERROR - couldn't get website data")
                        goToErrorPage()
                    }
                })
            }
            else{
                console.log("This isn't a property website")
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


                updateRating(websiteUrl, ratingoption, rating)
                    .then((ret)=>{
                        if (ret.isSuccess){
                            console.log("Rating added");
                            goToRatingPage(websiteUrl, parseInt(currentPage) + 1)
                        }else{
                            console.log("ERROR - Couldn't add the rating")
                        }
                    })
                    .catch(()=>console.log("ERROR - Couldn't add the rating"))

            });
          });

      
        
        
        
    }
    return true;
})

// ON SKIP PAGE
chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'skipPage'){


        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, tabs => {
                const websiteUrl = tabs[0].url
                const currentPage = req.currentPage

                console.log('Skip page')
                addNoteToDatabase(websiteUrl)


                goToRatingPage(websiteUrl, parseInt(currentPage) + 1)

            });
          });

      
        
        
        
    }
    return true;
})

//#endregion

