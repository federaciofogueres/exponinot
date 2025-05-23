import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Puntuacion } from '../../models/puntuacion.model';
import { NinotsService } from '../../services/ninots.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-enviar-puntuacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enviar-puntuacion.component.html',
  styleUrls: ['./enviar-puntuacion.component.scss']
})
export class EnviarPuntuacionComponent {
  @Output() close = new EventEmitter<void>();
  @Input() ninotId = "-1";

  critica = 0;
  pintura = 0;
  acabado = 0;
  modelado = 0;

  constructor(private ninotService: NinotsService, private alertService: AlertService) { }

  enviar(): void {
    const data: Puntuacion = {
      critica: this.critica,
      pintura: this.pintura,
      acabado: this.acabado,
      modelado: this.modelado,
      fecha: new Date()
    };

    this.ninotService.enviarPuntuacion(this.ninotId, data)
      .then((response) => {
        if (response.type === 'danger') {
          this.alertService.danger(response.message)
        } else if (response.type === 'success') {
          this.alertService.success(response.message)
        }
        this.close.emit()
      })
      .catch(error => alert(error.message));
  }

}
