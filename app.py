from flask import *
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import *
import rang
from sqlalchemy.orm import relationship
from flask_migrate import Migrate
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123@localhost/music'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '20060605shaha'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "mp3"}


def current_us():
    user_now = ''
    if 'username' in session:
        user_get = User.query.filter(User.username == session['username']).first()
        user_now = user_get
    return user_now


def user_folder():
    upload_folder = "static/img/"
    return upload_folder


def checkFile(filename):
    value = '.' in filename
    type_file = filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    return value and type_file


class User(db.Model):
    id = Column(Integer, primary_key=True)
    gmail = Column(String)
    name = Column(String)
    username = Column(String)
    password = Column(String)
    admin = Column(Boolean)
    photo = Column(String)


class Playlists(db.Model):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True)
    text = Column(String)
    article = Column(String)
    picture = Column(String)
    catagory_id = Column(Integer, ForeignKey("categories.id"))
    playlist_id = Column(Integer)


class Categories(db.Model):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    category = Column(String)
    sortImg = Column(String)
    background = Column(String)
    category_id = Column(String)
    playlist = relationship("Playlists", backref="categories", order_by="Playlists.id")


class Musics(db.Model):
    __tablename__ = "musics"
    id = Column(Integer, primary_key=True)
    audio = Column(String)
    image = Column(String)
    date = Column(String)
    title = Column(String)
    artist_id = Column(Integer, ForeignKey("artists.id"))


class Songs(db.Model):
    __tablename__ = "songs"
    id = Column(Integer, primary_key=True)
    audio = Column(String)
    image = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))
    title = Column(String)
    artist_id = Column(Integer, ForeignKey("artists.id"))


class Artists(db.Model):
    __tablename__ = "artists"
    id = Column(Integer, primary_key=True)
    artist = Column(String)
    musics = relationship("Musics", backref="musics" "songs", order_by="Musics.id")


@app.route('/')
def main():
    current_user = current_us()
    playlists = Playlists.query.all()
    categories = Categories.query.all()
    return render_template('main.html', categories=categories, playlists=playlists, current_user=current_user)


@app.route('/profile')
def profile():
    current_user = current_us()
    return render_template('profile.html', current_user=current_user)


@app.route('/register', methods=["POST", "GET"])
def register():
    current_user = current_us()
    if request.method == "POST":
        photo = request.files['photo']
        gmail = request.form.get('gmail')
        name = request.form.get('name')
        usernames = request.form.get('username')
        password = request.form.get('password')
        username = User.query.filter(User.username == usernames).first()
        folder = user_folder()
        if photo and checkFile(photo.filename):
            img_file = secure_filename(photo.filename)
            photo_url = "/" + folder + img_file
            app.config["UPLOAD_FOLDER"] = folder
            photo.save(os.path.join(app.config["UPLOAD_FOLDER"], img_file))
            hashed = generate_password_hash(password=password, method='scrypt')
            add = User(name=name, password=hashed, username=usernames,
                       gmail=gmail, photo=photo_url)
            db.session.add(add)
            db.session.commit()
            return redirect(url_for('login'))
        if username:
            return render_template('register.html', error="This username already used")
    return render_template('register.html', current_user=current_user)


@app.route('/login', methods=["POST", "GET"])
def login():
    current_user = current_us()
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter(User.username == username).first()

        if user:
            if check_password_hash(user.password, password):
                session['username'] = user.username
                return redirect(url_for('main', current_user=current_user))
            else:

                return render_template('login.html', error='username or password wrong')
    return render_template('login.html', current_user=current_user)


@app.route('/edit', methods=["POST", "GET"])
def edit():
    current_user = current_us()
    if request.method == "POST":
        gmail = request.form.get('gmail')
        name = request.form.get('name')
        username = request.form.get('username')
        password = request.form.get('password')
        photo = request.files['photo']
        folder = user_folder()
        hashed = generate_password_hash(password=password, method='scrypt')
        if photo and checkFile(photo.filename):
            photo_file = secure_filename(photo.filename)
            photo_url = '/' + folder + photo_file
            app.config['UPLOAD_FOLDER'] = folder
            photo.save(os.path.join(app.config["UPLOAD_FOLDER"], photo_file))
            User.query.filter(User.id == current_user.id).update({
                "gmail": gmail,
                "name": name,
                "username": username,
                "password": hashed,
                "photo": photo_url
            })

            db.session.commit()
            return redirect(url_for('profile'))
        else:
            User.query.filter(User.id == current_user.id).update({
                "gmail": gmail,
                "name": name,
                "username": username,
                "password": hashed
            })
            db.session.commit()
            return redirect(url_for('profile'))
    return render_template('profile.html', current_user=current_user)


