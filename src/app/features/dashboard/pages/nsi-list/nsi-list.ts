import { Component } from '@angular/core';
import { List } from './ui/list/list';

@Component({
  selector: 'app-nsi-list',
  imports: [List],
  templateUrl: './nsi-list.html',
  styleUrl: './nsi-list.css',
  standalone: true,
})
export class NsiList {}
