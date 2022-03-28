import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { ImageuploadService } from './imageupload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;
  progress: number = 0;

  constructor(private httpClient: HttpClient,public fb: FormBuilder,
    public imageUploadService: ImageuploadService) { 

      this.form = this.fb.group({
        name: [''],
        avatar: [null]
      })
  }

  uploadedImage!: File;  
  dbImage: any; 
  postResponse: any;
  successResponse!: string;
  image: any;
  title = 'Angular upload example1';
  
  public onImageUpload(event: any) {    
    this.uploadedImage = event.target.files[0];
  }

  imageUploadAction() {    
    const imageFormData = new FormData();
    imageFormData.append('image', this.uploadedImage, this.uploadedImage.name);
  

    this.httpClient.post('http://localhost:8080/upload/image/', imageFormData, { observe: 'response' })
      .subscribe((response) => {
        if (response.status === 200) { 
          this.postResponse = response;                
          this.successResponse = this.postResponse.body.message;
        } else {
          this.successResponse = 'Image not uploaded due to some error!';
        }
      }
      );
    }
    viewImage() {
      this.imageUploadService.vievImage(this.image).subscribe( data =>{
        this.postResponse = data;
        this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
      })
      // this.httpClient.get('http://localhost:8080/get/image/info/' + this.image)
      //   .subscribe(
      //     res => {
      //       this.postResponse = res;          
      //       this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
      //     }
      //   );
    }

    uploadFile(event:any) {
      const file = event.target.files ? event.target.files[0] : '';
      this.form.patchValue({
        avatar: file
      });
      this.form.get('avatar')?.updateValueAndValidity()
    }
    submitImage() {
      this.imageUploadService.imageUpload(
        this.form.value.name,
        this.form.value.avatar
      ).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            var eventTotal = event.total ? event.total : 0;
            this.progress = Math.round(event.loaded / eventTotal * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('Image Upload Successfully!', event.body);
            this.postResponse = event;                
            this.successResponse = this.postResponse.body.message;
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
    
        }
      })
    }
}
