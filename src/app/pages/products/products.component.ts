import { Component, OnInit } from '@angular/core';
import { ProductService } from '@services/product.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public productSearched: any;
  public areAllDataFetched: boolean;
  public filteredProductList: Product[];
  private productList: Product[];
  public categories: Categories[];
  public features: Features[];
  public brands: Brands[];
  public categoriesSelected: Categories[] = [];
  public featuresSelected: Features[] = [];
  public brandsSelected: Brands[] = [];
  public searchSuggestionList = [];
  public isDetailedView: boolean;
  public selectedProduct: Product;
  public isFilteredResultEmpty: boolean;
  public carousel = [];
  constructor(
    private productService: ProductService
  ) {
    this.areAllDataFetched = false;
  }

  ngOnInit() {
    this.getProductList();
    this.getBrands();
    this.getFeatures();
    this.getCategories();
    this.isDetailedView = false;
    this.isFilteredResultEmpty = false;
    this.carousel = ["../../../assets/images/DSLR_Camera_REMIX_By_DG-RA.svg", "../../../assets/images/EOS-700D-PRODUCT.jpg"];
  }

  /**
   * populates suggestions for searchbox based on input query
   */
  getSearchSuggestions(event) {
    const query = event.query;
    const searchFiltered = [];
    for (let item of this.productList) {
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        searchFiltered.push(item)
      }
    }
    for (let item of this.categories) {
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        searchFiltered.push(item)
      }
    }
    for (let item of this.brands) {
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        searchFiltered.push(item)
      }
    }
    for (let item of this.features) {
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        searchFiltered.push(item)
      }
    }
    this.searchSuggestionList = searchFiltered;
  }

  /**
   * calls product service to get the brand list
   */
  private getBrands() {
    this.productService.getBrands().subscribe((result: Brands[]) => {
      this.brands = result;
      this.areAllDataFetched = true;
    },
      (error) => {
        this.areAllDataFetched = false;
      })
  }

  /**
   * calls product service to get the feature list
   */
  private getFeatures() {
    this.productService.getFeatures().subscribe((result: Features[]) => {
      this.features = result;
      this.areAllDataFetched = true;
    },
      (error) => {
        this.areAllDataFetched = false;
      })
  }

  /**
   * calls product service to get the category list
   */
  private getCategories() {
    this.productService.getCategories().subscribe((result: Categories[]) => {
      this.categories = result;
      this.areAllDataFetched = true;
    },
      (error) => {
        this.areAllDataFetched = false;
      })
  }

  /**
   * calls product service to get the product list
   */
  private getProductList() {
    this.productService.getProductList().subscribe((result: Product[]) => {
      this.productList = result;
      this.filteredProductList = this.productList;
      this.areAllDataFetched = true;
    },
      (error) => {
        this.areAllDataFetched = false;
      })
  }

  /**
   * starts filtering of products based on selected criteria
   * filters using categories, then calls brand filter method
   */
  startFiltering() {
    const backupFilteredProduct = [...this.filteredProductList];
    let tempFilteredProduct: Product[] = [];
    if (this.categoriesSelected.length !== 0) {
      tempFilteredProduct = _.filter(this.productList, (prod) => {
        if (this.categoriesSelected.indexOf(prod.category_id) > -1) {
          return true;
        }
        return false;
      });
      this.filteredProductList = tempFilteredProduct;
    } else {
      if (this.categoriesSelected.length === 0 &&
        this.brandsSelected.length === 0 &&
        this.featuresSelected.length === 0) {
        this.filteredProductList = this.productList;
      } else {
        if (this.filteredProductList.length === 0) {
          this.filteredProductList = backupFilteredProduct;
        }
      }
    }
    this.filterUsingBrand();
  }

  /**
   * filters products based on selected brand criteria
   * then calls feature filter method
   */
  private filterUsingBrand() {
    let onlyCriteriaSelected = false;
    if (this.categoriesSelected.length === 0 && this.featuresSelected.length === 0) {
      onlyCriteriaSelected = true;
    }
    const backupFilteredProduct = onlyCriteriaSelected ? [...this.productList] : [...this.filteredProductList];
    let tempFilteredProduct = [];
    if (this.brandsSelected.length !== 0) {
      tempFilteredProduct = _.filter(backupFilteredProduct, (prod) => {
        if (this.brandsSelected.indexOf(prod.brand_id) > -1) {
          return true;
        }
        return false;
      });
      this.filteredProductList = tempFilteredProduct;
    } else {
      if (this.categoriesSelected.length === 0 &&
        this.brandsSelected.length === 0 &&
        this.featuresSelected.length === 0) {
        this.filteredProductList = this.productList;
      } else {
        if (this.filteredProductList.length === 0) {
          this.filteredProductList = backupFilteredProduct;
        }
      }
    }
    this.filterUsingFeature();
  }

  /**
   * filters products based on selected feature criteria
   * if products exists, displays the products
   * else show no product present
   */
  private filterUsingFeature() {
    let onlyCriteriaSelected = false;
    if (this.categoriesSelected.length === 0 && this.brandsSelected.length === 0) {
      onlyCriteriaSelected = true;
    }
    const backupFilteredProduct = onlyCriteriaSelected ? [...this.productList] : [...this.filteredProductList];
    let tempFilteredProduct = [];
    if (this.featuresSelected.length !== 0) {
      tempFilteredProduct = _.filter(this.filteredProductList, (prod) => {
        if (this.featuresSelected.indexOf(prod.feature_id) > -1) {
          return true;
        }
        return false;
      });
      this.filteredProductList = tempFilteredProduct;
    } else {
      if (this.categoriesSelected.length === 0 &&
        this.brandsSelected.length === 0 &&
        this.featuresSelected.length === 0) {
        this.filteredProductList = this.productList;
      } else {
        if (this.filteredProductList.length === 0) {
          this.filteredProductList = backupFilteredProduct;
        }
      }
    }
    this.isFilteredResultEmpty = false;
    if (this.filteredProductList.length === 0) {
      this.isFilteredResultEmpty = true;
    }
  }

  /**
   * starts filter of product list on search
   * first search in the product list
   * checks if item is found; if found, displays the result, else calls respective search filter
   */
  filterOnSearch() {
    if (this.productSearched !== undefined) {
      let products: Product[] = [];
      let itemFound = false;
      for (let item of this.productList) {
        if (item.name === this.productSearched.name) {
          products.push(item);
          itemFound = true;
        }
      }
      if (!itemFound) {
        const recievedObject = this.filterSearchOnCategory();
        itemFound = recievedObject.itemFound;
        products = recievedObject.product;
      }
      if (!itemFound) {
        const recievedObject = this.filterSearchOnBrand();
        itemFound = recievedObject.itemFound;
        products = recievedObject.product;
      }

      if (!itemFound) {
        const recievedObject = this.filterSearchOnFeature();
        itemFound = recievedObject.itemFound;
        products = recievedObject.product;
      }

      this.filteredProductList = products;
      this.isDetailedView = false;
      this.isFilteredResultEmpty = false;
      if (this.filteredProductList.length === 0 ) {
        this.isFilteredResultEmpty = true;
      }
    }
  }

  /**
   * filters product list if search criteria is a category
   *
   * @returns:
   * boolean flag to check if product was found or not
   * filtered product object if product is found
   */
  private filterSearchOnCategory() {
    let tempObj: {
      product: Product[];
      itemFound: boolean;
    } = {
      product: [],
      itemFound: false
    };
    let category = [];
    for (let item of this.categories) {
      if (item.name === this.productSearched.name) {
        category.push(item.id);
        tempObj.itemFound = true;
      }
    }
    tempObj.product = _.filter(this.productList, (item) => {
      if (category.indexOf(item.category_id) > -1) {
        return true;
      }
      return false;
    });
    return tempObj;
  }

  /**
   * filters product list if search criteria is a brand
   *
   * @returns:
   * boolean flag to check if product was found or not
   * filtered product object if product is found
   */
  private filterSearchOnBrand() {
    let tempObj: {
      product: Product[];
      itemFound: boolean;
    } = {
      product: [],
      itemFound: false
    };
    let brands = [];
    for (let item of this.brands) {
      if (item.name === this.productSearched.name) {
        brands.push(item.id);
        tempObj.itemFound = true;
      }
    }
    tempObj.product = _.filter(this.productList, (item) => {
      if (brands.indexOf(item.brand_id) > -1) {
        return true;
      }
      return false;
    });
    return tempObj;
  }

  /**
   * filters product list if search criteria is a feature
   *
   * @returns:
   * boolean flag to check if product was found or not
   * filtered product object if product is found
   */
  private filterSearchOnFeature() {
    let tempObj: {
      product: Product[];
      itemFound: boolean;
    } = {
      product: [],
      itemFound: false
    };
    let features = [];
    for (let item of this.features) {
      if (item.name === this.productSearched.name) {
        features.push(item.id);
        tempObj.itemFound = true;
      }
    }
    tempObj.product = _.filter(this.productList, (item) => {
      if (features.indexOf(item.feature_id) > -1) {
        return true;
      }
      return false;
    });
    return tempObj;
  }

  /**
   * resets search criteria and displays all the product
   */
  resetSearch() {
    this.filteredProductList = this.productList;
  }

  /**
   * displays the selected product details
   * @param product : selected product object
   */
  showDetails(product: Product) {
    this.selectedProduct = product;
    this.isDetailedView = true;
  }

  backToList() {
    this.isDetailedView = false;
  }
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category_id: string;
  brand_id: string;
  store_id: string;
}

export interface Categories {
  id: string;
  name: string;
  parent_id: string;
}

export interface Features {
  id: string;
  name: string;
}

export interface Brands {
  id: string;
  name: string;
}