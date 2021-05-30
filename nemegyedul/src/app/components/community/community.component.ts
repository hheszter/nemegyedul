import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  dbSubscription: Subscription;
  allUser: Array<any>;
  filteredAllUser: Array<any>;
  me: User;

  constructor(private db: DatabaseService) { }

  ngOnInit(): void {
    this.dbSubscription = this.db.loggedInUser.subscribe(
      (data:any)=>{
        this.me=data;
      },
      (err:any)=>console.error(err),
      ()=>this.dbSubscription.unsubscribe()
    )

    this.dbSubscription = this.db.getData("users").subscribe(
      (data:any)=>{
        this.allUser = data
          .filter((user:User)=>user.id!==this.me.id)
          .filter((user:User)=>!this.me.friends.friendRequests.includes(user.id))
          .filter((user:User)=>!this.me.friends.friendRequestsToMe.includes(user.id));
      },
      (err:any)=>console.error(err),
      ()=>this.dbSubscription.unsubscribe()
    )

  }

  setFriend(friend:User){    
    this.me.friends = this.me.friends || {}
    this.me.friends.friendRequests = this.me.friends.friendRequests || [];
    if(this.me.friends.friendRequests.includes(friend.id)){
      alert("Már ismerősnek jelölted");
      return
    } else {
      this.me.friends.friendRequests.push(friend.id);
      this.db.updateData('users', this.me.id, this.me)
        .then(() => console.log('Add friend-request'))
        .catch(err => console.error(err))
    }
    
    friend.friends = friend.friends || {};
    friend.friends.friendRequestsToMe = friend.friends.friendRequestsToMe || [];
    if(friend.friends.friendRequestsToMe.includes(this.me.id)){
      alert("Már szóltam, hogy Őt már ismerősnek jelölted");
      return
    } else {
      friend.friends.friendRequestsToMe.push(this.me.id);
      this.db.updateData('users', friend.id, friend)
        .then(() => console.log('Send friend-request'))
        .catch(err => console.error(err))
    }
  }
}
