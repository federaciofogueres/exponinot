import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TicketService {
    private readonly key = 'ticketId';
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    get ticketId(): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(this.key);
        }
        return null;
    }

    set ticketId(id: string | null) {
        if (this.isBrowser) {
            if (id) {
                localStorage.setItem(this.key, id);
            } else {
                localStorage.removeItem(this.key);
            }
        }
    }

    isTicketRegistered(): boolean {
        return isPlatformBrowser(this.platformId) && !!localStorage.getItem('ticketId');
    }

}
