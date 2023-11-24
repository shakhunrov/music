const audio = document.getElementById('audio');
const playButton = document.querySelectorAll('.play');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const volumeSlider = document.getElementById('volume-slider');
const songList = document.querySelectorAll('.play-song');
const lok = document.querySelector('.lok');
const timeControl = document.querySelector('.time-control');


let currentSongIndex = 0;

function playSong(index, songs) {
    if (index >= 0 && index < songs.length) {
        currentSongIndex = index;
        audio.src = songs[currentSongIndex].audio;
        audio.play();

        const songImage = document.querySelector('.music-player_head_musicImg');
        songImage.src = songs[currentSongIndex].image;


        const songTitle = document.getElementById('song-title');
        songTitle.innerText = songs[currentSongIndex].title;


        const artistTitle = document.getElementById('artist-title');
        artistTitle.innerText = songs[currentSongIndex].artist_id


    }
}

playButton.forEach((item) => {
    item.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            document.getElementById('platMus').src = "/static/img/pause.png";
            document.getElementById('platBtn').src = "/static/img/pause.png"
        } else {
            audio.pause();
            document.getElementById('platMus').src = "/static/img/mainPlay.png";
            document.getElementById('platBtn').src = "/static/img/mainPlay.png"
        }
    })
})

function next_button_click(songs) {
    nextButton.addEventListener('click', () => {
        lok.style.width = '0%';
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        console.log(currentSongIndex)
        playSong(currentSongIndex, songs);

    });
}

function prev_button_click(songs) {
    prevButton.addEventListener('click', () => {
        lok.style.width = '0%';
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex, songs);
    });
}


function next_music(songs) {
    audio.addEventListener('ended', () => {
        lok.style.width = '0%';
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex, songs);
        document.getElementById('platMus').src = "/static/img/pause.png";
        document.getElementById('platBtn').src = "/static/img/pause.png"
    });
}

audio.addEventListener('timeupdate', (e) => {
    const {duration, currentTime} = e.srcElement;
    let updatePro = (currentTime / duration) * 100;
    lok.style.width = `${updatePro}%`;
});

timeControl.addEventListener('click', (event) => {
    let width = timeControl.clientWidth;
    let clicked = event.offsetX;
    let durat = audio.duration;
    audio.currentTime = (clicked / width) * durat;
});


songList.forEach((song, index) => {
    song.addEventListener('click', () => {
        lok.style.width = '0%';
        playSong(index);
    });
});
let songs=[]
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});


const openModal = document.getElementById('delete');
const ModalDiv = document.querySelector('.modalDelete');
const Cancel = document.getElementById('cancel');
const addMusic = document.getElementById('addMusic');
const musicTable = document.querySelector('.modalMusic2');
const modalMusicBtn = document.getElementById('modalMusicBtn');
const Closed1 = document.getElementById('modalMusicClose2');
const musicList = document.getElementById('musicList');


