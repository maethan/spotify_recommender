import React from 'react';

const Song = ({album, artists, name}) => {
    return (
        <div>
            <div>
                <img
                    src={album.images[0].url}
                    alt={name}/>
            </div>
            <div>
                <label htmlFor={name}/>
                Song Title: {name}
            </div>
            <div>
                <label htmlFor={artists[0].name}/>
                Artist: {artists[0].name}
            </div>
        </div>

    )
}

export default Song;