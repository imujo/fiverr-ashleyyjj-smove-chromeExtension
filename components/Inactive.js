const template = document.createElement('template')

template.innerHTML = 

`      
<style>
.inactive {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: 2px;
    padding: 10px 0;
  }

  h4 {
    font-weight: 400;
    margin: 10px 0;
    font-size: 12px;
  }
  .bold{
      font-weight: 600;
      font-size: 13px;
      margin-top: 5px;
  }

</style>

<div class="inactive">
    <div class='message' >
        <h4><span class='bold' >We don’t recognise this page as a property listing!</span></h4>
        <h4>Open me up on Rightmove, Zoopla or On the Market to save and start rating homes.</h4>
    </div>
    <div class="rating-list">
    <ul class="labels">

    </ul>
    <ul class="ratings">

    </ul>
    </div>
</div>


 
`

class Inactive extends HTMLElement {
    constructor(){
        super()
        
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))




        



    }
}

window.customElements.define('inactive-page', Inactive)