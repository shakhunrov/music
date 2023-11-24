let modal = document.getElementById('Openmodal'),
    openBtn = document.getElementById('id'),
    closeBtn = document.getElementById('closed');

function openModal() {
    modal.style.display = 'flex'
}

function closeModal() {
    modal.style.display = 'none'
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);


let noRightClickEls = document.querySelectorAll('.main_right_components_box');
let activeRightElem = null;

noRightClickEls.forEach((right) => {
    const reightElem = right.querySelector('.rightElem');
    right.addEventListener('contextmenu', (event) => {
        if (activeRightElem) {
            activeRightElem.style.display = 'none'; // Oldingi activeRightElem yopiladi
        }
        activeRightElem = reightElem;
        reightElem.style.display = 'flex';
        event.preventDefault();
    });

    reightElem.addEventListener('contextmenu', (event) => {
        reightElem.style.display = 'none';
        event.preventDefault();
    });
});


const alertt = document.querySelector('.alert');
const yop = document.getElementById('no');
const deleteCategroryFirst = document.querySelectorAll('.deleteCategory');
const cancelCategrory = document.querySelectorAll('.cancelCategrory');
const rightElemt = document.querySelectorAll('.rightElem')


function deleteCategory() {
    alertt.style.display = 'flex'
    rightElemt.forEach((righElement) => {
        righElement.style.display = 'none'
    })
}

function cancelCategory() {
    alertt.style.display = 'none'
    rightElemt.forEach((righElement) => {
        righElement.style.display = 'none'
    })
}

function yopvor() {
    alertt.style.display = 'none'
    rightElemt.forEach((righElement) => {
        righElement.style.display = 'none'
    })
}


deleteCategroryFirst.forEach((deleteCategorys) => {
    deleteCategorys.addEventListener('click', deleteCategory)
});

cancelCategrory.forEach((cancelCategorys) => {
    cancelCategorys.addEventListener('click', cancelCategory)
});
yop.addEventListener('click', yopvor);
