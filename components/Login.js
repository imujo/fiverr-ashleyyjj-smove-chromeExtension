const template = document.createElement('template')

template.innerHTML = 

`      
<style>
input {
    border: none;
    outline: none;
    height: 25px;
    width: 100%;
    background-color: white;
    border: 1px solid #d1d1d1;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    padding: 0 5px;
    transition: all 0.2s;
    margin-bottom: 20px;

    font-size: 1.3em;
    /* &:focus {
      border: 1px solid darken($lightBlue, 20%); */
  }
  input:focus {
    border: 1px solid #999999;
  }

  input[type="submit"] {
    cursor: pointer;
    border-radius: 0.3em;
    transition: all 0.1s ease-out;
    font-size: 1.1em;
    font-weight: 700;
    background-color: #ff5f58;
    box-shadow: none;
    border: none;
    color: white;
  }
  input[type="submit"]:hover {
    transform: scale(1.01);
  }
  .login__form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .login__section {
    display: flex;
    gap: 25px;
  }

  .login__text {
    font-size: 12px;
    width: 70%;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 10px;
  }

  .link {
      color: #003356;
    text-decoration: underline;
    font-weight: 600;
    cursor: pointer;
    text-decoration-color: #003356;
  }

  .errorText{
      color: red;
      margin: 0 auto;
      margin-bottom: 10px;
      width: max-content;
  }

</style>

<div class="login">
    <h2>Log into your account</h2>
    <form class="login__form">
    <div class="login__section">
        <div class="login__item">
        <label for="email">Email: </label> <br />
        <input type="email"  id="email" /><br />
        </div>

        <div class="login__item">
        <label for="password">Password: </label><br />
        <input type="password"  id="password" /><br />
        </div>
    </div>

    <input type="submit" id="submit" value="Log in" />
    </form>

    <p class="login__text">
    If you don't have an account, <a href="http://127.0.0.1:3000/?#/signup" class="link" target="_blank">sign up</a> on our
    website, come back and log in.
    </p>
    <p class="errorText"></p>
</div>


 
`

class Login extends HTMLElement {
    constructor(){
        super()
        
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))


        const submit = this.shadowRoot.querySelector('#submit')
        const email = this.shadowRoot.querySelector('#email')
        const password = this.shadowRoot.querySelector('#password')
        const errorText = this.shadowRoot.querySelector('.errorText')

        // send login info
        submit.addEventListener('click', (e)=>{
            e.preventDefault()
            console.log('click')
            
            chrome.runtime.sendMessage({
                message: 'login',
                data: {
                    email: email.value,
                    password: password.value
                }              
            })
            
        })

        // if error
        chrome.runtime.onMessage.addListener((req, sender, sendRes)=>{
            if (req.message === 'loginError'){
                errorText.innerHTML = req.errorMsg
                console.log(req.errorMsg)

                setTimeout(()=> errorText.innerHTML = '', 3000)
                
                
            }
            return true;
        })

       

        
        



    }
}

window.customElements.define('login-page', Login)