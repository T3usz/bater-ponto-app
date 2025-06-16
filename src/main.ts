import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// Importar addIcons e os ícones necessários
import { addIcons } from 'ionicons';
import { 
  calendar, 
  time, 
  calculator, 
  qrCode, 
  person, 
  documentText,
  notificationsOutline,
  logOutOutline,
  calendarOutline,
  timeOutline,
  calculatorOutline,
  qrCodeOutline,
  personOutline,
  documentTextOutline,
  home,             // Adicionado
  homeOutline,      // Adicionado
  people,           // Adicionado
  peopleOutline,    // Adicionado
  personCircleOutline  // Adicionado para o gestor
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Registrar os ícones
addIcons({
  'calendar': calendar,
  'time': time,
  'calculator': calculator,
  'qr-code': qrCode,
  'person': person,
  'document-text': documentText,
  'notifications-outline': notificationsOutline,
  'log-out-outline': logOutOutline,
  'calendar-outline': calendarOutline,
  'time-outline': timeOutline,
  'calculator-outline': calculatorOutline,
  'qr-code-outline': qrCodeOutline,
  'person-outline': personOutline,
  'document-text-outline': documentTextOutline,
  'home': home,
  'home-outline': homeOutline,
  'people': people,
  'people-outline': peopleOutline,
  'person-circle-outline': personCircleOutline  // Novo ícone para Gestor
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
