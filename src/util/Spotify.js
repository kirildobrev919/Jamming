let accessToken;
//let url = 'https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=3600&state=123';
const clientID = '';
const redirectURI = 'http://localhost:3000/';

const Spotify = {

    getAccessToken() {
        debugger;
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
        }else{
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessUrl;
        }
    },

    search(term) {

        debugger;
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
                artist: track.artist[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },
    
    savePlaylist(name, trackUris) {

        debugger;
        if(!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;

        //get the current user ID
        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response =>  response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
            {
                headers: headers,
                method: 'POST',
                name: JSON.stringify({name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                })
            })
        })
        
        //POST the playlist with the name to the user account and get the playlist ID
        //	https://api.spotify.com/v1/users/${userId}/playlists
        
        //POST the array of URIs and referencing user ID and playlist ID
    }
}

export default Spotify;