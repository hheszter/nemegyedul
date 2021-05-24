import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  navigation: { label: string, href: string, role: number }[] = [
    { label: 'Home', href: '/welcome', role: 0 },
    { label: 'Események', href: '/main', role: 1 },
    { label: 'Új esemény felvétele', href: '/event-form', role: 2 },
    { label: 'Eseményeim', href: '/my-events', role: 1 },
    { label: 'Játékok', href: '/games', role: 1 },
    { label: 'Saját adatok', href: '/profil', role: 1 },
  ];
  constructor() { }
}
