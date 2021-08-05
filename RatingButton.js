const template = document.createElement('template')

template.innerHTML = `

    <style>

   
      

      .rating-button {
        width: 90px;
        height: 30px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
      }

      

    </style>





    <li class="rating-button " id='rating-button' ></li>
 
`

class RatingButton extends HTMLElement {
    constructor(){
        super()
        
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        const color = this.getAttribute('color')
        const rating = this.getAttribute('rating')
        const currentPage = this.getAttribute('current-page')
        

        const button = this.shadowRoot.getElementById('rating-button')

        button.style.border = `solid ${color} 2px`
        button.style.color = color
        button.innerHTML = rating




        // LATER --- onClick -> remove event listener, send data, reroute
        button.addEventListener('click', ()=>{
            const currentPage = this.getAttribute('current-page')
            const title = this.getAttribute('title')


            
            if (button.classList.contains('active')){    
                button.style.backgroundColor = 'white'
                button.style.color = color
            }else{
                button.style.backgroundColor = color
                button.style.color = 'white'
            }

            button.classList.toggle('active')



            chrome.runtime.sendMessage({
                message: 'nextPage',
                currentPage: currentPage,
                data: {
                    title: title,
                    rating: rating
                }
                
            })
        })



    }
}

window.customElements.define('rating-button', RatingButton)