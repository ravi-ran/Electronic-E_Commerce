import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductList() {
    return this.http.get(environment.host + 'products');
  }

  getBrands() {
    return this.http.get(environment.host + 'brands');
  }

  getFeatures() {
    return this.http.get(environment.host + 'features');
  }

  getCategories() {
    return this.http.get(environment.host + 'categories');
  }
}
