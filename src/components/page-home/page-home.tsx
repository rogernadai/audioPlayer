import { Component, Element, State, Method } from '@stencil/core';

declare var firebase: any;

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.scss'
})
export class PageHome {

  @Element() el: any;
  audioPlayerEl;
  @State() listAlbum:Array<any> = []; 
      
  componentDidLoad(){
    this.audioPlayerEl = this.el.querySelector('audio-player');
    console.log(this.audioPlayerEl);
    this.audioPlayerEl.log('Mensagem de Log !!!');
  }

  callAudioPlayer(url,ev){
    let elements = document.getElementsByClassName('album-sel-cor');
    if (elements.length > 0){
      elements[0].classList.remove('album-sel-cor');
    }
    (ev.srcElement.closest('ion-col') as any).classList.toggle('album-sel-cor');
    this.audioPlayerEl.play(url);
  } 

  componentWillLoad(){
    this.getListAlbum();  
  }

  @Method()
  getListAlbum(){
    // const body = `strJson={"script1":{"parameters":{"p1":{"name":"p_lista","direction":"OUT","type":"CURSOR"}},"function":"sibd0006.rec_lst_discos"}}&user=SC558835&token=TLa2BlkI/pHbFul0rhYNmSpwHMJ%2BqjYS/ATEeFCR9G2EymtEc9qC8sYYQ5nv0o3tmS3TagFqqtXi%2BGZon0M9bFpN8X2Blr8hsdMGi2G95ioOwOugN1eoIwK4KLkbanh8dwtwH8QeQpZfMl9pSlbIfg==`
    // const myRequest = new Request('http://mcsbuilder:7010/MCS-be-H/execute/tunel/', {method: 'POST', body: body});
    
    // fetch(myRequest)
    //   .then(response => {
    //     if (response.status === 200) {
    //       return response.json();
    //     } else {
    //       throw new Error('Something went wrong on api server!');
    //     }
    //   })
    //   .then(response => {
    //     console.debug(response['script1']);
    //     this.listAlbum = response['script1'];
        
    //   }).catch(error => {
    //     console.error(error);
    //   });
    let listAlbumTemp:Array<any> = []; 
    firebase.firestore().collection("albums").get().then((albumsSnapshot)=> {
      albumsSnapshot.forEach(albumDoc => {
        listAlbumTemp.push(albumDoc.data())        
      });
    
      this.listAlbum = listAlbumTemp;    

   })
  }
  
  render() {
    let albumsEl = this.listAlbum.map(album => {
      return(
        <ion-col col-6 col-sm-4 col-md-3 col-lg-2 onClick={(ev)=> {this.callAudioPlayer(album.urlMusic,ev)}}>
          <img class="album" src={album.urlImage} alt={album.nameAuthor}>
          </img>
          <div class="album-sel">{album.nameMusic}</div>
        </ion-col>
      )
    })

    return (
      <div>
        <audio-player></audio-player>
        <div class="album-container">
          <ion-grid class="grid-album">
            <ion-row>
              {albumsEl}
            </ion-row>  
          </ion-grid>          
        </div>
      </div>
    );
  }
}
