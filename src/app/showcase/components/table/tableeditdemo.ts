import { Component, OnInit} from '@angular/core';
import { Product } from '../../domain/product';
import { ProductService } from '../../service/productservice';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as uuid from 'uuid';

@Component({
    templateUrl: './tableeditdemo.html',
    providers: [MessageService, ConfirmationService],
    styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `]
})
export class TableEditDemo implements OnInit {
  
    cols: any[];

    products: Product[];

    products1: Product[];

    products2: Product[];

    statuses: SelectItem[];

    clonedProducts: { [s: string]: Product; } = {};

    constructor(
        private productService: ProductService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.productService.getProductsSmall().then(data => this.products = data);
        this.productService.getProductsSmall().then(data => this.products1 = data);
        this.productService.getProductsSmall().then(data => this.products2 = data);

        this.statuses = [{label: 'In Stock', value: 'INSTOCK'},{label: 'Low Stock', value: 'LOWSTOCK'},{label: 'Out of Stock', value: 'OUTOFSTOCK'}]
        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];
    }

    onDelete(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => val.id !== product.id);
                console.log('this.products in delete', this.products);
            }
        });
    }

    onAddAnotherColumn() {
        const product: Product = {
            id: uuid(),
        };
        this.products.push(product);
    }

    onEditComplete (event) {
        console.log(event);
        console.log('products edit', this.products);
    }

    onRowReorder(event) {
        console.log(event);
        console.log('products reordered', this.products);
    } 

    onRowEditInit(product: Product) {
        this.clonedProducts[product.id] = {...product};
    }

    onRowEditSave(product: Product) {
        if (product.price > 0) {
            delete this.clonedProducts[product.id];
            this.messageService.add({severity:'success', summary: 'Success', detail:'Product is updated'});
        }  
        else {
            this.messageService.add({severity:'error', summary: 'Error', detail:'Invalid Price'});
        }
    }

    onRowEditCancel(product: Product, index: number) {
        this.products2[index] = this.clonedProducts[product.id];
        delete this.clonedProducts[product.id];
    }

}
