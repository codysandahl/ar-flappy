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
  waitingToStart:boolean = true;
  gameOver:boolean = false;

  ngAfterViewInit() {
  }

  @HostListener('window:message', ['$event'])
  onGameMessage(event) {
    // protect against cross-origin attack
    const trustedOrigins = ["http://localhost:8100", "https://ar-flappy.web.app"];
    if (!trustedOrigins.includes(event.origin)) {
      console.log("UNTRUSTED EVENT FROM", event.origin);
      return;
    }
    // handle the event
    const data = event.data;
    //console.log('message from iframe', event.data);
    if (data.type == 'updateScore') {
      this.score = data.score;
    } else if (data.type == 'playerDied') {
      this.resetButton();
    }
  }

  public startButton() {
    const gameWindow = this.game.nativeElement.contentWindow;
    gameWindow.postMessage({type: 'start'});
    this.score = 0;
    this.waitingToStart = false;
  }

  public debugButton() {
    const gameWindow = this.game.nativeElement.contentWindow;
    gameWindow.postMessage({type: 'debug'});
  }

  public pauseButton() {
    const gameWindow = this.game.nativeElement.contentWindow;
    gameWindow.postMessage({type: 'pause'});
  }

  public resetButton() {
    const gameEl = this.game.nativeElement;
    gameEl.src += ''; // triggers refresh
    this.waitingToStart = true;
  }
}
