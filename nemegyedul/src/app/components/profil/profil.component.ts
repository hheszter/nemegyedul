import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { UsersService } from 'src/app/services/users.service';

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
  localeDate: any;

  constructor(
    private db: DatabaseService,
    private auth: AuthService,
    private userService: UsersService,
    private router: Router) { }

  ngOnInit(): void {
    this.dbSubscription = this.db.loggedInUser.subscribe(
      (user: any) => {
        this.user = user;
      },
      (err: any) => console.error(err),
      () => this.dbSubscription.unsubscribe()
    );
    this.db.getData('events').subscribe(
      data => {
        this.eventArray = data;
        this.filterData(this.eventArray, this.user, this.myEventArray)
      },
      error => console.error(error)
    )
  }

  filterData(eventArray, currentUser, myEventArray) {
    for (let j = 0; j < eventArray.length; j++) {
      let i = 0
      for (i = 0; i < currentUser.myEvents.length; i++) {
        if (eventArray[j].id === currentUser.myEvents[i]) {
          //if(eventArray[j].userUID === currentUser.userUID) {
          myEventArray.push(eventArray[j])
          //console.log(myEventArray)
        }
      }
    }
  }

  currentEvent(selectedEvent: any) {
    this.selectedEvent = selectedEvent
    this.localeDate = new Intl.DateTimeFormat('hu-HU').format(Date.parse(selectedEvent.datetime));
  }

  deleteEvent(selectedEvent) {

    this.user.myEvents = this.user.myEvents.filter(data => data != selectedEvent.id)
    this.db.updateData('users', this.user.id, this.user);
    this.myEventArray = this.myEventArray.filter(data => data.id !== selectedEvent.id)
    //console.log(this.currentUser)
  }

  //navigate on page:
  showEvents() {
    this.showMyEvents = !this.showMyEvents;
  }

  showFriends() {
    this.showMyFriends = !this.showMyFriends;
  }

  //edit profil datas:
  newPassword(email: string) {
    this.auth.getNewPassword(email)
      .then(() => {
        alert("Nézze meg az emailfiókját!")
      })
      .catch(err => console.log(err))
  }


  editProfil() {
    //modal form, save to db, db.loggedInUser.next(...)
    alert("Ez a funkció még fejlesztés alatt áll... Köszönjük a türelmét!")
  }

  deleteProfil() {
    if (!confirm("Biztosan törölni akarja a profilját? Ez a lépés nem visszavonható!")) {
      return
    } else {
      let friendsIDs = this.user.friends.friendLists ? this.user.friends.friendLists : [];
      let friendsReqIDs = this.user.friends.friendRequests ? this.user.friends.friendRequests : [];
      let friendsReqToMeIDs = this.user.friends.friendRequestsToMe ? this.user.friends.friendRequestsToMe : [];

      // this.manageUsersById(friendsReqToMeIDs, this.userService.rejectRequest);
      // this.manageUsersById(friendsReqIDs, this.userService.resetSentRequest);
      // this.manageUsersById(friendsIDs, this.userService.deleteFriend);

      if(friendsReqToMeIDs.length > 0){
        friendsReqToMeIDs.forEach((id: string) => {
          let currFriend: any;

          this.dbSubscription = this.db.getOneDataById("users", id).subscribe(
            (user) => { currFriend = user.data() },
            (err) => console.error(err),
            () => {
              this.userService.rejectRequest(currFriend)
              this.dbSubscription.unsubscribe();
            }
          )
        })
      }
      if(friendsReqIDs.length > 0){
        friendsReqIDs.forEach((id: string) => {
          let currFriend: any;

          this.dbSubscription = this.db.getOneDataById("users", id).subscribe(
            (user) => { currFriend = user.data() },
            (err) => console.error(err),
            () => {
              this.userService.resetSentRequest(currFriend)
              this.dbSubscription.unsubscribe();
            }
          )
        })
      }
      if(friendsIDs.length > 0){
        friendsIDs.forEach((id: string) => {
          let currFriend: any;

          this.dbSubscription = this.db.getOneDataById("users", id).subscribe(
            (user) => { currFriend = user.data() },
            (err) => console.error(err),
            () => {
              this.userService.deleteFriend(currFriend)
              this.dbSubscription.unsubscribe();
            }
          )
        })
      }

      this.db.deleteData("users", this.user.id)
        .then(()=>console.log("database deleted"))
        .catch(err=>console.log(err))

      this.auth.deleteUserAccount()
        .then(()=>{
          console.log("successfully deleted account");
          this.auth.logout()
             .then(()=>this.router.navigate(["/welcome"]))
        })
        .catch(err=>console.error(err))
    }
  }

  manageUsersById(idArray:Array<string>, callback:any ) {
    if(idArray.length > 0){
      idArray.forEach((id: string) => {
        let currFriend: any;

        this.dbSubscription = this.db.getOneDataById("users", id).subscribe(
          (user) => { currFriend = user.data() },
          (err) => console.error(err),
          () => {
            callback(currFriend)
            this.dbSubscription.unsubscribe();
          }
        )
      })
    }
  }

  //Using only by development:
  //Delete all friends and request in all user account!!!!
  deleteAllFriendShip(){
    this.db.getData("users").subscribe(
      (data)=>{
        data.forEach((user:any) => {
          let newUser = user;
          newUser.friends = {friendLists: [], friendRequests:[], friendRequestsToMe: [] }
          this.db.updateData("users", user.id, newUser)
            .then(()=>console.log("updated"))
            .catch(err=>console.log(err))

        })
      },
      (err)=>console.error(err)
    )
  }
}
