import React from 'react';
import './App.css';
import { SearchBar } from './../SearchBar/SearchBar'
import { SearchResults } from './../SearchResults/SearchResults';
import { Playlist } from './../PlayList/Playlist';
import { PlaylistList } from './../PlaylistList/PlaylistList';
import Spotify from '../../util/Spotify';


class App extends React.Component {

  constructor(props) {
    super();
    this.state = {
      playlistName: 'My Custom playlist',
      playlistTracks: [],
      searchResults: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getPlaylistId = this.getPlaylistId.bind(this);
  }

  addTrack(track) {
    let currentList = this.state.playlistTracks;
    if (currentList.find(item => item.id === track.id)) {
      return;
    }
    currentList.push(track);
    this.setState({ playlistTracks: currentList });
  }

  removeTrack(track) {
    let currentList = this.state.playlistTracks;
    currentList = currentList.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ playlistTracks: currentList });
  }

  getPlaylistId(playlistId, playlistName) {

    //fetching the tracks and the name of selected playlist and setting state
    Spotify.getPlaylist(playlistId).then(tracksResult => {
      this.setState({
        playlistName: playlistName,
        playlistTracks: tracksResult
      })
    })
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(item => item.uri);

    //call save playlist from spotify module
    //so far saves only as new playlists. Not updating
    try {
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
        debugger;
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        })
      })
    } catch (err) {
      console.log('In App, method savePlaylist - .then cannot proceed when savePlaylist returns error!');
      alert('Please add records to your playlist!');
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    }
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
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
          <div className="App-playlist">
            <PlaylistList selectPlaylist={this.getPlaylistId} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
