import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Unidad} from "@isc/api/unidad";
import {Reporte} from "@isc/api/reporte";
import {Estado} from "@isc/api/estado";
import {UnidadService} from "@isc/api/unidad.service";
import {EstadoService} from "@isc/api/estado.service";
import {FolioService} from "@isc/api/folio.service";
import {ReporteService} from "@isc/api/reporte.service";
import {accion, FolioUtils} from "@isc/toolkit/folio-utils";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {ErrorService} from "@isc/shared/service/error.service";
import {TicketData} from "@isc/core/ticket.data";
import {AdministrarHandlerService} from '@isc/modulo/service/administrar-handler.service';

@Component({
  selector: 'app-registro', templateUrl: './registro.component.html', styleUrl: './registro.component.scss'
})
export class RegistroComponent implements OnInit, OnDestroy {
  formReporte: FormGroup
  unidades: Unidad[] | undefined;
  areas: Reporte[] | undefined;
  reportes: Reporte[] | undefined;
  estados: Estado[] | undefined;
  esperar: boolean
  deshabilitarFolio = true;
  visibleDialog: boolean;
  activarDetalles: boolean;
  protected folio: TicketData

  protected errorService = inject(ErrorService)
  private areaSubscription: Subscription
  private unidadSubscription: Subscription
  private estadoSubscription: Subscription
  private folioSubscription: Subscription

  private adminHandlerService = inject(AdministrarHandlerService);
  private unidadService = inject(UnidadService);
  private estadoService = inject(EstadoService);
  private folioService = inject(FolioService);
  private reporteService = inject(ReporteService);

  constructor(private fb: FormBuilder) {
    this.formReporte = this.fb.group({
      unidad: [null, Validators.required],
      area: [null, Validators.required],
      reporte: [null, Validators.required],
      agente: [null],
      estado: [null],
      detalles: [null],
      folio: [null, Validators.required]
    })
  }

  ngOnDestroy(): void {
    this.areaSubscription?.unsubscribe();
    this.estadoSubscription?.unsubscribe();
    this.unidadSubscription?.unsubscribe();
    this.folioSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.obtenerUnidades();
    this.obtenerEstados();
    this.obtenerAreas();
    this.eventoAreaSeleccion()
  }

  async registrar() {
    this.esperar = true
    if (this.formReporte.invalid) {
      this.formReporte.markAllAsTouched()
    } else {
      const data = FolioUtils.construirDataFolio(accion.Registrar, this.formReporte.value, null)
      this.folioSubscription = this.folioService.registrar(data).subscribe({
        next: value => {
          if (value.code == 200) {
            this.folio = {
              folio: this.formReporte.get('folio').value,
              estado: this.formReporte.get('estado').value ? this.formReporte.get('estado').value.nombre : '',
              unidad: this.formReporte.get('unidad').value.clave + ' ' + this.formReporte.get('unidad').value.nombre,
              area: this.formReporte.get('area')?.value.area.nombre,
              agente: this.formReporte.get('agente').value ? this.formReporte.get('agente').value : '',
              reporte: this.formReporte.get('reporte').value.nombre
            }
            this.visibleDialog = true
          }
        }, complete: () => this.esperar = false, error: (err: HttpErrorResponse) => this.handleRegistrationError(err)
      })
    }
  }

  estadoFolioGenerador(nombre: string) {
    this.deshabilitarFolio = ['mesa de servicio', 'telmex', 'cfe'].includes(nombre.toLowerCase());
  }

  generarFolio() {
    this.formReporte.patchValue({folio: FolioUtils.generarFolio()})
  }

  evtDetalles() {
    this.activarDetalles = true
  }

  private obtenerAreas() {
    this.areaSubscription = this.reporteService.obtenerReportesPorArea().subscribe({
      next: value => this.areas = value.data
    })
  }

  private obtenerUnidades() {
    this.unidadSubscription = this.unidadService.obtenerUnidades().subscribe({
      next: (t) => this.unidades = t.data,
      error: (err) => this.adminHandlerService.httpHandlerServiceError(err, 'Unidades', true)
    });
  }

  private obtenerEstados() {
    this.estadoSubscription = this.estadoService.obtenerEstado().subscribe({
      next: (t) => this.estados = t.data,
      error: (err) => this.adminHandlerService.httpHandlerServiceError(err, 'Estados de operación', true)
    });
  }

  private eventoAreaSeleccion() {
    this.formReporte.get('area')?.valueChanges.subscribe(value => {
      if (value) {
        this.reportes = value.reportes
        this.estadoFolioGenerador(value.area.nombre)
      } else {
        this.reportes = []
        this.formReporte.patchValue({'reporte': null})
        this.deshabilitarFolio = true
      }
    })
  }

  private handleRegistrationError(err: HttpErrorResponse) {
    this.esperar = false;
    if (err.status === HttpStatusCode.Conflict) {
      this.formReporte.get('folio').setErrors({'invalido': true});
      console.log(this.formReporte.get('folio').hasError('invalido'));
    }
  }
}
