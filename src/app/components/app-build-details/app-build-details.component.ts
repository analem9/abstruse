import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SocketService } from '../../services/socket.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-build-details',
  templateUrl: 'app-build-details.component.html'
})
export class AppBuildDetailsComponent implements OnInit {
  uuid: string;
  terminalReady: boolean;
  terminalInput: string;
  terminalOptions: { size: 'small' | 'large' };
  build: any;

  constructor(
    private socketService: SocketService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.terminalOptions = { size: 'large' };
  }

  ngOnInit() {
    Observable.interval(100)
      .map(() => this.terminalReady)
      .takeWhile(x => !x)
      .subscribe(() => null, err => console.error(err), () => {
        this.route.params.subscribe(params => {
          this.uuid = params.id;

          this.apiService.getBuild(this.uuid).subscribe(build => {
            this.build = build;
            this.terminalInput = build.log.split('\r\n').join('\r');

            this.socketService.outputEvents.subscribe(event => {
              if (this.uuid === event.data.id) {
                this.terminalInput = event.data.data;
              }
            });
          });
        });
      });
  }

  runBuild(repositoryId: number): void {
    // this.apiService.runBuild(repositoryId).subscribe(event => {
    //   // build runned.
    // });
  }

  restartBuild(buildId: string): void {
    this.socketService.emit({ type: 'restartBuild', data: buildId });
  }

  stopBuild(): void {
    this.socketService.emit({ type: 'stopBuild', data: this.uuid });
  }

  terminalOutput(e: any): void {
    if (e === 'ready') {
      this.terminalReady = true;
    }
  }
}