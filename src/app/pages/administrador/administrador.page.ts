import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  //variable grupo:
  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]')]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    ap_paterno: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fecha_nac: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@(duoc|duocuc|profesor.duoc).(cl)')]),
    clave: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    tipo_usuario: new FormControl('', [Validators.required]),
  });
  repetir_clave: string;
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService, private alertController: AlertController, private validaciones: ValidacionesService) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  //métodos:
  registrar() {
    if (!this.validar()) {
      return;
    }

    if (this.usuarioService.addUsuario(this.usuario.value)) {
      alert('Usuario registrado!');
      this.usuario.reset();
      this.repetir_clave = '';
    } else {
      alert('Usuario ya existe!');
    }
  }

  buscar(rutBuscar) {
    var usuarioEncontrado = this.usuarioService.getUsuario(rutBuscar);
    this.usuario.setValue(usuarioEncontrado);
    this.repetir_clave = usuarioEncontrado.clave;
  }

  async eliminar(rutEliminar) {
    const alert = await this.alertController.create({
      header: '¿Seguro que desea eliminar al usuario de rut ' + rutEliminar + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('NO ELIMINA!');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.usuarioService.deleteUsuario(rutEliminar);
          },
        },
      ],
    });

    await alert.present();
  }

  modificar() {
    if (!this.validar()) {
      return;
    }

    this.usuarioService.updateUsuario(this.usuario.value);
    alert('Usuario modificado!');
    this.usuario.reset();
  }

  //método para validar:
  validar() {
    if (!this.validaciones.validarRut(this.usuario.controls.rut.value)) {
      alert('Rut incorrecto!');
      return false;
    }

    if (!this.validaciones.validarEdadMinima(17, this.usuario.controls.fecha_nac.value)) {
      alert('Edad mínima 17 años!');
      return false;
    }

    if (this.usuario.controls.clave.value != this.repetir_clave) {
      alert('Contraseñas no coinciden!');
      return false;
    }
  }

}
