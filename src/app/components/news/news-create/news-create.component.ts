import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css']
})
export class NewsCreateComponent implements OnInit {

  fileName: string = '';

  formModel = this.fb.group({
    Title: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
    Message: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(65536)]],
    Location:['general', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    Image: [null]
  });

  constructor(private newsService: NewsService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.newsService.setCreateErrorsEmpty();
  }

  onSubmit(){
    this.newsService.setIsSaving(true);
    let body = {
      title: this.formModel.value.Title ? this.formModel.value.Title.trim() : null,
      message: this.formModel.value.Message ? this.formModel.value.Message.trim() : null,
      location: this.formModel.value.Location ? this.formModel.value.Location.trim() : null,
      image: this.formModel.get('Image').value,
      date: new Date()
    };
    this.fileName = '';
    this.formModel.get('Image').setValue(null);
    this.newsService.createNews(body);
  }

  onFileSelected(event: any) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileName = file.name;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formModel.get('Image').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        })
      };
    }
  }

  isSaving(): Boolean {
    return this.newsService.getIsSaving();
  }
 
  focusOut(location: string): void {
    this.formModel.get('Location').setValue(location);
  }

  getErrors(): any {
    return this.newsService.getCreateErrors();
  }
}
