import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import Clicklist from './Clicklist';
import Song from './Song';
import { Client } from './Client';
import axios from 'axios';

const App = () => {

  const clientCreds = Client();

  console.log('test');

  const [token, setToken] = useState('');
  const [searchResult, setSearchResult] = useState({selectedItem: '', listOfResultsFromAPI: []});
  const [recommendations, setRecs] = useState({selectedRec: '', listOfRecsFromAPI: []});
  const [selectedSeeds, setSeeds] = useState({listOfSelectedSeeds: []});
  const [songInformation, setSongInfo] = useState(null);

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
        console.log('new call' + genRes.data.genres);
        const generatedTracks = [];
        for (let i = 0; i < genRes.data.genres.length; i++) {
          generatedTracks.push({value: genRes.data.genres[i], name: genRes.data.genres[i]});
        }
        console.log(generatedTracks);
        setSearchResult({
          selectedItem: searchResult.selectedItem,
          listOfResultsFromAPI: generatedTracks
        })
      });
    });
  }, [clientCreds.ClientId, clientCreds.ClientSecret]);

  const selectItem = val => {
    if (val !== 'Select' && selectedSeeds.listOfSelectedSeeds.length < 5) {
      setSearchResult({
        selectedItem: val,
        listOfResultsFromAPI: searchResult.listOfResultsFromAPI
      });
      let tempList = selectedSeeds.listOfSelectedSeeds;
      tempList.push({name:val});
      setSeeds({
        listOfSelectedSeeds: tempList
      })
      console.log(selectedSeeds.listOfSelectedSeeds);
    } else if (selectedSeeds.listOfSelectedSeeds.length >= 5) {
      console.log('Overflow');
    }
  }

  const submit = () => {
    if (selectedSeeds.listOfSelectedSeeds.length > 0) {
      let url = 'https://api.spotify.com/v1/recommendations';
      let gens = [];
      selectedSeeds.listOfSelectedSeeds.forEach(function(curr) {
        gens.push(curr.name);
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
        console.log('hm' + recommendations.listOfRecsFromAPI);
        console.log(recsResponse.data.tracks);
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
    console.log('clicked value: ' + val.id);
    function isSong(item) {
      console.log('item name: ' + item.name);
      if (val.id !== item.name) return true;
      return false;
    }
    let newList = selectedSeeds.listOfSelectedSeeds.filter(isSong);
    setSeeds({
      listOfSelectedSeeds: newList
    });
  }

  const selectSong = val => {
    console.log('selected song: ' + val);
    let selectedSong = recommendations.listOfRecsFromAPI.filter(t => t.name === val.id);
    console.log('this ' + selectedSong[0].name);
    pullUpSongPopUp(selectedSong[0]);
  }

  const pullUpSongPopUp = val => {
    console.log('selected track: ' + val.name);
    setSongInfo(val);
  }

  return (
    <div>
      <Dropdown options={searchResult.listOfResultsFromAPI} selected={searchResult.selectedItem} changed={selectItem}/>
      <Clicklist items={selectedSeeds.listOfSelectedSeeds} clicked={removeGenre}/>
      <button onClick={submit}>Submit</button>
      <div>
        <Clicklist items={recommendations.listOfRecsFromAPI} clicked={selectSong}/>
        {songInformation && <Song {...songInformation}/>}
      </div>
    </div>
  );
}

export default App;
