import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent {
  @Output() userNameEvent=new EventEmitter<string>();
  userName='';

  setUserName(){
    this.userNameEvent.emit(this.userName);
  }

}
