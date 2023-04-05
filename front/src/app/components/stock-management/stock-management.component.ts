import {Component, OnInit} from '@angular/core';
import {Produit} from "../../models/produit/produit.model";
import {ApiService} from "../../services/api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {PopinProductComponent} from "../popin-product/popin-product.component";
//import { Router } from '@angular/router';




@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit{

  products : Array<Produit> = [];
  isLoading: boolean = true;
  addElement: string = 'ajouter un produit';
  minusElement: string = 'retirer un produit';

  constructor(private apiService : ApiService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              //private router: Router
              ) { }

  ngOnInit() {
      this.apiService.getallProduct().subscribe(data => {
        this.products = data;
        this.isLoading = false;
      },
        error => {
              this.openSnackBar('erreur HTTP.','ok');
        })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 8000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
  }

  removeOneProduct(product: Produit) {
    product.quantity -= 1;

    if (product.quantity === 0) {
      this.products = this.products.filter(produit => produit.id !== product.id);
      this.apiService.removeProduct(product);
    } else {
      product.price = product.price / (product.quantity + 1) * product.quantity;
      this.apiService.modifyProduct(product);
    }
  }

  delete( product: Produit){
    this.products = this.products.filter(produit => produit.id = product.id);
    this.apiService.removeProduct(product);
    location.reload();
    //this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([`/${this.router.url}`]));

  }

  openPopin() {
    const dialogRef = this.dialog.open(PopinProductComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.products.push(result);
    });

  }

  addProduct(product: Produit) {
    const existingProduct = this.products.find(produit => produit.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
      existingProduct.price = existingProduct.price / (existingProduct.quantity - 1) * existingProduct.quantity;
      this.apiService.modifyProduct(existingProduct);
    } else {
      product.price = product.price * product.quantity;
      this.products.push(product);
      this.apiService.modifyProduct(product);
    }
  }
}
