import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppConfig {
  settings: any;

  load() {
    return fetch('/config.json')
      .then(res => res.json())
      .then(data => this.settings = data);
  }
}
