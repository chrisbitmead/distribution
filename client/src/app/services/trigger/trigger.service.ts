import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TriggerService {
    /**
     * Go back to the server and get new results
     */
    @Output() refresh = new EventEmitter<boolean>();
    /**
     * Redraw the map
     */
    @Output() redraw = new EventEmitter<boolean>();
    /**
     * Redraw the angular components (sidebar)
     */
    @Output() remodel = new EventEmitter<any>();
    /**
     * Zoom the map to the selected components
     */
    @Output() zoom = new EventEmitter<any>();
    /**
     * scroll info window to top
     */
    @Output() scrollToTop = new EventEmitter<any>();
    /**
     * scroll info window to bottom
     */
    @Output() scrollToBottom = new EventEmitter<any>();
}
