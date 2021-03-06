import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from "../../../../../environments/environment";

const baseUrl = 'cursos';

@Injectable({
    providedIn: 'root'
})
export class CoursesService
{

    /**
     * Constructor
     */
    constructor(private http: HttpClient)
    {
    }

      getAll(): Observable<[]> {
        return this.http.get<[]>(environment.API_G + baseUrl);
      }

      getLessonByCurso(id: any): Observable<[]> {
        return this.http.get<[]>(environment.API_G +`lecciones?curso_id=${id}`);
      }

      createBoard(): Observable<[]> {
        return this.http.get<[]>(environment.API_G + baseUrl + `/create-board`);
      }

      viewBoard(id: any): Observable<[]> {
        return this.http.get<[]>(environment.API_G + baseUrl + `/view-board/${id}`);
      }

      getCategorias(): Observable<[]> {
        return this.http.get<[]>(environment.API_G + baseUrl + '/categorias');
      }

      getCursosEtapa(etapa: any): Observable<[]> {
        return this.http.get<[]>(environment.API_G + baseUrl + `?etapa=${etapa}`);
      }
    
      get(id: any): Observable<any> {
        return this.http.get(environment.API_G +`${baseUrl}/${id}`);
      }

      changeLesson(id: any): Observable<any> {
        return this.http.get(environment.API_G +`${baseUrl}/change-lesson/${id}`);
      }
    
      create(data: any): Observable<any> {
        return this.http.post(environment.API_G + baseUrl, data);
      }

      createTxt(data: any): Observable<any> {
        return this.http.post(environment.API_G + baseUrl + '/create-txt', data);
      }
    
      update(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +`${baseUrl}/${id}`, data);
      }
    
      updatePassword(id: any, data: any): Observable<any> {
        return this.http.put(environment.API_G +'auth/update-password/'+id, data);
      }
    
      delete(id: any): Observable<any> {
        return this.http.delete(environment.API_G +`${baseUrl}/${id}`);
      }
    
      deleteAll(): Observable<any> {
        return this.http.delete(environment.API_G + baseUrl);
      }
    
      findByNombre(nombre: any): Observable<[]> {
        return this.http.get<[]>(environment.API_G +`${baseUrl}?nombre=${nombre}`);
      }

 
}
