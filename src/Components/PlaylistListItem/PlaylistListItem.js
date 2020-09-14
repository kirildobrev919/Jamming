import React from 'react';
import './../PlaylistListItem/PlaylistListItem.css';

export class PlaylistListItem extends React.Component {

    constructor(props) {
        super();

        this.getPlaylistId = this.getPlaylistId.bind(this);
    }

    getPlaylistId(e) {
        debugger;
        this.props.selectPlaylist(this.props.itemKey, this.props.name);
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information" onClick={this.getPlaylistId}>
                    <h3>{this.props.name}</h3>
                </div>
            </div>
        )
    }
}