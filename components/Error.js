const template = document.createElement('template')

template.innerHTML = 

`      
<style>
.error {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: 2px;
    padding: 10px 0;
  }

  h4 {
    font-weight: 400;
    font-size: 12px;
    margin: 0;
  }
  .bold{
      font-weight: 600;
      font-size: 13px;
  }

  .errorImage{
      background: url('/assets/error.svg') no-repeat;
      background-size: cover;
      height: 45px;
      width: 45px;
      margin: 15px;
  }

</style>

<div class="error">
    <div class="errorImage"></div>
    <div class='message' >
        <h4><span class='bold'>There has been an error!</span></h4>
        <h4>Try to reload the page or <a>contact us</a></h4>
    </div>
    <div class="rating-list">
    <ul class="labels">

    </ul>
    <ul class="ratings">

    </ul>
    </div>
</div>


 
`

class Error extends HTMLElement {
    constructor(){
        super()
        
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))




        



    }
}

window.customElements.define('error-page', Error)