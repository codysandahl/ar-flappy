import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit {

  constructor() { }

  @ViewChild('game') game: ElementRef;

  ngAfterViewInit() {
  }

  public debugButton() {
    const gameEl = this.game.nativeElement;
    const gameWindow = gameEl.contentWindow;
    gameWindow.postMessage({type: 'debug'});
  }
}
