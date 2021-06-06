import { Injectable } from '@angular/core';
import { User } from './users.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  UserSelected = new Subject<User>();
  UsersUpdated = new Subject<void>();
  UsersInserted = new Subject<void>();
  UsersDeleted = new Subject<void>();
  UsersChanged = new Subject<User>();

  CurrentSelectedItem: User;
  Total: number;


  private Users: User[] = [];

  constructor() { }

  GetUsers() {
    return this.Users.slice();
  }

  SetUsers(newusers: User[]) {
    this.Users = newusers;
    this.UsersUpdated.next();
  }

  SetPagination(Total: number, Limit: number, Offset: number) {
    this.Total = Total;
  }

  SelectItemUsersList(ingredient: User) {
    this.CurrentSelectedItem = ingredient;
    this.UserSelected.next(ingredient);
  }

  IsCurrentSelected(user: User) {
    return this.CurrentSelectedItem === user;
  }

  GetUserById(id: number) {

    if (id < this.Users.length && id > 0) {
      return this.Users[id];
    } else {
      return this.Users[0];
    }
  }

  UpdateExistingUser(UserToUpdate: User, Index: number) {
    this.Users[Index] = UserToUpdate;
    this.UsersChanged.next(UserToUpdate);
  }

  AddNewUser(NewUser: User) {

    const NewUserToAdd = new User(NewUser.Role, NewUser.Email, NewUser.Phone, NewUser.Name);

    if (this.Users.length < environment.AdminUserListPageSize) {
      this.Users.push(NewUserToAdd);
    }

    this.UsersChanged.next(NewUserToAdd);
    this.UsersInserted.next();
  }

  DeleteUser(Index: number) {
    this.Users.splice(Index, 1);
    this.UsersDeleted.next();
  }

}

