import React from 'react';
import Spotify from '../../util/Spotify';
import './PlaylistList.css';
import { PlaylistListItem } from './../PlaylistListItem/PlaylistListItem';

export class PlaylistList extends React.Component {

    constructor(props) {
        super();

        this.state = {
            playlists: []
        }
    }

    UNSAFE_componentWillMount() {
        Spotify.getUserPlaylists().then(listsResult => (
            this.setState({
                playlists: listsResult
            })
        ))
    }

    render() {
        return (
            <div className="Playlist">
                <h2>My Playlits</h2>
                <p className='Hint'>Refresh the page to see changes in the names!</p>
                {
                    this.state.playlists.map(item => {
                        return <PlaylistListItem
                            key={item.id}
                            itemKey={item.id}
                            name={item.name}
                            selectPlaylist={this.props.selectPlaylist} />
                    })
                }
            </div>
        );
    }
}