const template = document.createElement('template')

template.innerHTML = 

`      
<style>
.ratingSummary {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 0;
  }

  .rating-list {
    margin: 5px auto;
    display: flex;
    gap: 50px;
  }

  .rating-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .rating-list .labels li {
    font-weight: 400;
    font-size: 13px;
    line-height: 1.8em;
  }

  .rating-list .ratings li {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.8em;
    opacity: 0;
    transform: translateX(-20%);
    animation: ani 0.5s forwards;
  }
  .rating-list .ratings li:nth-of-type(2){
    animation-delay: 0.04s;
  }
  .rating-list .ratings li:nth-of-type(3){
    animation-delay: calc(0.04s * 2);
  }
  .rating-list .ratings li:nth-of-type(4){
    animation-delay: calc(0.04s * 3);
  }

  h4 {
    font-weight: 400;
    margin: 0;
    font-size: 12px;
    margin-bottom: 3px;
  }
  .bold{
      font-weight: 600;
      font-size: 13px;
  }

  @keyframes ani {
    form{
      opacity: 0;
      transform: translateX(-30%);
    }
    to{
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>

<div class="ratingSummary">
    <div class='message' >
        <h4><span class='bold' >Congrats, you’ve rated this home!</span></h4>
        <h4>This is saved in your account area & below is an overview of how you rated this home.</h4>
    </div>
    <div class="rating-list">
    <ul class="labels">

    </ul>
    <ul class="ratings">

    </ul>
    </div>
</div>


 
`

class RatingSummary extends HTMLElement {
    constructor(){
        super()
        
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        const data = JSON.parse(this.getAttribute('data'))

        const labels = this.shadowRoot.querySelector('.labels')
        const ratings = this.shadowRoot.querySelector('.ratings')

        const colors = {
            Amazing: '#009700',
            Good: '#ffb158',
            Meh: 'black',
            Awful: '#c30101',
            Unrated: '#00335640'
        }


        data.forEach(element=>{
            const title = element.ratingOption
            let rating = element.rating
            if (!rating){
              rating = 'Unrated'
            }


            const labelNode = document.createElement('li')
            labelNode.innerHTML = title
            labels.appendChild(labelNode)
            
            const ratingNode = document.createElement('li')
            ratingNode.innerHTML = rating
            ratingNode.style.color = colors[rating]
            ratings.appendChild(ratingNode)

        })


        



    }
}

window.customElements.define('rating-summary', RatingSummary)