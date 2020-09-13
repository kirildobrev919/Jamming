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
                {
                    this.state.playlists.map(item => {
                        return <PlaylistListItem key={item.id} name={item.name} />
                    })
                }
            </div>
        );
    }
}