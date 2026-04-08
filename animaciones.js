const signIn= document.getElementById('sign-in')
const signUp= document.getElementById('sign-up')
const Form= document.getElementById('form')
const Banner= document.getElementById('banner')

signIn.addEventListener('click',()=>{
    Form.classList.remove('toggle')
    Banner.classList.remove('toggle')
})

signUp.addEventListener('click',()=>{
    Form.classList.add('toggle')
    Banner.classList.add('toggle')
})