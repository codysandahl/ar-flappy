import { Component, HostListener, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements AfterViewInit {

  constructor(public router: Router, private route: ActivatedRoute) { }

  @ViewChild('game') game: ElementRef;
  
  score:number = 0;
  waitingToStart:boolean = true;
  waitingToProgram:boolean = false;
  gameOver:boolean = false;
  mode:string = '';
  programInstructions:string[] = []; 

  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      if (!params.mode) {
        console.log("Invalid mode");
        this.router.navigate(['main-menu']);
      }
      this.mode = params.mode;
    })
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
    } else if (data.type == 'program') {
      this.handleProgramMessage(data);
    }
  }

  public handleProgramMessage(data) {
    switch (data.name) {
      case 'wait':
        this.waitingToProgram = true;
        this.programInstructions = [];
        break;

      case 'go':
        this.waitingToProgram = false;
        break;

      case 'trash':
        this.programInstructions = [];
        break;

      default:
        console.log('ionic program message', data.name);
        this.programInstructions.push(data.name);
        break;
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
    this.waitingToProgram = false;
  }
}
