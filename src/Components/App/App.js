import React from 'react';
import './App.css';
import {SearchBar} from './../SearchBar/SearchBar'
import {SearchResults} from './../SearchResults/SearchResults';
import {Playlist} from './../PlayList/Playlist';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playlistName: "My Custom playlist",
      playlistTracks: [{
        name: "CustName1",
        artist: "CustArtist1",
        album: "custAlbum1",
        id: 11
      },
      {
        name: "CustName2",
        artist: "CustArtist2",
        album: "CustAlbum2",
        id: 12
      },
      {
        name: "CustName3",
        artist: "CustArtist3",
        album: "CustAlbum3",
        id: 13
      }],
      searchResults: [{
        name: "name1",
        artist: "artist1",
        album: "album1",
        id: 1
      },
      {
        name: "name2",
        artist: "artist2",
        album: "album2",
        id: 2
      },
      {
        name: "name3",
        artist: "artist3",
        album: "album3",
        id: 3
      }]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let currentList = this.state.playlistTracks;
    if(currentList.find(item => item.id === track.id)){
      return;
    }
    currentList.push(track);
    this.setState({playlistTracks: currentList});
  }

  removeTrack(track) {
    let currentList = this.state.playlistTracks;
    currentList = currentList.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: currentList});
  }
  
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    alert("The method is linked to the button correctly!");
    let trackURIs = this.state.playlistTracks.map(item => item.uri);
  }

  search(term) {
    console.log(term);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
