import { Component, Method, State, Element, Prop } from '@stencil/core';
import moment from 'moment';
import { ModalController } from '@ionic/core';

@Component({
  tag: 'audio-player',
  styleUrl: 'audio-player.scss'
})
export class AudioPlayer {
  
  
  @State() status: string = 'stopped';
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: ModalController;
  @Element() el: any;
  audioTag: any;
  timerTag: any;
  timerDer: any;
  progressValue: any;
  volumeValue: any;


  @Method()
  log(string){
    console.log('Log: '+ string)
  }

  @Method()
  play(url){
    if (this.status && this.status !== 'stopped') {
      this.audioTag.pause();
      this.audioTag.remove();
    }
    console.log(url);
    this.audioTag = document.createElement('audio');
    let sourceTag = document.createElement('source');
    sourceTag.setAttribute('src',url);
    sourceTag.setAttribute('type','audio/mpeg');
    this.audioTag.appendChild(sourceTag);  
    this.audioTag.onended = () => {this.stop()};
    this.timerTag = this.el.querySelector('#timer');
    this.progressValue = this.el.querySelector('.progress-bar-value');
    this.audioTag.ontimeupdate = () => {
      this.timerTag.innerHTML = moment().hour(0).minutes(0).seconds(Math.floor(this.audioTag.currentTime)).format('HH:mm:ss') + ' - ';
      this.progressValue.style.width = ((Math.floor(this.audioTag.currentTime) * 100) / Math.floor(this.audioTag.duration)) + '%';
    };   
    this.audioTag.addEventListener('loadedmetadata', () => { 
      this._play();  
      this.el.forceUpdate();
    });
  }
  @Method()
  pause(){
    this.audioTag.pause();
    this.status = 'paused';
  }

  @Method()
  stop(){
    this.audioTag.pause();
    this.audioTag.currentTime=0;
    this.timerTag.innerHTML = '';
    this.status = 'stopped';
  }

  private _play(){
    this.audioTag.play();   
    this.status = 'playing';
  }

  private _progress(ev){
    console.log(ev);
    let percTime = ((ev.offsetX *100) / ev.srcElement.clientWidth);
    this.progressValue.style.width = percTime + '%';   
    this.audioTag.currentTime = (Math.floor(this.audioTag.duration) * percTime) / 100;
  }

  private _volume(ev){
    console.log(ev);
    let percVol = 100 - ((ev.offsetY *100) / ev.srcElement.clientHeight);
    this.volumeValue = this.el.querySelector('.volume-controls-value');
    this.volumeValue.style["margin-top"] = ev.offsetY + 'px';   
    this.audioTag.volume = (percVol / 100);
    console.log(percVol)
  }

  async openAddAlbumModal(){
    const modal = await this.modalCtrl.create({
      component: 'page-add-album'    
    });    
    //modal.onDidDismiss;
    await modal.present(); 
  }

  render() {
    console.log('Render ' + this.status);
    return (
      <div class="audio-container">        
        <div class="audio-controls">
          {this.status === 'playing'?
            <span>
              <ion-icon name="pause" onClick={()=> {this.pause()}}></ion-icon>                        
            </span>:
            this.status === 'paused'?
            <span>
              <ion-icon name="play" onClick={()=> {this._play()}}></ion-icon>
            </span>:null  
          }  
          {this.status !== 'stopped'?
            <span>              
              <ion-icon name="square" onClick={()=> {this.stop()}}></ion-icon> 
              <div class='volume'>                
                <ion-icon name="volume-mute" onClick={()=> {
                  this.el.querySelector('.volume').classList.toggle('volume-open');
                }}></ion-icon>    
                                     
                <div class='volume-controls'>
                  <div class='volume-controls-bar' onClick={(ev)=> {this._volume(ev)}}>
                    <div class='volume-controls-value'>
                    </div>
                  </div>  
                </div>
              </div>  
            </span>:null
          }   
          <div class="timer-container">
            <span id="timer"> 
                        
            </span> 
            {this.status !== 'stopped'?            
              <span id="duracao">
                {moment().hour(0).minutes(0).seconds(Math.floor(this.audioTag.duration)).format('HH:mm:ss')}
              </span>:null    
            }   
          </div>   
          <div class="progress-bar" onClick={(ev)=> {this._progress(ev)}}>
            <div class="progress-bar-value"></div>
          </div>  
        </div>           
        <div class="audio-add">
          <ion-icon name="add" onClick={()=> {this.openAddAlbumModal()}}></ion-icon>
        </div>
      </div>
    );
  }
}