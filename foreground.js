
// SELECTING EACH WEBSITES DATA
const getWebsiteData = (website) => {

    // if it doesnt find anything, set it to null !!!!!!!!
    if (website === 'onthemarket'){
        var address = document.getElementsByClassName('address-address')[0].innerHTML

        var price = document.getElementsByClassName('price-data')[0].innerHTML


        var imageUrl = document.getElementsByClassName('hero-image')[0].getAttribute('src')

        var bedrooms = parseInt(document.getElementsByClassName('property-icon-number')[0].innerHTML)

        var bathrooms = parseInt(document.getElementsByClassName('property-icon-number')[1].innerHTML)
    }else if (website === 'zoopla'){
        var address = document.getElementsByClassName('css-juh6tp-DisplayAddressLabel')[0].innerHTML

        var price = document.getElementsByClassName('css-zwo9uh-PricingLabel')[0].innerHTML


        var imageUrl = document.getElementsByClassName('css-14ovsg1-Slide')[0].childNodes[0].childNodes[0].childNodes[2].getAttribute('src')

        var bedrooms = parseInt(document.getElementsByClassName('css-8rvu8h-AttributeLabel')[0].innerHTML.replace('beds', ''))

        var bathrooms = parseInt(document.getElementsByClassName('css-8rvu8h-AttributeLabel')[1].innerHTML.replace('baths', ''))
    }else if (website === 'rightmove'){
        var address = document.getElementsByClassName('_2uQQ3SV0eMHL1P6t5ZDo2q')[0].innerHTML

        var price = document.getElementsByClassName('_1gfnqJ3Vtd1z40MlC0MzXu')[0].childNodes[0].innerHTML


        var imageUrl = document.getElementsByClassName('_2zqynvtIxFMCq18pu-g8d_')[0].childNodes[0].getAttribute('content')

        var bedrooms = parseInt(document.getElementsByClassName('_1fcftXUEbWfJOJzIUeIHKt')[1].innerHTML.slice(1))

        var bathrooms = parseInt(document.getElementsByClassName('_1fcftXUEbWfJOJzIUeIHKt')[2].innerHTML.slice(1))
    }else{
        console.log('INVALID WEBSITE - getWebsiteData')
        return null
    }

    const data = {
        address: address,
        price: price,
        imageurl: imageUrl,
        bedrooms: bedrooms,
        bathrooms: bathrooms
    }


    return data
}




// LISTENING TO REQUEST FOR THE DATA
chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
    if (req.message === 'getData'){

        const websiteUrl = req.websiteurl
        const website = websiteUrl.split('.')[1]

        const websiteData = getWebsiteData(website)
        websiteData.websiteurl = websiteUrl


        websiteData !== null ? 
        sendRes({
            message:'success',
            data: websiteData
        }) 
        :
        sendRes({
            message: 'fail'
        }) 

    }
    return true;
})



