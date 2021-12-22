import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required],
  })

  // llenar selectores
  regiones : string[]    = [];
  paises   : PaisSmall[] = [];
  // fronteras: string[]    = [];
  fronteras: PaisSmall[] = [];

  // UI
  cargando: boolean = false;


  constructor( private fb:FormBuilder,
               private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Cuando cambie la region

    
    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe( region => {
    //     console.log(region);
    //     this.paisesService.getPaisesPorRegion( region )
    //       .subscribe( paises => {
    //         console.log(paises);
    //         this.paises = paises;
    //       })
    //   })

      // switchmap() Toma el valor producto de un observable y a su vez lo muta y regresa el valor de otro observable.
    
    this.miFormulario.get('region')?.valueChanges
      .pipe( // pipe me ayuda a transformar el valor que venga de miFormulario
        // switchmap() Toma el valor producto de un observable y a su vez lo muta y regresa el valor de otro observable.
        tap( ( _ ) => {// hace efectos secundarios
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
          // this.miFormulario.get('frontera')?.disable();
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
      )
      .subscribe( paises => {
        // console.log( paises );
        this.paises = paises;
        this.cargando = false;

      })

      // Cuando cambia el pais
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( () => {
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo ) ),
          switchMap( pais => this.paisesService.getPaisesPorFronteras( pais?.borders! ) )
        )
        .subscribe( paises =>{
          // console.log(pais);
          // this.fronteras = pais?.borders || [];

          // console.log(paises);
          this.fronteras = paises;

          this.cargando = false;

        })
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
