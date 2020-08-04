import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            term: "Enter A Song, Album, or Artist"
        }

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(event) {
        this.setState({term: event.target.value});
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder={this.state.term} onChange={this.handleTermChange} />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        );
    }
}