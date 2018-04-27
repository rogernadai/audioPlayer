import { Component,Element } from '@stencil/core';


@Component({
  tag: 'page-add-album',
  styleUrl: 'page-add-album.scss'
})

export class PageAddAlbum {

  @Element() el: any;
  albumObj: any = {};
  dismiss(){
    (this.el.closest('ion-modal') as HTMLIonModalElement).dismiss();
  }

  setValueAlbum(value,fieldName){
    console.log(value)
    this.albumObj[fieldName] = value;    
  }

  saveAlbum(){
    const body = `strJson={"script1":{"parameters":{"p1":{"name":"p_url_image","direction":"IN","type":"VARCHAR","value":"`+this.albumObj['urlImage']+`"},"p2":{"name":"p_url_music","direction":"IN","type":"VARCHAR","value":"`+this.albumObj['urlMusic']+`"},"p3":{"name":"p_name_music","direction":"IN","type":"VARCHAR","value":"`+this.albumObj['musicName']+`"},"p4":{"name":"p_name_author","direction":"IN","type":"VARCHAR","value":"`+this.albumObj['musicAuthor']+`"},},"function":"sibd0006.inserir_audio_data"}}&user=SC558835&token=TLa2BlkI/pHbFul0rhYNmSpwHMJ%2BqjYS/ATEeFCR9G2EymtEc9qC8sYYQ5nv0o3tmS3TagFqqtXi%2BGZon0M9bFpN8X2Blr8hsdMGi2G95ioOwOugN1eoIwK4KLkbanh8dwtwH8QeQpZfMl9pSlbIfg==`
    console.log(body);
    const myRequest = new Request('http://mcsbuilder:7010/MCS-be-H/execute/tunel/', {method: 'POST', body: body});
    
    fetch(myRequest)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Something went wrong on api server!');
        }
      })
      .then(response => {
        console.debug(response);  
        (document.querySelector('my-component') as any).getListAlbum();
        this.dismiss();     
        
      }).catch(error => {
        console.error(error);
      });
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>
            Adicionar Album
          </ion-title>
          <ion-buttons slot="end">
            <div onClick={()=> {this.dismiss()}}>
              X
            </div>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-list>
          <ion-item>
            <ion-label>
              Nome da música
            </ion-label>
            <ion-input name="musicName" onIonBlur={(ev)=>{this.setValueAlbum((ev.srcElement as any).value,"musicName")}} ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>
              Nome Autor
            </ion-label>
            <ion-input name="musicAuthor" onIonBlur={(ev)=>{this.setValueAlbum((ev.srcElement as any).value,"musicAuthor")}} ></ion-input>
          </ion-item>          
          <ion-item>
            <ion-label>
              Url Imagem
            </ion-label>
            <ion-input name="urlImage" onIonBlur={(ev)=>{this.setValueAlbum((ev.srcElement as any).value,"urlImage")}} ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>
              Url Musica
            </ion-label>
            <ion-input name="urlMusic" onIonBlur={(ev)=>{this.setValueAlbum((ev.srcElement as any).value,"urlMusic")}} ></ion-input>
          </ion-item>        
        </ion-list>  
        <div>
          <ion-button mode="ios" expand="full" onClick={()=> {this.saveAlbum()}}>Confirmar</ion-button>
        </div>
      </ion-content>
    ];
  }
}