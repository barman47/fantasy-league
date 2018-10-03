
$('.collapsible').collapsible();
$('select').formSelect();
M.textareaAutoResize($('#dataTextarea'));
var form = document.dataForm;
var dataCategory = form.category;
var textarea = form.dataTextarea;

var socket = io();

socket.on('connect', function () {
    console.log('Connected to Server');

});

function checkInputs () {
    if (dataCategory.value === '') {
        return M.toast({html: 'Please select a category to post'});
    } else if (textarea.value ==='' || textarea.value.trim() === '') {
        M.toast({html: 'Please provide data to post'});
        textarea.focus();
    } else {
        socket.emit('info', {
            text: textarea.value,
            category: dataCategory.value
        });
        M.toast({html: 'Info sent'});
        form.reset();
    }
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    checkInputs();
});

socket.on('newInfo', function (data) {
    console.log('new Info: ', data);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});