@app.route('/playlist', methods=["POST", "GET"])
def playlist():
    current_user = current_us()
    if request.method == "POST":
        catagory_id = request.form.get('category_id')
        article = request.form.get('article')
        text = request.form.get('text')
        print(article, text)
        picture = request.files['playimg']
        folder = user_folder()
        if picture and checkFile(picture.filename):
            img_file = secure_filename(picture.filename)
            photo_url = "/" + folder + img_file
            app.config["UPLOAD_FOLDER"] = folder
            picture.save(os.path.join(app.config["UPLOAD_FOLDER"], img_file))
            add = Playlists(catagory_id=catagory_id, article=article, text=text, picture=photo_url)
            print(picture)
            db.session.add(add)
            db.session.commit()
        return redirect(url_for('main'))
    playlists = Playlists.query.all()
    categories = Categories.query.all()
    return render_template('main.html', categories=categories, playlists=playlists, current_user=current_user)


@app.route('/category', methods=["POST", "GET"])
def category():
    current_user = current_us()
    if request.method == "POST":
        category = request.form.get('category')
        sortImg = request.files['sortImg']
        folder = user_folder()
        if sortImg and checkFile(sortImg.filename):
            img_file = secure_filename(sortImg.filename)
            photo_url = "/" + folder + img_file
            get_photo_url = folder + img_file
            app.config["UPLOAD_FOLDER"] = folder
            sortImg.save(os.path.join(app.config["UPLOAD_FOLDER"], img_file))
            rang2 = rang.get_average_color(get_photo_url)
            rangga = ", ".join(map(str, rang2))
            add = Categories(category=category, sortImg=photo_url, background=rangga)
            print(sortImg)
            db.session.add(add)
            db.session.commit()
        return redirect(url_for('category'))
    categories = Categories.query.all()
    return render_template('category.html', categories=categories, current_user=current_user)


@app.route('/play/<int:tos_id>')
def play(tos_id):
    current_user = current_us()
    tos = Categories.query.filter(Categories.id == tos_id).first()
    return render_template('music_page.html', tos=tos, current_user=current_user)


@app.route('/delete/<int:category_id>')
def remove(category_id):
    Playlists.query.filter(Playlists.catagory_id == category_id).delete()
    db.session.commit()
    Songs.query.filter(Songs.category_id == category_id).delete()
    db.session.commit()
    Categories.query.filter(Categories.id == category_id).delete()
    db.session.commit()
    Categories.query.all()
    return redirect(url_for('category'))


@app.route('/remove/<int:playlist_id>')
def delete(playlist_id):
    Playlists.query.filter(Playlists.id == playlist_id).delete()
    db.session.commit()
    playlist = Playlists.query.all()
    return redirect(url_for('main'))


@app.route('/music/<int:playlist_id>', methods=["POST", "GET"])
def music(playlist_id):
    current_user = current_us()

    selected_playlist = Playlists.query.get(playlist_id)
    playlists = Playlists.query.all()
    musics = Musics.query.all()
    artists = Artists.query.all()
    return render_template('music.html', artists=artists, musics=musics, playlists=playlists,
                           playlist=selected_playlist, current_user=current_user)


@app.route('/extends')
def extends():
    categories = Categories.query.all()
    playlists = Playlists.query.all()
    return render_template('extends.html', playlists=playlists, categories=categories)


@app.route('/logout')
def logout():
    session['username'] = ''
    return redirect(url_for('login'))


@app.route('/test', methods=["POST", "GET"])
def test():
    if request.method == "POST":
        audio = request.files["audio"]
        image = request.files["image"]
        date = request.form.get("date")
        title = request.form.get("title")
        artist_id = request.form.get("artist_id")  # Tanlovni tanlagan qiymatni olish
        folder = user_folder()
        if audio and checkFile(audio.filename):
            audio_file = secure_filename(audio.filename)
            audio_url = "/" + folder + audio_file
            app.config["UPLOAD_FOLDER"] = folder
            audio.save(os.path.join(app.config["UPLOAD_FOLDER"], audio_file))
        if image and checkFile(image.filename):
            img_file = secure_filename(image.filename)
            img_url = "/" + folder + img_file
            app.config["UPLOAD_FOLDER"] = folder
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], img_file))
            add = Musics(audio=audio_url, image=img_url, date=date, title=title, artist_id=artist_id)
            db.session.add(add)
            db.session.commit()
            musics = Musics.query.filter(Musics.artist_id == artist_id).all()
            serialized_genres = []
            for music in musics:
                serialized_genre = {
                    "id": music.id,
                    "audio": music.audio,
                    "image": music.image,
                    "date": music.date,
                    "title": music.title,
                    "artist_id": music.artist_id
                }
                serialized_genres.append(serialized_genre)
            return jsonify({
                "message": "Music added successfully",
                "musics": serialized_genres

            })
        else:
            return jsonify({"message": "Invalid request data"}), 400


