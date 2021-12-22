import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  
  private baseUrl: string = 'https://restcountries.com/v2'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones]
    // regresa un nuevo arreglo, pero desestructurado
    // se hace de esta manera para evitar que los datos se pasen por referencia
  }

  constructor( private http:HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]>{
    const url: string = `${ this.baseUrl }/region/${ region }?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>( url );
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null>{
    if (!codigo) {
      return of(null)
    }
    const url: string = `${ this.baseUrl }/alpha/${ codigo }`;
    return this.http.get<Pais>( url );

  }

  getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall>{
    const url: string = `${ this.baseUrl }/alpha/${ codigo }?fields=alpha3Code,name`;
    return this.http.get<PaisSmall>( url );
  }

  getPaisesPorFronteras( borders: string[] ): Observable<PaisSmall[]>{
    if( !borders ){
      return of([]); // si el pais no tiene fronteras regresa un arreglo vacio
    }
    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach( codigo => { // codigos: 'MEX' o 'USA'  , por ejemplo
      const peticion = this.getPaisPorCodigoSmall(codigo); // guarda en peticion la url con el codigo de 'MEX'
      peticiones.push(peticion); //  almacena peticion en el arreglo de peticiones
    });
    return combineLatest( peticiones ); // combineLatest() dispara todas las peticiones de manera simultanea
  }
}

