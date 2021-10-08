
//#region <------------------ FUNCTIONS ------------------>

const sendWebsiteDataToDatabase = (data, jwtToken) => {
    return fetch(`https://server.mysmove.com/api/properties`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
        })
        .then(response => response.json()) 
        .then(json => {return json.isSuccess})
        .catch(err => {console.log(err); return false });
}


 const addWebsiteToUser = (websiteurl, jwtToken) => {
     console.log(addMinutes(new Date(), 3), 'adding to server')
    return fetch(`https://server.mysmove.com/api/userproperties`, {
        method: "POST",
        body: JSON.stringify({
            websiteurl: websiteurl,
            rating_end_time: addMinutes(new Date(), 3)
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
        })
        .then(response => response.json()) 
        .then(json => {return true})
        .catch(err => {console.log(err); return false });
}


 const getUserRatings = (websiteUrl, jwtToken) => {
    return fetch(`https://server.mysmove.com/api/ratings/all`, {
        method: "POST",
        body: JSON.stringify({
            websiteurl: websiteUrl
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
    })
        .then(response => response.json())
        .then(data=> {console.log(data); return data.data})
        .catch(e=> {console.log(e); return false})

}

const getUserProperty = (websiteUrl, jwtToken) => {
    return fetch(`https://server.mysmove.com/api/userproperties/one`, {
        method: "POST",
        body: JSON.stringify({
            websiteurl: websiteUrl
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
    })
        .then(response => response.json())
        .then(data=> {return data.data})
        .catch(e=> {console.log(e); return false})

}

const getUserRatingOptions = (jwtToken) => {
    return fetch(`https://server.mysmove.com/api/user/ratingoptions`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
    })
        .then(response => response.json())
        .then(data=> {return data.data})
        .catch(e=> {console.log(e); return false})

}

 const updateWebsiteData = (data, jwtToken) => {
    return fetch(`https://server.mysmove.com/api/properties`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
        })
        .then(response => response.json()) 
        .then(json => {return true})
        .catch(err => {console.log(err); return false });
}


 const getWebsiteDataFromDatabase = (websiteUrl, jwtToken) => {
    return fetch(`https://server.mysmove.com/api/properties/one`, {
        method: "POST",
        body: JSON.stringify({websiteurl: websiteUrl}),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
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


 const addNoteToDatabase = (websiteUrl, jwtToken) => {
    chrome.runtime.sendMessage({
        message: 'getNote'
    }, (note)=>{

        fetch(`https://server.mysmove.com/api/userproperties/note`, {
            method: "PUT",
            body: JSON.stringify({ note: note, websiteurl: websiteUrl}),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": jwtToken
            }
        })
            .then(response => response.json()) 
            .then(() => console.log('Note added')) 
            .catch(err => {
                console.log(err)
                console.log("Couldn't add the note")
            });
    })
}


 const addRating = (websiteurl, ratingoption, rating, jwtToken) => {
    return fetch(`https://server.mysmove.com/api/ratings/add`, {
        method: "POST",
        body: JSON.stringify({
            websiteurl: websiteurl,
            ratingoption: ratingoption,
            rating: rating
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
        })
        .then(response => response.json()) 
        .then(json => {return json})
        .catch(err => {console.log(err); return false });
}

const updateRating = (websiteurl, ratingoption, rating, jwtToken) => {
    return fetch(`https://server.mysmove.com/api/ratings`, {
        method: "PUT",
        body: JSON.stringify({
            websiteurl: websiteurl,
            ratingoption: ratingoption,
            newrating: rating
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
        })
        .then(response => response.json()) 
        .then(json => {return json})
        .catch(err => {console.log(err); return false });
}

const updateDashboardLocation = (websiteurl, dashboardlocation, jwtToken) => {
    return fetch(`https://server.mysmove.com/api/userproperties/dashboardlocation`, {
        method: "PUT",
        body: JSON.stringify({
            websiteurl: websiteurl,
            dashboardlocation: dashboardlocation
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": jwtToken
        }
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

const addUnratedRatings = (ratingOptions, websiteUrl, jwtToken) => {
    Object.values(ratingOptions).forEach(ratingOption =>{
        console.log(ratingOption)
        addRating(websiteUrl, ratingOption, 'Unrated', jwtToken)
            .then(d => console.log('Unrated rating added'))
            .catch(d => console.log("ERROR - Couldn't add unrated rating"))
    })
}

const logIn = (email, password) => {
    return fetch(`https://server.mysmove.com/auth/login`, {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
        })
        .then(response => response.json()) 
        .then(json => {return json})
        .catch(err => {console.log(err); return false });
}

const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes*60000);
}

const has3MinsPassed = (rating_end_time) => {
    return new Date().getTime() > new Date(rating_end_time).getTime() ? true : false;
}


//#endregion





//#region <------------------ ROUTES ------------------>

const goToRatingPage = (websiteUrl, page, jwtToken) => {

    // IF PAGE < 4
    if( page <= 4){
        console.log("Go to rating page")
        // GET USER DATA

        fetch(`https://server.mysmove.com/api/user/ratingoptions`, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": jwtToken
            }
        })
            .then(response => response.json()) 
            .then(user => {
    
                const ratingOption = user.data[`ratingoption${page}`]
                
                // GET RATINGS
                fetch(`https://server.mysmove.com/api/ratings`, {
                    method: "POST",
                    body: JSON.stringify({
                        websiteurl: websiteUrl,
                        ratingoption: ratingOption
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "Authorization": jwtToken
                    }
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
        goToSummaryPage(websiteUrl, jwtToken)
    }
}

const goToErrorPage = () => {
    chrome.runtime.sendMessage({
        message: 'errorPage'
    })
}


const goToSummaryPage = (websiteUrl, jwtToken) => {
    console.log("Go to summary page")

    getUserRatings(websiteUrl, jwtToken)
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
                getUserProperty(websiteUrl, jwtToken)
                    .then(userProperty=>{
                        if (userProperty.dashboardlocation === 'unrated'){
                            console.log('change dashboard locaton')
                            updateDashboardLocation(websiteUrl, 'top', jwtToken)
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
    console.log("This isn't a property website")
    chrome.runtime.sendMessage({
        message: 'inactivePage'
    })
}

const goToLoginPage = () => {
    console.log("Login page")
    chrome.runtime.sendMessage({
        message: 'loginPage'
    })
}

//#endregion





//#region <------------------ LOGIC ------------------>




// ON LOGIN
chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'login'){
        const { email, password } = req.data

        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, tabs => {
                
                const websiteUrl = tabs[0].url
    
                // Get jwtToken
                chrome.storage.local.get('jwtToken', storage => {
                    const jwtToken = storage.jwtToken
                    
                    // log in
                    logIn(email, password)
                        .then(data => {
    
                            // if succesfull
                            if (data.isSuccess){
                                console.log('Logged in')
            
                                // set local storage
                                chrome.storage.local.set({isAuth: true}, ()=> console.log('Auth status set!'))
                                chrome.storage.local.set({jwtToken: data.token}, ()=> console.log('Jwt token set!'))
            
                                // if product page 
                                if (isProductPage(websiteUrl)){
                                    goToRatingPage(websiteUrl, 1, jwtToken)
                                }else{
                                    
                                    goToInactivePage()
                                }
    
                            }else{
                                console.log("ERROR - Couldn't log in user")
                                chrome.runtime.sendMessage({
                                    message: 'loginError',
                                    errorMsg: data.msg         
                                })
                            }
                        })
                        .catch(e => console.log("ERROR - Couldn't log in user"))
                })
    
    
                
            })
        })
        
        
    }
    return true;
})



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
        chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, tabs => {
                const tabId = tabs[0].id
                const websiteUrl = tabs[0].url
    
                chrome.storage.local.get(['isAuth', 'jwtToken'], (data)=>{
                    const jwtToken = data.jwtToken
    
                    if (data.isAuth){
                        console.log('Authenticated')
                        
                        if (isProductPage(websiteUrl)){
    
                
    
                            // GET WEBSITE DATA
                            getWebsiteDataFromWebsite(websiteUrl, tabId, (res)=>{
                                if (res.message = 'success'){
            
                                    // CHECK IF THE PROPERTY IS ALREADY ADDED
                                    getWebsiteDataFromDatabase(websiteUrl, jwtToken)
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
                                                    updateWebsiteData(dataFromWebsite, jwtToken)
                                                        .then(()=> console.log('Website data updated!'))
                                                        .catch(()=> {
                                                            console.log("ERROR - Couldn't update website data")
                                                            goToErrorPage()
                                                        })
                                                }
            
                                                // CHECK IF USER HAS PROPERTY
                                                getUserProperty(websiteUrl, jwtToken)
                                                    .then(userProperty=>{
                                                        console.log(userProperty)
            
                                                        // IF YES:
                                                        if (userProperty){
                                                            console.log('User was already assigned the property')
                                                            
                                                            getUserRatings(websiteUrl, jwtToken)
                                                                .then(userRatings =>{

                                                                
                                                                    let unratedNumbers = []
            
                                                                    userRatings.forEach(userRating => {
                                                                        if (userRating.rating === 'Unrated'){
                                                                            unratedNumbers.push(1)
                                                                        }else { unratedNumbers.push(0) }
                                                                    })


                                                                    if (unratedNumbers.includes(0) && has3MinsPassed(userProperty.rating_end_time)){
                                                                        goToSummaryPage(websiteUrl, jwtToken)
                                                                        
                                                                    }else{
                                                                        goToRatingPage(websiteUrl, unratedNumbers.indexOf(1) + 1, jwtToken)
                                                                        sendRes('openNote')
                                                                    }
                                                                })

                                                            
                                                        // IF NO:
                                                        }else{
                                                            console.log("User wasn't already assigned the property")
                                                            addWebsiteToUser(websiteUrl, jwtToken)
                                                                .then(()=>{
                                                                    getUserRatingOptions(jwtToken)
                                                                        .then(ratingOptions => {
                                                                            addUnratedRatings(ratingOptions, websiteUrl, jwtToken)
                                                                            goToRatingPage(websiteUrl, 1, jwtToken)
                                                                            sendRes('openNote')
                                                                        })
                                                                        .catch(()=> console.log("ERROR - Couldn't get rating options"))
                                                                    
                                                                })
                                                                .catch((e)=>{
                                                                    console.log("ERROR - Couldn't assign property to user")
                                                                    goToErrorPage()
                                                                })
                                                        }
                                                    })
            
            
                                            
                                            }
                                            // IF NO:
                                            else{
                                                console.log('Website is not in the database')
                                                // SEND WEBSITE DATA TO DATABASE
                                                sendWebsiteDataToDatabase(res.data, jwtToken)
                                                    .then(isSuccess => {
                                                        if (isSuccess){
                                                            console.log('Property added to database')
                                                            // CONNECT USER TO PROPERTY
                                                            addWebsiteToUser(websiteUrl, jwtToken)
                                                                .then(()=>{
                                                                    console.log('Property assigned to user')
                                                                    getUserRatingOptions(jwtToken)
                                                                    .then(ratingOptions => {
                                                                        addUnratedRatings(ratingOptions, websiteUrl, jwtToken)
                                                                        goToRatingPage(websiteUrl, 1, jwtToken)
                                                                        sendRes('openNote')
                                                                    })
                                                                    .catch(()=> console.log("ERROR - Couldn't get rating options"))
                                                                    
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
                            
                            goToInactivePage()
                        }
    
                    }else{
                        console.log('Not authenticated')
                        goToLoginPage()
                    }
                })
                    
                
    
                
           
                
                
            });
        })

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

                chrome.storage.local.get('jwtToken', storage => {
                    const jwtToken = storage.jwtToken 
                
                    addNoteToDatabase(websiteUrl, jwtToken)
    
    
                    updateRating(websiteUrl, ratingoption, rating, jwtToken)
                        .then((ret)=>{
                            if (ret.isSuccess){
                                console.log("Rating added");
                                goToRatingPage(websiteUrl, parseInt(currentPage) + 1, jwtToken)
                            }else{
                                console.log("ERROR - Couldn't add the rating")
                            }
                        })
                        .catch(()=>console.log("ERROR - Couldn't add the rating"))
                })


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

                chrome.storage.local.get('jwtToken', storage => {
                    const jwtToken = storage.jwtToken 
                
                    console.log('Skip page')
                    addNoteToDatabase(websiteUrl, jwtToken)
    
    
                    goToRatingPage(websiteUrl, parseInt(currentPage) + 1, jwtToken)
                
                })


            });
          });

      
        
        
        
    }
    return true;
})




//#endregion

