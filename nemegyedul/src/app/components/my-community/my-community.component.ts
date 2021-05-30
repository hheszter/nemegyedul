import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-my-community',
  templateUrl: './my-community.component.html',
  styleUrls: ['./my-community.component.scss']
})
export class MyCommunityComponent implements OnInit {

  @Input() me: User;

  friendRequests: Array<any>;
  friendRequestsToMe: Array<any>;
  confirmedFriends: Array<any>;

  dbSubscription: Subscription;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    this.refreshFriendLists();
  }

  refreshFriendLists() {
    const friendReqID = this.me.friends?.friendRequests;
    const friendReqToMeID = this.me.friends?.friendRequestsToMe;
    const confirmedID = this.me.friends?.friendLists;

    this.dbSubscription = this.db.getData('users').subscribe(
      (data) => {
        this.friendRequests = data.filter(user => friendReqID.includes(user.id));
        this.friendRequestsToMe = data.filter(user => friendReqToMeID.includes(user.id));
        this.confirmedFriends = data.filter(user => confirmedID.includes(user.id));
      },
      (err) => console.log(err),
      () => this.dbSubscription.unsubscribe()
    )
  }

  confirmRequest(friend:User) {
    const newMe = this.me;
    newMe.friends.friendRequestsToMe = this.me.friends.friendRequestsToMe.filter( (ids:string)=> ids !== friend.id);
    newMe.friends.friendLists.push(friend.id);

    this.db.updateData("users", this.me.id, newMe);

    const newFriend = friend;
    newFriend.friends.friendRequests = friend.friends.friendRequests.filter( (ids:string)=> ids !== this.me.id);
    newFriend.friends.friendLists.push(this.me.id);

    this.db.updateData("users", friend.id, newFriend);
    
    this.refreshFriendLists();
  }

  resetRequest(friend:User) {
    const newMe = this.me;
    newMe.friends.friendRequests = this.me.friends.friendRequests.filter( (ids:string)=> ids !== friend.id);

    this.db.updateData("users", this.me.id, newMe);

    const newFriend = friend;
    newFriend.friends.friendRequestsToMe = friend.friends.friendRequestsToMe.filter( (ids:string)=> ids !== this.me.id);
    
    this.db.updateData("users", friend.id, newFriend);

    this.refreshFriendLists();
  }

  deleteFriend(friend:User) {
    const newMe = this.me;
    newMe.friends.friendLists = this.me.friends.friendLists.filter( (ids:string)=> ids !== friend.id);

    this.db.updateData("users", this.me.id, newMe);

    const newFriend = friend;
    newFriend.friends.friendLists = friend.friends.friendLists.filter( (ids:string)=> ids !== this.me.id);
    
    this.db.updateData("users", friend.id, newFriend);

    this.refreshFriendLists();
  }


}
