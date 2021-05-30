var input = document.querySelector('#link-form');
var loading = document.querySelector('.load-cover');
var alertBox = document.querySelector('.alert-box');
var alertBoxText = document.querySelector('.alert-box-text');
var shortenedLinksHolder = document.querySelector('.shortened-links');


var linksLog = [];

// mobile nav function
function mobileNav(){
    document.querySelector('.burger').addEventListener('click',()=>{
        document.querySelector('.mobile-nav').classList.toggle('mobile-nav-display');
    })
};



// functions for handling input
function textInput(){
    input.addEventListener('keyup',(e)=>{
        if(input.value.length === 0 && e.key === "Enter"){
            setError('Field cannot be empty!')
        }
        else if(e.keycode ==13 || e.key === "Enter"){
            if(!isValidHttpUrl(input.value)){
            setError('Please enter a valid URL with the http!');
        }
        else{
            inputSearch(e.target.value);
            input.value ='';
        } 
        }
    })
};
textInput();

// shorten button function
document.querySelector('.shorten-now').addEventListener('click',()=>{
    if(input.value.length === 0){
        setError('Field cannot be empty!')
    }
    else if(!isValidHttpUrl(input.value)){
        setError('Please enter a valid URL with the http!');
    }
    else{
        inputSearch(input.value);
        input.value ='';
    }
    
});


function inputSearch(linkAddress){
    apiShorty(linkAddress)
}

// localstorage 


//save to local storage
function saveLink(){
    var str = JSON.stringify(linksLog);
    localStorage.setItem('linkHolder', str);
}

// get data from localStorage
function getLink(){
    var str = localStorage.getItem('linkHolder');
    linksLog = JSON.parse(str);
    
    if(!linksLog){
        linksLog = [];
    }
};




function linkList(value, shortenedValue){
    var linkHolder = document.createElement('div');
    linkHolder.classList.add('link-list');
    var textReceived = document.createElement('p');
    textReceived.classList.add('text-input');
        textReceived.textContent = value;
    var copySection = document.createElement('div');
    copySection.classList.add('right');
    var output = document.createElement('p');
        output.classList.add('shortened-output');
    output.textContent = shortenedValue;
    var copyText = document.createElement('div');
    copyText.textContent = 'Copy';
    copyText.classList.add('copy-shortened', 'click');

    copySection.appendChild(output);
    copySection.appendChild(copyText)
    
    linkHolder.appendChild(textReceived);
    linkHolder.appendChild(copySection);
    shortenedLinksHolder.appendChild(linkHolder);
    loading.style.display = 'none';

    copyText.onclick = function(){copyToClipboard(output, copyText)};
};


// APi function
async function apiShorty(value) {
    loading.style.display = 'flex';
    const response = await fetch('https://api.shrtco.de/v2/shorten?url='+value); 
    const data = await response.json();

    var shortenedValue = data.result.short_link;

    linksLog.push({value: value , shortened: shortenedValue});
    saveLink();
    linkList(value, shortenedValue);
    
}

// copy to clipbpoard function
function copyToClipboard(output, copyText){
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = output.textContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    copyText.textContent = 'Copied';
    setTimeout(()=>{copyText.textContent = 'Copy';}, 2000);
}

function isValidHttpUrl(string) {
    if (string && string.length > 1 && string.slice(0, 2) == '//') {
        string = 'http:' + string; //dummy protocol so that URL works
    }
    try {
        var url = new URL(string);
        return url.hostname && url.hostname.match(/^([a-z0-9])(([a-z0-9-]{1,61})?[a-z0-9]{1})?(\.[a-z0-9](([a-z0-9-]{1,61})?[a-z0-9]{1})?)?(\.[a-zA-Z]{2,4})+$/) ? true : false;
    } catch (_) {
        return false;
    }
}


function setError(message){
    alertBoxText.textContent = message;
    alertBox.style.display = 'flex';
    setTimeout(closeError, 1000);
}

function closeError(){
    alertBox.style.display = 'none';
}


getLink();

for(var i =0; i<linksLog.length; i++){
    linkList(linksLog[i].value, linksLog[i].shortened);
};