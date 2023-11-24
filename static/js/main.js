// open modal window

let modal = document.getElementById('modal'),
    openBtn = document.getElementById('open'),
    closeBtn = document.getElementById('close');

function openModal(){
    modal.style.display = 'flex'
}

function closeModal(){
    modal.style.display = 'none'
}

openBtn.addEventListener('click', openModal)
closeBtn.addEventListener('click', closeModal)



// open playlist rows


let rowShow = document.getElementById('folderBtn'),
    rowDiv = document.getElementById('rowDiv')


function rowShows(){
    rowDiv.classList.toggle('flex_s')
    rowShow.classList.toggle('deg_s')
}




rowShow.addEventListener('click', rowShows)

let myVar = document.querySelector("body")

function myFunction() {
  myVar = setTimeout(showPage, 1300);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.querySelector(".coverf").style.display = "flex";
  document.querySelector(".coverf").style.transition = '3s'
    document.querySelector('.coverf').style.opacity = '1'
}










