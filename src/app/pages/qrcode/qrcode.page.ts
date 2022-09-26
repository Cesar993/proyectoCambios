import { Component, OnInit } from '@angular/core';
import { v4 } from 'uuid';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {

  //VAMOS A CREAR LAS VARIABLES PARA NUESTRO CÓDIGO QR:
  elementType = 'canvas';
  value = '';

  constructor() { }

  ngOnInit() {
    
  }

  //método para generar un código unico para el codigo QR:
  generarCodigo(){
    if (this.value == '') {
      this.value = v4();
    }
  }

}
