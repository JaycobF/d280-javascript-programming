import { Routes, UrlTree } from '@angular/router';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  },
  {
    path: 'map',
    component: WorldMapComponent
  },
  {
    path: '**',
    redirectTo: '/map'
  }
];