@app.route('/get_musics', methods=["GET"])
def get_musics():
    musics = Musics.query.all()
    music_list = []
    for music in musics:
        music_list.append({
            "id": music.id,
            "audio": music.audio,
            "image": music.image,
            "date": music.date,
            "title": music.title,
            "artist_id": music.artist_id
        })
    return jsonify(music_list)


@app.route('/tests', methods=["POST", "GET"])
def tests():
    if request.method == "POST":
        audio = request.files["audio"]
        image = request.files["image"]
        category_id = request.form.get("category_id")
        title = request.form.get("title")
        artist_id = request.form.get("artist_id")
        folder = user_folder()
        print(title, artist_id)
        if audio and checkFile(audio.filename):
            audio_file = secure_filename(audio.filename)
            audio_url = "/" + folder + audio_file
            app.config["UPLOAD_FOLDER"] = folder
            audio.save(os.path.join(app.config["UPLOAD_FOLDER"], audio_file))
        if image and checkFile(image.filename):
            img_file = secure_filename(image.filename)
            img_url = "/" + folder + img_file
            app.config["UPLOAD_FOLDER"] = folder
            image.save(os.path.join(app.config["UPLOAD_FOLDER"], img_file))
            add = Songs(audio=audio_url, image=img_url, category_id=category_id, title=title, artist_id=artist_id)
            db.session.add(add)
            db.session.commit()
            musics = Songs.query.filter(Songs.artist_id == artist_id).all()
            serialized_genres = []
            for music in musics:
                serialized_genre = {
                    "id": music.id,
                    "audio": music.audio,
                    "image": music.image,
                    "category_id": music.category_id,
                    "title": music.title,
                    "artist_id": music.artist_id
                }
                serialized_genres.append(serialized_genre)
            return jsonify({
                "message": "Music added successfully",
                "musics": serialized_genres

            })
        else:
            return jsonify({"message": "Invalid request data"}), 400


@app.route('/add_musics', methods=["GET"])
def add_musics():
    musics = Songs.query.all()
    music_list = []
    for music in musics:
        music_list.append({
            "id": music.id,
            "audio": music.audio,
            "image": music.image,
            "category_id": music.category_id,
            "title": music.title,
            "artist_id": music.artist_id
        })
    return jsonify(music_list)


@app.route('/art')
def art():
    return render_template('artist.html')


@app.route('/artist', methods=["POST"])
def artist():
    artist_data = request.get_json().get("artists")
    if artist_data:
        artist = artist_data.get("artist")
        add = Artists(artist=artist)
        db.session.add(add)
        db.session.commit()

        return jsonify({
            "message": "Artist added successfully",
            "music": {
                "artist": artist

            }
        })
    else:
        return jsonify({"message": "Invalid request data"}), 400


@app.route('/get_artist', methods=["GET"])
def get_artist():
    artists = Artists.query.all()
    artist_list = []
    for artist in artists:
        artist_list.append({
            "artist": artist.artist
        })
    return jsonify(artist_list)


@app.route('/search')
def search():
    current_user = current_us()
    categories = Categories.query.all()
    artists = Artists.query.all()
    songs = Songs.query.all()
    return render_template('search.html', categories=categories, songs=songs, current_user=current_user,
                           artists=artists)


@app.route('/filter_music', methods=['GET'])
def filter_music():
    category_id = request.args.get('category_id')
    artist_id = request.args.get('artist_id')
    searched = request.args.get('searched')
    if category_id and artist_id:
        songs = Songs.query.filter(Songs.category_id == category_id, Songs.artist_id == artist_id).all()
    elif category_id:
        songs = Songs.query.filter(Songs.category_id == category_id).all()
    elif artist_id:
        songs = Songs.query.filter(Songs.artist_id == artist_id).all()
    elif searched:
        if searched == "":
            songs = Songs.query.all()
        else:
            songs = Songs.query.filter(Songs.title.ilike('%' + searched + '%')).all()

    else:
        songs = Songs.query.all()

    songs_list = []
    for song in songs:
        songs_list.append({
            'id': song.id,
            'audio': song.audio,
            'image': song.image,
            'category_id': song.category_id,
            'title': song.title,
            'artist_id': song.artist_id
        })

    return jsonify(songs_list)


if __name__ == '__main__':
    app.run()
