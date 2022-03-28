import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageuploadService {

  constructor(private http: HttpClient) { }

  imageUpload(name: string, profileImage: File): Observable<any> {
    var formData: any = new FormData();
    formData.append("name", name);
    formData.append("image", profileImage);
  
    return this.http.post('http://localhost:8080/upload/image/', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }
  vievImage(image: any){

    return this.http.get('http://localhost:8080/get/image/info/' + image);
  }
  
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.log(error);
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
