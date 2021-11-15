import { Component, OnInit} from '@angular/core';
import { Product } from '../../domain/product';
import { ProductService } from '../../service/productservice';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as uuid from 'uuid';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

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
  //https://www.c-sharpcorner.com/article/creating-table-with-reactive-forms-in-angular-9-using-primeng-table2/
    productsForm: FormGroup;
    cols: any[];

    products: Product[];

    products1: Product[];

    products2: Product[];

    statuses: SelectItem[];

    clonedProducts: { [s: string]: Product; } = {};

    constructor(
        private productService: ProductService,
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private fb: FormBuilder ) { }

    ngOnInit() {
        this.productService.getProductsSmall().then(data => {
            this.products = data
            if (this.products) {
                this.populateTableRows()
            }
        });
        this.productService.getProductsSmall().then(data => this.products1 = data);
        this.productService.getProductsSmall().then(data => this.products2 = data);

        this.statuses = [{label: 'In Stock', value: 'INSTOCK'},{label: 'Low Stock', value: 'LOWSTOCK'},{label: 'Out of Stock', value: 'OUTOFSTOCK'}]
        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];
        this.createForm();
    }

    private createForm(): void {  
        
        this.productsForm = this.fb.group({ 
            tableRowArray: this.fb.array([])  
        })  
    }  

    onDeleteRow(product: Product, index: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tableRowArray.removeAt(index);
                console.log('this.products in delete', this.tableRowArray);
            }
        });
    }

    onAddAnotherRow() {
        this.tableRowArray.push(this.createTableRow()); 
    }

    populateTableRows() {
        if(this.products) {
            this.products.forEach(product => this.tableRowArray.push(this.createTableRow(product)))
        }
    }

    private createTableRow(product = null): FormGroup { 
        return this.fb.group({
            code: new FormControl(!!product ? product.code : null, {  
                validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]  
            }),
            name: new FormControl(!!product ? product.name : null, {  
                validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]  
            }),
            category: new FormControl(!!product ? product.category : null, {  
                validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]  
            }),
            quantity: new FormControl(!!product ? product.quantity : null, {  
                validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]  
            }),
        }) 
    }

    get tableRowArray(): FormArray {  
        return this.productsForm.get('tableRowArray') as FormArray;  
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
