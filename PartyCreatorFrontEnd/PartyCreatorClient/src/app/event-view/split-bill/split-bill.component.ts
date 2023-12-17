import { Component, OnInit, Input } from '@angular/core';
import { ReceiptItemService } from 'src/app/services/receipt-item.service';
import { ReceiptItem } from 'src/app/interfaces/receipt-item';

@Component({
  selector: 'app-split-bill',
  templateUrl: './split-bill.component.html',
  styleUrls: ['./split-bill.component.css']
})
export class SplitBillComponent implements OnInit {
  @Input() eventId = '';

  receiptItems: ReceiptItem[] = [];
  receiptItem: ReceiptItem = {
    id: 0,
    name: '',
    quantity: 0,
    price: 0,
    eventId: 0
  };
  constructor(private splitBillService: ReceiptItemService) { }

  ngOnInit(): void {
    this.receiptItem.eventId = Number(this.eventId);
    this.loadReceiptItems();
  }

  loadReceiptItems(): void {
    this.splitBillService.getReceiptItems(Number(this.eventId)).subscribe(
      data => this.receiptItems = data,
      error => console.error('Error loading receipt items', error)
    );
  }

  onSubmit() { 
    this.splitBillService.addReceiptItem(this.receiptItem).subscribe(
      response => {
        console.log('Receipt item added successfully', response);
        this.loadReceiptItems(); // Ponownie załaduj przedmioty po dodaniu nowego
      },
      error => console.error('Error adding receipt item', error)
    );
  }
  getTotalPrice() {
    let total = 0;
    for (let item of this.receiptItems) {
      total += item.price;
    }
    return total;
  }
  
}
