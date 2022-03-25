import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultilanguageService {

  public Locale: string
  public LocaleSub = new Subject<string>();

  constructor(
    private translate: TranslateService,
    private sitetitle: Title
  ) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }

  // Получение языка из хранилища
  GetLocalStorageLocale() {
    
    const ulang = localStorage.getItem("userLang")

    if (ulang !== null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }

  }

  // Настройка заголовка и модуля переводов на нужный язык
  SwitchLanguage(lang: string) {

    this.translate.use(lang);
    localStorage.setItem("userLang", lang);

    this.translate.get("WebsiteTitleText", lang).subscribe(
      {
        next: (titletext: string) => {
          this.sitetitle.setTitle(titletext);
        },
        error: error => {
          console.log(error);
        }
      }
    );
  }    

  // Выполнение разового перевода 
  GetInstantTranslation(Text:string) {
    return this.translate.instant(Text);
  }

  // Получение языка профиля
  ChangeUserProfileLocale(Lang: string) {    
    this.Locale = Lang;
    this.LocaleSub.next(Lang);
    localStorage.setItem("userLang", Lang);
  }

  // Получение списка поддерживаемых языков модуля переводов
  GetSupportedLanguages() {
    return this.translate.getLangs();
  }

  // Получение текущего языка из модуля переводов
  GetCurrentLanguage() {
    return this.translate.currentLang;
  }
}
