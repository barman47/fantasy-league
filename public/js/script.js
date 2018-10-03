$(document).ready(function () {
    $('.slider').slider({fullWidth: true});
    var loginForm = document.adminLoginForm;
    var signUpForm = document.adminSignupForm;
    var loginInputs = [
        loginForm.loginUsername,
        loginForm.loginPassword,
    ];
    var signupInputs = [
        signUpForm.signupName,
        signUpForm.signupUsername,
        signUpForm.signupUsername,
        signUpForm.secret
    ];

    var passwordRegExp = /^[\w@-]{8,20}$/;

    function submitLogin (event) {        
        for (var i = 0; i < loginInputs.length; i++) {
            if (isEmpty(loginInputs[i])) {
                event.preventDefault();
                loginInputs[i].classList.add('invalid');
                loginInputs[i].focus();
                break;
            }
        }
    }

    function submitSignup (event) {        
        for (var i = 0; i < signupInputs.length; i++) {
            if (isEmpty(signupInputs[i])) {
                event.preventDefault();
                signupInputs[i].classList.add('invalid');
                signupInputs[i].focus();
                break;
            }
        }
    }

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    function checkInputs () {
        signupInputs[2].addEventListener('keyup', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        signupInputs[2].addEventListener('focusout', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');                
                event.target.focus();
                M.toast({html: 'Please provide a valid password to continue'});
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    }
    loginForm.addEventListener('submit', submitLogin, false);
    signUpForm.addEventListener('submit', submitSignup, false);
    checkInputs();
});