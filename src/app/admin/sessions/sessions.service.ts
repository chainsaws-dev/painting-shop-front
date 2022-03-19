import { Injectable } from '@angular/core';
import { Session } from './sessions.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  SessionsUpdated = new Subject<void>();
  SessionsInserted = new Subject<void>();
  SessionsDeleted = new Subject<void>();
  SessionsChanged = new Subject<Session>();
  SessionsSelected = new Subject<Session>();

  CurrentSelectedItem: Session;
  Total: number;


  private Sessions: Session[] = [];

  constructor() { }

  GetSessions() {
    return this.Sessions.slice();
  }

  SetSessions(newsessions: Session[]) {
    this.Sessions = newsessions;
    this.SessionsUpdated.next();
  }

  SetPagination(Total: number, Limit: number, Offset: number) {
    this.Total = Total;
  }

  SelectItemSessionsList(s: Session) {
    this.CurrentSelectedItem = s;
    this.SessionsSelected.next(s);
  }

  IsCurrentSelected(s: Session) {
    return this.CurrentSelectedItem === s;
  }

  GetSessionById(id: number) {

    if (id < this.Sessions.length && id > 0) {
      return this.Sessions[id];
    } else {
      return this.Sessions[0];
    }
  }

  DeleteSession(Index: number) {
    this.Sessions.splice(Index, 1);
    this.SessionsDeleted.next();
  }

}

