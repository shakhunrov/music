let myVar = document.querySelector("body")

function myFunction() {
  myVar = setTimeout(showPage, 2000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.querySelector(".coverf").style.display = "flex";
  document.querySelector(".coverf").style.transition = '3s'
    document.querySelector('.coverf').style.opacity = '1'
}