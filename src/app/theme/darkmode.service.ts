import { Injectable,Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkmodeService {
  private renderer!: Renderer2;
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);

    this.loadTheme();
  }

  loadTheme() {
    const savedMode = localStorage.getItem('themeMode');
    const darkMode = savedMode === 'dark';

    // Applique la classe au corps (body) de la page
    if (darkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
    this.isDarkModeSubject.next(darkMode);
  }

  toggleDarkMode(): void {
    const newMode = !this.isDarkModeSubject.value;

    if (newMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem('themeMode', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem('themeMode', 'light');
    }
    this.isDarkModeSubject.next(newMode);
  }
}
