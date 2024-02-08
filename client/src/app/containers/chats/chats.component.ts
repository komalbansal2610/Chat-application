import { Component } from '@angular/core';
import * as io from 'socket.io-client';
import { DatePipe,formatDate } from '@angular/common';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
  userName='';
  message='';
  messageList:{message:string,userName:string,mine:boolean,currentDateAndTime:Date}[]=[];
  userList:{user:string,mine:boolean}[]=[];
  users:any=[];
  socket:any;
  currentDateAndTime:Date|null = null;
  formatTime:Date|null=null;
  formattedTime:Date|null=null;
  mine:boolean=false;

  constructor(){

  }

  userNameUpdate(name:string){
    this.socket=io.io(`localhost:3000?userName=${name}`)
    this.userName=name;
    this.socket.on('user-list',(data:{user:string,mine:boolean})=>{
      // this.userList=userList;
      this.userList.push({user:data.user,mine:data.mine});
    });
    this.socket.on('user',(userList:string[])=>{
      this.users=userList;
      this.users.pop();
    });

    this.socket.on('message-broadcast',(data:{message:string,userName:string,time:Date})=>{
      if(data)
      {
        this.formatTime=new Date(formatDate(data.time, 'yyyy-MM-dd hh:mm:ss a', 'en-US', 'IST'));
        this.messageList.push({message:data.message,userName:data.userName,mine:false,currentDateAndTime:this.formatTime});
      }
    });
  }

  sendMessage(){
    this.currentDateAndTime = new Date(Date.now());
    this.socket.emit('message',{msg:this.message,time:this.currentDateAndTime});
    this.messageList.push({message:this.message,userName:this.userName,mine:true,currentDateAndTime:this.currentDateAndTime});
    this.message='';
  }

}
