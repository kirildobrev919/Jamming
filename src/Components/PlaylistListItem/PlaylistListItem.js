import React from 'react';
import './../PlaylistListItem/PlaylistListItem.css';

export class PlaylistListItem extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.name}</h3>
                </div>
            </div>
        )
    }
}