import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent {
  @Output() ticketSaved = new EventEmitter<void>();
  userInput = '';

  constructor(public ticketService: TicketService) { }

  submitTicket(): void {
    const value = this.userInput.trim();
    if (value) {
      this.ticketService.ticketId = value;
      this.ticketSaved.emit();
    }
  }
}
