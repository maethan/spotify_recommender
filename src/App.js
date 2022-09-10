import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import Clicklist from './Clicklist';
import Song from './Song';
import { Client } from './Client';
import axios from 'axios';

const App = () => {

  const clientCreds = Client();

  const [token, setToken] = useState('');
  const [searchResult, setSearchResult] = useState({selectedItem: '', listOfResultsFromAPI: []});
  const [recommendations, setRecs] = useState({selectedRec: '', listOfRecsFromAPI: []});
  const [selectedSeeds, setSeeds] = useState({listOfSelectedSeeds: [{name:''}, {name:''}, {name:''}, {name:''}, {name:''}]});
  const [songInformation, setSongInfo] = useState(null);
  const [numSeeds, setNumSeeds] = useState(0);

  useEffect(() => {

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(clientCreds.ClientId + ':' + clientCreds.ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genRes => {        
        const generatedTracks = [];
        for (let i = 0; i < genRes.data.genres.length; i++) {
          generatedTracks.push({value: genRes.data.genres[i], name: genRes.data.genres[i]});
        }
        setSearchResult({
          selectedItem: searchResult.selectedItem,
          listOfResultsFromAPI: generatedTracks
        })
      });
    });
  }, [searchResult.selectedItem, clientCreds.ClientId, clientCreds.ClientSecret]);

  const selectItem = val => {

    if (val !== 'Select' && numSeeds < 5) {
      setSearchResult({
        selectedItem: val,
        listOfResultsFromAPI: searchResult.listOfResultsFromAPI
      });
      let tempList = selectedSeeds.listOfSelectedSeeds;
      tempList[numSeeds] = {name:val};
      setSeeds({ 
        listOfSelectedSeeds: tempList
      });
      setNumSeeds(numSeeds + 1);
    } else if (numSeeds >= 5) {
      console.log('Overflow');
    }
  }

  const submit = () => {
    setSongInfo(null);
    if (numSeeds> 0) {
      let url = 'https://api.spotify.com/v1/recommendations';
      let gens = [];
      selectedSeeds.listOfSelectedSeeds.forEach(function(curr) {
        if(curr.name !== '') gens.push(curr.name);
      });
      axios(url + '?limit=10&market=US&seed_genres=' + gens, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        }
      }).then(recsResponse => {
        setRecs({
          selectedRec: recommendations.selectedRec,
          listOfRecsFromAPI: recsResponse.data.tracks
        })
      });
    } else {
      console.log('empty');
      setRecs({
        selectedRec: '',
        listOfRecsFromAPI: []
      });
    }
  }

  const removeGenre = val => {
    function isSong(item) {
      if (val.id !== item.name || val.id === '') return true;
      return false;
    }

    const newList = selectedSeeds.listOfSelectedSeeds.filter(isSong);
    let count = 0;
    for (let i = newList.length; i < 5; i++) {
      newList.push({name:''});
      count += 1;
    }
    setNumSeeds(numSeeds - count);
    setSeeds({
      listOfSelectedSeeds: newList
    });
  }

  const selectSong = val => {
    let selectedSong = recommendations.listOfRecsFromAPI.filter(t => t.name === val.id);
    pullUpSongPopUp(selectedSong[0]);
  }

  const pullUpSongPopUp = val => {
    setSongInfo(val);
  }

  return (
    <div className="container">
      <label className="title">Spotify Recommendations</label>
      <Dropdown options={searchResult.listOfResultsFromAPI} selected={searchResult.selectedItem} changed={selectItem}/>
      <Clicklist items={selectedSeeds.listOfSelectedSeeds} clicked={removeGenre} label={'Selected Genres (Up to 5): '}/>
      <button onClick={submit} className="btn btn-back col-sm-1">Submit</button>
      <div>
        <Clicklist items={recommendations.listOfRecsFromAPI} clicked={selectSong} label={'Results: '}/>
        {songInformation && <Song {...songInformation}/>}
      </div>
    </div>
  );
}

export default App;
