import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css']
})
export class WelcomeScreenComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  routeToProduct() {
    this.router.navigate(['/products']);
  }
}