let audioSc = document.getElementById('uplad');
let imageSc = document.getElementById('upladd');
let dateSc = document.getElementById('category_id');
let titleSc = document.getElementById('titlee');
let artistSc = document.getElementById('artist_id');
let musicn1=document.querySelector('.music-player_head_source_musicName')
console.log(songs)
let imgforsong=document.querySelector('.music-player_head_musicImg')
function loadMusicData() {
    fetch('/add_musics', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            songs.length = 0

            data.forEach(music => {
                console.log(music)
                songs.push(music)
                console.log(songs)
                const musicItem = document.createElement('div');
                const artistOption = document.querySelector(`select#artist_id option[value="${music.artist_id}"]`);
                const artistName = artistOption ? artistOption.textContent : '';
                const categoryOption = document.querySelector(`select#category_id option[value="${music.category_id}"]`);
                const categoryName = categoryOption ? categoryOption.textContent : '';


                musicItem.innerHTML = `
                <ul class="main_right_musicTop_musics1">
                    <li style="width: 50px; color: white; text-decoration: none" class="play-song main_right_musicTop_musics_article1">${music.id}</li>
                    <li style="width: 400px; color: white" class="main_right_musicTop_musics_article1"><b>${music.title}</b><br><i style="font-size: 12px; color: white">${artistName}</i></li>
                    <li style="width: 500px; color: white" class="main_right_musicTop_musics_article1">${music.title}</li>
                    <li style="width: 400px; color: white" class="main_right_musicTop_musics_article1">${categoryName}</li>
                    <li style="width: 150px; color: white" class="main_right_musicTop_musics_article1">Muzofy Corp</li>
                   
                </ul>
            `;

                musicList.appendChild(musicItem);
            });
                      next_button_click(songs);
            prev_button_click(songs);
            next_music(songs);
            audio.src=`${songs[0].audio}`;
         musicn1.innerHTML=  `${songs[0].title}`;
         imgforsong.src =`${songs[0].image}`
        })
        .catch(error => console.error(error));
}

window.addEventListener('load', loadMusicData);


modalMusicBtn.addEventListener('click', () => {
    const formData = new FormData();
    musicTable.style.display = 'none'

    formData.append('audio', audioSc.files[0]);
    formData.append('image', imageSc.files[0]);
    formData.append('category_id', dateSc.value);
    formData.append('title', titleSc.value);
    formData.append('artist_id', artistSc.value);

    console.log(formData);

    fetch('/tests', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Music added successfully') {

                audioSc.value = '';
                imageSc.value = '';
                dateSc.value = '';
                titleSc.value = '';
                artistSc.value = '';


                musicList.innerHTML = '';
                loadMusicData();
            }
            console.log(data.message)
        })

});


function OpenModal() {
    ModalDiv.style.display = 'flex'
}

function CloseModal() {
    ModalDiv.style.display = 'none'
    musicTable.style.display = 'none'
}

function AddMusic() {
    musicTable.style.display = 'flex'
    ModalDiv.style.display = 'none'
}

function Closedd1() {
    musicTable.style.display = 'none'
}

Closed1.addEventListener('click', Closedd1);
addMusic.addEventListener('click', AddMusic);
openModal.addEventListener('click', OpenModal);
Cancel.addEventListener('click', CloseModal);



let currentDuration = document.getElementById('current-time');
let totalDuration = document.getElementById('total-duration');

audio.addEventListener('timeupdate', (e) => {
    const {duration, currentTime} = e.srcElement;
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    const totalMinutes = Math.floor(duration / 60);
    const totalSeconds = Math.floor(duration % 60);


    currentDuration.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    totalDuration.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    console.log(currentDuration)

    const updatePro = (currentTime / duration) * 100;
    lok.style.width = `${updatePro}%`;
});

timeControl.addEventListener('click', (event) => {
    let width = timeControl.clientWidth;
    let clicked = event.offsetX;
    let durat = audio.duration;
    audio.currentTime = (clicked / width) * durat;
});


