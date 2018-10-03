let form = document.loginForm;
let inputs = [
    form.usernameLogin,
    form.passwordLogin
];

function isEmpty (element) {
    if (element.value === '' || element.value.trim() === '') {
        return true;
    } else {
        return false;
    }
}

form.addEventListener('submit', function (event) {
    for (var i = 0; i < inputs.length; i++) {
        if (isEmpty(inputs[i])) {
            event.preventDefault();
            M.toast({html: 'Please provide your username and password'});
            inputs[i].focus();
            break;
        }
    }
});