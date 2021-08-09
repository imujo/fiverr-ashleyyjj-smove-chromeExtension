const template = document.createElement('template')

template.innerHTML = `

    <style>

    .note {
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


    <form class="note-form">
      <textarea
        name="note"
        class="note"
        id="note"
        rows="2"
        title="Make a note"
        placeholder="Make a quick note..."
      ></textarea>
    </form>


`

class Note extends HTMLElement {
    constructor(){
        super()

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        const note = this.shadowRoot.querySelector('.note')

        chrome.runtime.onMessage.addListener((req, sender, sendRes) =>{
            if (req.message = 'getNote'){

                sendRes(note.value)

            }
            return true;
        })

        
                  

    }
}

window.customElements.define('quick-note', Note)