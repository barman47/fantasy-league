
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

function appendData (data) {
    var tbody = document.querySelector('#tableBody');
    var tableRow = document.createElement('tr');
    var tableData1 = document.createElement('td');
    var tableData2 = document.createElement('td');
    var tableData3 = document.createElement('td');
    var text1 = document.createTextNode(data.category);
    var text2 = document.createTextNode(data.info);
    var text3 = document.createTextNode(data.time);
    tableData1.appendChild(text1);
    tableData2.appendChild(text2);
    tableData3.appendChild(text3);
    tableRow.appendChild(tableData1);
    tableRow.appendChild(tableData2);
    tableRow.appendChild(tableData3);
    tbody.appendChild(tableRow);
}

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
    appendData(data);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});