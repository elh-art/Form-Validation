const respErrorElem = document.getElementById('response-error')
const spinnerElem = document.getElementById('spinner')


const validate = event => {
  switch (event.type) {

    case "keyup":
      validateElement(event.target)
      break

    case "submit":
      for (let element of event.target)
        validateElement(element)
      break

  }
}


const validateElement = element => {
  let error = ''

  if (element.required) {

    switch (element.type) {
      case "text":

        switch (element.id) {
          case "firstname":
            if (!isValid(element.value, /^([a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]{2,})+$/)) 
            {
              error = "Please give a valid firstmane"
              document.getElementById(`${element.id}-error`).classList.remove('validated')
            } else {
              error = ''
              document.getElementById(`${element.id}-error`).classList.add('validated')
            }
            break
            
          case "lastname":
            if (!isValid(element.value, /^([a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]{2,})+$/))
            {
              error = "Please give a valid lastname"
              document.getElementById(`${element.id}-error`).classList.remove('validated')
            } else {
              error = ''
              document.getElementById(`${element.id}-error`).classList.add('validated')
            }
            break         
        }
        break

      case "email":
        if (!isValid(element.value, /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
        {
          error = "Please give a valid email address"
          document.getElementById(`${element.id}-error`).classList.remove('validated')
        } else {         
          error = ''
          document.getElementById(`${element.id}-error`).classList.add('validated')
        }
        break

      case "password":
        if (!isValid(element.value, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
        {
          error = "Please give a valid password"
          document.getElementById(`${element.id}-error`).classList.remove('validated')
        } else { 
          error = ''
          document.getElementById(`${element.id}-error`).classList.add('validated')
        }
        break     
    }

    if (element.value === '') {
      error = ''
    }

    document.getElementById(`${element.id}-error`).innerText = error
  }
}


const isValid = (value, regEx) => {
  if(regEx.test(value))
    return true
  return false
}


const handleSignUp = event => {
  event.preventDefault()

  respErrorElem.innerText = ''
  spinnerElem.classList.remove('d-none')
  
    if (isAllValidated(event))
    {
  
      let json = JSON.stringify({
        firstname: event.target[0].value,
        lastname: event.target[1].value,
        email: event.target[2].value,
        password: event.target[3].value
      })
      
      fetch('https://lexicon-shared-webapi.azurewebsites.net/api/auth/signup', {
        method: 'post',
        headers:  {
          'Content-Type': 'application/json'
        },
        body: json
      })
      
      .then(res => {
        if(res.status === 400){
          respErrorElem.innerText = 'You must fill all the required fields'
        }
        if(res.status === 409){
          respErrorElem.innerText = 'There is already a user with the same email address'     
        }
        if(res.status === 200){
          window.location.replace('signin.html')
        }
        spinnerElem.classList.add('d-none')
      }
      )
      
    } else {
     respErrorElem.innerText = 'Failed validation! Please, correct your inputs'
     spinnerElem.classList.add('d-none')
     setTimeout(() => {
       respErrorElem.innerText = ''
     }, "3000")
    }

  }


const isAllValidated = (event) => {
   switch (event.target[0].type) {
 
     case "text":
       if (document.getElementById(`firstname-error`).classList.contains('validated') &&
           document.getElementById(`lastname-error`).classList.contains('validated') &&
           document.getElementById(`email-error`).classList.contains('validated') &&
           document.getElementById(`password-error`).classList.contains('validated') ) {
         return true
       } else {
         return false
       }
  
     case "email":
       if (document.getElementById(`email-error`).classList.contains('validated') &&
           document.getElementById(`password-error`).classList.contains('validated') ) {
         return true
       } else {
         return false
       }
   }   
 }
  
const handleSignIn = event => {
  event.preventDefault()

  respErrorElem.innerText = ''
  spinnerElem.classList.remove('d-none')

  if (isAllValidated(event))
  {

    let json = JSON.stringify({
      email: event.target[0].value,
      password: event.target[1].value
    })

    fetch('https://lexicon-shared-webapi.azurewebsites.net/api/auth/signin', {
      method: 'post',
      headers:  {
        'Content-Type': 'application/json'
      },
      body: json
    })

    .then(res => {
      if(res.status === 400){
        respErrorElem.innerText = 'Ops! Email and password not matching.'
      }
      if(res.status === 200){
        window.location.replace('account.html') 
      }
      spinnerElem.classList.add('d-none')
      console.log(res)
      }
    )

    .then(data => {
      sessionStorage.setItem('token', data)
      }
    )

  } else {
    respErrorElem.innerText = 'Failed validation! Please, correct your inputs'
    spinnerElem.classList.add('d-none')
    setTimeout(() => {
      respErrorElem.innerText = ''
    }, "3000")
  }
}

const handleSignOut = () => {
  sessionStorage.removeItem('token')
  window.location.replace('signin.html') 
}

const isSignedIn = () => {
  let token = sessionStorage.getItem('token')
  if (token === null || token === undefined)
    window.location.replace('signin.html') 
}

const moveToSignIn = () => {
  window.location.replace('signin.html')
}

const moveToSignUp = () => {
  window.location.replace('signup.html')
}