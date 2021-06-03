import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: User;
  dbSubscription: Subscription;

  constructor(
    private auth: AuthService,
    private db: DatabaseService
    ){
      this.dbSubscription = this.db.loggedInUser.subscribe(
        (user: User)=>this.user = user,
        (err: any)=>console.error(err),
        ()=>this.dbSubscription.unsubscribe()
      )
     }

  sendFriendRequest(friend: User){
    this.user.friends = this.user.friends || {}
    this.user.friends.friendRequests = this.user.friends.friendRequests || [];

    if (this.user.friends.friendRequests.includes(friend.id)) {
      //extra protection, unnecessary, can be deleted
      alert("Már ismerősnek jelölted");
      return
    } else {
      this.user.friends.friendRequests.push(friend.id);
      this.db.updateData('users', this.user.id, this.user)
        .then(() => console.log('Add friend-request'))
        .catch(err => console.error(err))
    }

    friend.friends = friend.friends || {};
    friend.friends.friendRequestsToMe = friend.friends.friendRequestsToMe || [];

    if (friend.friends.friendRequestsToMe.includes(this.user.id)) {
      //extra protection, unnecessary, can be deleted
      alert("Már szóltam, hogy Őt már ismerősnek jelölted");
      return
    } else {
      friend.friends.friendRequestsToMe.push(this.user.id);
      this.db.updateData('users', friend.id, friend)
        .then(() => console.log('Send friend-request'))
        .catch(err => console.error(err))
    }
  }

  confirmRequest(friend: User){
    const newUser = this.user;
    newUser.friends.friendRequestsToMe = this.user.friends.friendRequestsToMe.filter( (ids:string)=> ids !== friend.id);
    newUser.friends.friendLists = newUser.friends.friendLists || [];
    newUser.friends.friendLists.push(friend.id);
    const update1 = this.db.updateData("users", this.user.id, newUser);

    const newFriend = friend;
    newFriend.friends.friendRequests = friend.friends.friendRequests.filter( (ids:string)=> ids !== this.user.id);
    newFriend.friends.friendLists = newFriend.friends.friendLists || [];
    newFriend.friends.friendLists.push(this.user.id);
    const update2 = this.db.updateData("users", friend.id, newFriend);
    
    return Promise.all([update1, update2])
  }

  resetSentRequest(friend: User, user?: User){
    const newUser = this.user;
    newUser.friends.friendRequests = this.user.friends.friendRequests.filter( (id:string)=> id !== friend.id);
    const update1 = this.db.updateData("users", this.user.id, newUser)
      .then(()=>console.log("updated"))
      .catch(err=>console.error(err));

    const newFriend = friend;
    newFriend.friends.friendRequestsToMe = friend.friends.friendRequestsToMe.filter( (id:string)=> id !== this.user.id);
    const update2 = this.db.updateData("users", friend.id, newFriend)
      .then(()=>console.log("updated"))
      .catch(err=>console.error(err));

    return Promise.all([update1, update2])
  }

  rejectRequest(friend: User, user?: User){
    const newUser = this.user;
    newUser.friends.friendRequestsToMe = this.user.friends.friendRequestsToMe.filter( (id:string)=> id !== friend.id);
    const update1 = this.db.updateData("users", this.user.id, newUser)
      .then(()=>console.log("updated"))
      .catch(err=>console.error(err));

    const newFriend = friend;
    newFriend.friends.friendRequests = friend.friends.friendRequests.filter( (id:string)=> id !== this.user.id);
    const update2 = this.db.updateData("users", friend.id, newFriend)
      .then(()=>console.log("updated"))
      .catch(err=>console.error(err));

    return Promise.all([update1, update2])
  }

  // resetReceivedRequest(friend: User, user?: User){
  //   //only used by account-delete method:
  //   const loggedinuser = user || this.user;
  //   const newFriend = friend;
  //   // console.log(newFriend.friends.friendRequestsToMe)
  //   newFriend.friends.friendRequestsToMe = friend.friends.friendRequestsToMe.filter( (id:string)=> id !== loggedinuser.id);
  //   // console.log(newFriend.friends.friendRequestsToMe)

  //   const update1 = this.db.updateData("users", friend.id, newFriend)
  //     .then(()=>console.log("updated"))
  //     .catch(err=>console.error(err));

  //   return Promise.apply(update1)
  // }

  deleteFriend(friend: User){
    const newUser = this.user;
    newUser.friends.friendLists = this.user.friends.friendLists.filter( (ids:string)=> ids !== friend.id);
    const update1 = this.db.updateData("users", this.user.id, newUser);

    const newFriend = friend;
    newFriend.friends.friendLists = friend.friends.friendLists.filter( (ids:string)=> ids !== this.user.id);
    const update2 = this.db.updateData("users", friend.id, newFriend);

    return Promise.all([update1, update2])
  }
}
