const template = document.createElement('template')

template.innerHTML = `

    <style>

    h2 {
        margin: 0;
        font-size: 20px;
    }

    .content {
        display: grid;
        grid-template-rows: min-content min-content min-content auto;
        padding: 10px 0px;
      }

      .progress span {
        color: #ff5f58;
      }
      .progress p{
          margin: 0;
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
      }

      .title p {
        cursor: pointer;
        font-size: 12px
      }
      

      .rating-container {
        list-style: none;
        padding: 0;
        display: flex;
        margin: 0;
        margin-top: 5px;
        margin-bottom: 10px;
        justify-content: space-evenly;
      }


      .note {
        margin-top: 10px;
        width: 100%;
        resize: vertical;
        font-family: "Poppins";
        padding-left: 5px;
        padding-top: 3px;
        box-sizing: border-box;
        border-color: lightgray;
        border-radius: 6px;
        max-height: 400px;
        min-height: 30px;
      }
      .note:focus,
      .note:active {
        outline: none;
      }
    </style>




    <div class="content">
        <div title='Rating progress' class="progress">
        <p><span id='current-page' >1</span> out of <span id='pages' >4</span></p>
        </div>

        <div title='Title' class="title">
            <h2 id='title' ></h2>
            <p id='skip' title='Skip to the next rating section' >Skip</p>
        </div>

        <ul class="rating-container">
        <rating-button class='rating-btn' color='#c30101' rating='Awful' ></rating-button>
        <rating-button class='rating-btn' color='black' rating='Meh' ></rating-button>
        <rating-button class='rating-btn' color='#ffb158' rating='Good' ></rating-button>
        <rating-button class='rating-btn' color='#009700' rating='Amazing' ></rating-button>

        </ul>
        <form class="note-form">
        <textarea
            name="note"
            class="note"
            id="note"
            title='Make a note'
            rows="3"
            placeholder="Make a quick note..."
        ></textarea>
        </form>
    </div>
`

class Content extends HTMLElement {
    constructor(){
        super()
        
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        const currentPage = this.getAttribute('current-page')
        const title = this.getAttribute('title')
        

        this.shadowRoot.getElementById('title').innerHTML = title
        this.shadowRoot.getElementById('current-page').innerHTML = currentPage
        this.shadowRoot.getElementById('pages').innerHTML = this.getAttribute('pages')
        const skip = this.shadowRoot.getElementById('skip')

    
        skip.addEventListener('click', ()=>{
            chrome.runtime.sendMessage({
                message: 'nextPage',
                currentPage: currentPage,
                data: {
                    title: title,
                    rating: NaN
                }
                
            })
        })    



        this.shadowRoot.querySelectorAll('.rating-btn').forEach(button =>{
            button.setAttribute('current-page', currentPage)
            button.setAttribute('title', title)
        })


        

    }
}

window.customElements.define('rate-properties', Content)