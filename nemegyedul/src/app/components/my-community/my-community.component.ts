import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-my-community',
  templateUrl: './my-community.component.html',
  styleUrls: ['./my-community.component.scss']
})
export class MyCommunityComponent implements OnInit {

  @Input() me: User;

  friendRequests: Array<any> = [];
  friendRequestsToMe: Array<any> = [];
  confirmedFriends: Array<any> = [];

  dbSubscription: Subscription;

  constructor(
    private db: DatabaseService,
    private userService: UsersService) { }

  ngOnInit(): void {
    setTimeout(()=>this.refreshFriendLists(), 500)
    // this.refreshFriendLists(); //this.me null az első pillanatban
  }

  refreshFriendLists() {
    const friendReqID = this.me.friends?.friendRequests;
    const friendReqToMeID = this.me.friends?.friendRequestsToMe;
    const confirmedID = this.me.friends?.friendLists;

    this.dbSubscription = this.db.getData('users').subscribe(
      (data) => {
        if(friendReqID){this.friendRequests = data.filter(user => friendReqID.includes(user.id))};
        if(friendReqToMeID){this.friendRequestsToMe = data.filter(user => friendReqToMeID.includes(user.id))};
        if(confirmedID){this.confirmedFriends = data.filter(user => confirmedID.includes(user.id))};
      },
      (err) => console.log(err),
      () => {
        this.dbSubscription.unsubscribe();
      }
    )
  }

  confirmRequest(friend:User) {
    this.userService.confirmRequest(friend)
      .then(()=>this.refreshFriendLists())
      .catch(err=>console.error(err))
  }

  resetRequest(friend:User) {
    this.userService.resetSentRequest(friend)
      .then(()=>this.refreshFriendLists())
      .catch(err=>console.error(err))
  }

  rejectRequest(friend:User) {
    this.userService.rejectRequest(friend)
    .then(()=>this.refreshFriendLists())
    .catch(err=>console.error(err))
  }

  deleteFriend(friend:User) {
    this.userService.deleteFriend(friend)
      .then(()=>this.refreshFriendLists())
      .catch(err=>console.error(err))
  }
}
