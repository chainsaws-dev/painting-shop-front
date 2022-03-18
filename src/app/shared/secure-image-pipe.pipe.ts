import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Pipe({
  name: 'secureImagePipe'
})
export class SecureImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private auth: AuthService, // our service that provides us with the authorization token
  ) { }

  async transform(src: string): Promise<string> {
    const token = this.auth.GetUserToken();
    const headers = new HttpHeaders({
      Auth: token ?? "",
      ApiKey: environment.ApiKey
    });

    try {
      const imageBlob = await this.http.get(src, { headers, responseType: 'blob' }).toPromise();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        if (imageBlob === undefined) {
          reject(reader.result as string)
        } else {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageBlob);
        }

      });
    } catch {
      return '/favicon.ico';
    }

  }

}
