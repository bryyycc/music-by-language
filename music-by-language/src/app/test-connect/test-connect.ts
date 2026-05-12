import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
// import { JsonPipe } from '@angular/common';
import {iso6393} from 'iso-639-3'

function iso6393ToName(code: string): string | null {
    if (typeof code !== "string" || code.length !== 3) {
        throw new Error("Invalid ISO 639-3 code. Must be a 3-letter string.");
    }

    const lang = iso6393.find(lang => lang.iso6393.toLowerCase() === code.toLowerCase());
    return lang ? lang.name : null;
}

@Component({
  selector: 'app-test-connect',
  imports: [],
  templateUrl: './test-connect.html',
  styleUrl: './test-connect.scss',
})

export class TestConnect implements OnInit {
  //first test: see if you can get the language of a song from musicbrainz :)
  //bb62099a-16fc-4e79-b0a1-cbdf79a250b7 :: MBID for *release* (not recording) of "СВЕТЛАНА!" by NEXTIME 
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  public response: any; // Store the fetched data here
  public artResponse: any;
  public title: string | null = null;
  public artist: string[] | null = null; 
  public lang: string | null = null; // Store the extracted language here
  public coverArt: string | null = null;
  public mbid: string | null = null;
  constructor(){
    
  }

  

  async ngOnInit(): Promise<void> {
    try {
      //  this.response = await firstValueFrom(this.http.get('https://musicbrainz.org/ws/2/release/c20b9cc7-34e4-4f2b-b7e8-749043df3cc3/disc/1#fb9c8d30-6c37-40b8-a913-2dd1e4df38b5?fmt=json'));
      
      this.mbid = 'bb62099a-16fc-4e79-b0a1-cbdf79a250b7';

      this.response = await firstValueFrom(this.http.get('https://musicbrainz.org/ws/2/release/' + this.mbid + '?inc=artist-credits&fmt=json'));
       //svetlana mbid: bb62099a-16fc-4e79-b0a1-cbdf79a250b7
       //
      // console.log('Release data:', response);
      // this.data = JSON.stringify(response);
      // TODO: Extract language from response if available
      if(this.response){
        let langCode = this.response['text-representation'].language;
        if(this.response['text-representation'].language){
          console.log('Language Code:', langCode);
          
          //TODO: convert langCode from ISO 639-3 code into full language name :)
          this.lang = iso6393ToName(langCode);
          console.log(this.lang);
        }
        else{
          console.log('doesnt exist :(');
        }

        //Get the song title and artist and display them
        if(this.response.title){
          this.title = this.response.title;
          console.log(this.title);
        }

        let artistName = this.response['artist-credit'][0].name
        if( this.response['artist-credit']){
          this.artist = artistName;
          console.log(this.artist);
        }

        //get cover art
        // let artId = "bb62099a-16fc-4e79-b0a1-cbdf79a250b7";
        if(this.response['cover-art-archive'].front){
           this.artResponse = await firstValueFrom(this.http.get('https://coverartarchive.org/release/' + this.mbid));
          // this.coverArt = 'coverartarchive.org/release/' + artId + '/front'; 
          this.coverArt = this.artResponse.images[0].image;
          console.log(this.artResponse);
        }
       




        //this should be the last thing
        this.cdr.detectChanges();

      }
    } catch (error) {
      console.error('Error fetching release data:', error);
    }
  }

  

   

}
