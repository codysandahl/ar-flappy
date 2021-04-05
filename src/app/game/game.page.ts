import { Component, HostListener, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit {

  constructor() { }

  @ViewChild('game') game: ElementRef;
  
  score:number = 0;

  ngAfterViewInit() {
  }

  @HostListener('window:message', ['$event'])
  onGameMessage(event) {
    // protect against cross-origin attack
    const trustedOrigins = ["http://localhost:8100"];
    if (!trustedOrigins.includes(event.origin)) {
      console.log("UNTRUSTED EVENT FROM", event.origin);
      return;
    }
    // handle the event
    const data = event.data;
    //console.log('message from iframe', event.data);
    if (data.type == 'updateScore') {
      this.score = data.score;
    }
  }

  public debugButton() {
    const gameEl = this.game.nativeElement;
    const gameWindow = gameEl.contentWindow;
    gameWindow.postMessage({type: 'debug'});
  }
}
