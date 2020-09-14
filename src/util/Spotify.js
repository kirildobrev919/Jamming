let accessToken;
//let url = 'https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123';
const authorizeUrl = 'https://accounts.spotify.com/authorize';
const clientID = '';
const redirectURI = 'http://localhost:3000/';
let userId; //i will need var instead const

const Spotify = {

    getAccessToken() {

        if (accessToken) {
            return accessToken;
        }

        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expires_in = Number(expiresInMatch[1]);

            //this will clear the parameters if access token axpires and will let us get new acces token
            window.setTimeout(() => accessToken = '', expires_in * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `${authorizeUrl}?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location.replace(accessUrl);
        }
    },

    async getCurrentUserId() {

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        //get the current user ID
        const response = await fetch('https://api.spotify.com/v1/me', { headers: headers }
        );
        const jsonResponse = await response.json();
        userId = jsonResponse.id;
    },

    search(term) {

        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }

            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },

    getUserPlaylists() {

        //const theCors = 'https://cors-anywhere.herokuapp.com/'; when usitn userId
        if (!accessToken) {
            accessToken = this.getAccessToken();
        }

        if (!userId) {
            userId = this.getCurrentUserId();
        }

        return fetch(`https://api.spotify.com/v1/me/playlists`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => response.json()
        ).then(jsonResponse => {
            if (!jsonResponse.items) {
                return [];
            }

            return jsonResponse.items.map(list => ({
                id: list.id,
                name: list.name,
            }));
        })
    },

    getPlaylist(playlistId) {

        if (!accessToken) {
            accessToken = this.getAccessToken();
        }

        if (!userId) {
            userId = this.getCurrentUserId();
        }

        //will return the tracks from selected playlist by playlist id
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => response.json()
        ).then(jsonResponse => {
            debugger;
            if (!jsonResponse.items) {
                return [];
            }

            return jsonResponse.items.map(item => ({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                uri: item.track.uri
            }))
        })
    },

    savePlaylist(name, trackUris) {

        if (!name || !trackUris.length) {
            return;
        }

        if (!userId) {
            userId = this.getCurrentUserId();
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ uris: trackUris })
                    })
            })
    }
}

export default Spotify;
