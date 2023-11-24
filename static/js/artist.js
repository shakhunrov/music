const artist = document.getElementById('artist');
const artistBtn = document.getElementById('artistBtn');
const artistSource = document.getElementById('artistSource');


function loadMusicData() {
    fetch('/get_artist', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(artist => {
                const musicItem = document.createElement('div');
                artistSource.appendChild(musicItem);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener('load', loadMusicData);

artistBtn.addEventListener('click', () => {
    const artistData = {
        artist: artist.value,
    };

    fetch('/artist', {
        method: 'POST',
        body: JSON.stringify({artists: artistData}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Artist added successfully') {

                artist.value = '';

                artistSource.innerHTML = '';
                loadMusicData();
            }
        })
        .catch(error => console.error(error));
});