function filterMusic() {
    const categorySelect = document.getElementById('categorySelect');
    const artistSelect = document.getElementById('artistSelect');
    const searchInput = document.getElementById('searched');

    const search_id = searchInput.value;
    const category_id = categorySelect.value;
    const artist_id = artistSelect.value;

    if (category_id || artist_id || search_id) {
        let url = '/filter_music?';

        if (category_id) {
            url += `category_id=${category_id}`;
            if (artist_id) {
                url += `&artist_id=${artist_id}`;
            }
        } else if (artist_id) {
            url += `artist_id=${artist_id}`;
        } else if (search_id) {
            if (url.includes('?')) {
                url += `&searched=${search_id}`;
            } else {
                url += `searched=${search_id}`;
            }
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const filteredMusicList = document.getElementById('musicList');
                filteredMusicList.innerHTML = '';
songs.length=0
                data.forEach(music => {
                       console.log(music)
                songs.push(music)
                console.log(songs)
                    const musicItem = document.createElement('div');
                    const artistOption = document.querySelector(`select#artist_id option[value="${music.artist_id}"]`);
                    const artistName = artistOption ? artistOption.textContent : '';
                    const categoryOption = document.querySelector(`select#category_id option[value="${music.category_id}"]`);
                    const categoryName = categoryOption ? categoryOption.textContent : '';
                    musicItem.innerHTML = `
                        <ul class="main_right_musicTop_musics1">
                            <li style="width: 50px; color: white; text-decoration: none" class="main_right_musicTop_musics_article1">${music.id}</li>
                            <li style="width: 400px; color: white" class="main_right_musicTop_musics_article1"><b>${music.title}</b><br><i style="font-size: 12px; color: white">${artistName}</i></li>
                            <li style="width: 500px; color: white" class="main_right_musicTop_musics_article1">${music.title}</li>
                            <li style="width: 400px; color: white" class="main_right_musicTop_musics_article1">${categoryName}</li>
                            <li style="width: 150px; color: white" class="main_right_musicTop_musics_article1">Muzofy Corp</li>
                        </ul>
                    `;


                    filteredMusicList.appendChild(musicItem);
                });
   audio.src=`${songs[0].audio}`
         musicn1.innerHTML=  `${songs[0].title}`
                                 next_button_click(songs);
            prev_button_click(songs);
            next_music(songs);
              imgforsong.src =`${songs[0].image}`
            });
    } else {
        fetch('/filter_music')
            .then(response => response.json())
            .then(data => {
                const filteredMusicList = document.getElementById('musicList');
                filteredMusicList.innerHTML = '';
                data.forEach(music => {
                    const musicItem = document.createElement('div');
                    const artistOption = document.querySelector(`select#artist_id option[value="${music.artist_id}"]`);
                    const artistName = artistOption ? artistOption.textContent : '';
                    const categoryOption = document.querySelector(`select#category_id option[value="${music.category_id}"]`);
                    const categoryName = categoryOption ? categoryOption.textContent : '';
                    musicItem.innerHTML = `
                        <ul class="main_right_musicTop_musics1">
                            <li style="width: 50px; color: white; text-decoration: none" class="main_right_musicTop_musics_article1">${music.id}</li>
                            <li style="width: 400px; color: white" class="main_right_musicTop_musics_article1"><b>${music.title}</b><br><i style="font-size: 12px; color: white">${artistName}</i></li>
                            <li style="width: 500px; color: white" class="main_right_musicTop_musics_article1">${music.title}</li>
                            <li style="width: 400px; color: white" class="main_right_musicTop_musics_article1">${categoryName}</li>
                            <li style="width: 150px; color: white" class="main_right_musicTop_musics_article1">Muzofy Corp</li>
                        </ul>
                    `;
                    filteredMusicList.appendChild(musicItem);
                });
            });
    }
}


document.getElementById('categorySelect').addEventListener('change', filterMusic);
document.getElementById('artistSelect').addEventListener('change', filterMusic);
document.getElementById('searched').addEventListener('input', filterMusic)


window.addEventListener('load', loadMusicData);

let modal = document.getElementById('Openmodal'),
    openBtn = document.getElementById('id'),
    closeBtn = document.getElementById('closed');

function openModall() {
    modal.style.display = 'flex'
}

function closeModal() {
    modal.style.display = 'none'
}

openBtn.addEventListener('click', openModall);
closeBtn.addEventListener('click', closeModal);


let noRightClickEls = document.querySelectorAll('.main_right_components_box');
let activeRightElem = null;

noRightClickEls.forEach((right) => {
    const reightElem = right.querySelector('.rightElem');
    right.addEventListener('contextmenu', (event) => {
        if (activeRightElem) {
            activeRightElem.style.display = 'none';
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
