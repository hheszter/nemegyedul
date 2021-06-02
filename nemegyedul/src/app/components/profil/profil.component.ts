import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  user: User;

  showMyEvents: boolean = false;
  showMyFriends: boolean = false;

  dbSubscription: Subscription;

  eventArray: any[] = [];
  myEventArray: any[] = [];
  selectedEvent: any = {};
  
  constructor(
    private db: DatabaseService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.dbSubscription = this.db.loggedInUser.subscribe(
      (user:any)=>{
        this.user=user;
      },
      (err:any)=>console.error(err),
      ()=>this.dbSubscription.unsubscribe()
    );
    this.db.getData('events').subscribe(
      data => {
        this.eventArray = data;
        this.filterData(this.eventArray, this.user, this.myEventArray)


      },
      error => console.error(error)
    )
  }

  filterData (eventArray, currentUser, myEventArray) {

    for(let j = 0; j< eventArray.length; j++) {
      let i= 0
      for (i= 0; i< currentUser.myEvents.length; i++) {
         if(eventArray[j].id === currentUser.myEvents[i]) {
        //if(eventArray[j].userUID === currentUser.userUID) {
          myEventArray.push(eventArray[j])
          //console.log(myEventArray)
        }
      }
    }
  }

  currentEvent(selectedEvent: any) {
    this.selectedEvent = selectedEvent
  }

  deleteEvent(selectedEvent) {

    this.user.myEvents = this.user.myEvents.filter(data => data != selectedEvent.id)
    this.db.updateData('users', this.user.id, this.user);
    this.myEventArray = this.myEventArray.filter(data => data.id !== selectedEvent.id)
    //console.log(this.currentUser)
  }

  newPassword(email:string){
    this.auth.getNewPassword(email)
      .then(()=>{
        alert("Nézze meg az emailfiókját!")
      })
      .catch(err=>console.log(err))
  }

  showEvents(){
    this.showMyEvents = !this.showMyEvents;
  }

  showFriends(){
    this.showMyFriends = !this.showMyFriends;
  }

  editProfil(){
    //modal form, save to db, db.loggedInUser.next(...)
    alert("Ez a funkció még fejlesztés alatt áll... Köszönjük a türelmét!")
  }

}
