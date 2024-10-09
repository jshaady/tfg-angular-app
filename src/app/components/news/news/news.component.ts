import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { INews } from 'src/app/interfaces/inews';
import { IUser } from 'src/app/interfaces/iuser';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(private newsService: NewsService,
              private userService: UserService,
              private router: Router,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.newsService.setNewsPage(1);
    this.newsService.searchNews();
  }

  getImage(news: INews) {
    if (news.imageBase64 != null && news.imageType != null) {
      let avatarEncode = news.imageBase64;
      let avatarType = news.imageType;
      if (avatarEncode != undefined) {
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + avatarType + ';base64,' + avatarEncode);
      }
    }
    else {
      return null;
    }
  }

  getUserImg(user: IUser) {
    if (user.imageType != null && user.imageBase64 != null) {
      let avatarEncode = user.imageBase64;
      let avatarType = user.imageType;
      if (avatarEncode != undefined) {
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + avatarType + ';base64,'
          + avatarEncode);
      }
    }
    else {
      return '../../../../assets/img/default.png';
    }
  }

  getNews() {
    return this.newsService.getNews();
  }

  createNews() {
    this.router.navigate(['/news/create'])
  }

  isAdmin() {
    return this.userService.isAdmin();
  }
  
  getNewsCount(): number {
    return this.newsService.getNewsCount();
  }

  showMoreNews(): void {
    this.newsService.setNewsPage(this.newsService.getNewsPage() + 1);
    this.newsService.searchNews();
  }

  hasImage(news: INews) {
    if (news.imageBase64 != null && news.imageType != null) {
      return true;
    }
    else return false;
  }
}
