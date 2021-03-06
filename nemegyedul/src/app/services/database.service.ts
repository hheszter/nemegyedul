import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  dbSubscription: Subscription | undefined;
  
  loggedInUser: any = new BehaviorSubject<any>(null);
  newFriendReq: any = new BehaviorSubject<any>(0);
  
  constructor(private firestore: AngularFirestore) { 
  }
  
  getData(collection:string){
    return this.firestore.collection(collection).valueChanges({idField: "id"})
  }

  getOneDataById(collection:string, id:string){
    return this.firestore.collection(collection).doc(id).get()
  }

  saveData(collection:string, data:any){
    return this.firestore.collection(collection).add(data)
  }

  updateData(collection:string, id:string, data:any){
    return this.firestore.collection(collection).doc(id).set(data)
  }

  deleteData(collection:string, id:string){
    return this.firestore.collection(collection).doc(id).delete()
  }

  //get user datas via uid(stored in localeStorage):
  getUserLoggedIn(uid: string) {
    this.dbSubscription = this.getData("users").subscribe(
      (doc: any) => {
        doc.forEach((user: User) => {
          if (user.userUID) {
            if (user.userUID === uid) {
              this.loggedInUser.next(user);

              //indicate marks:
              this.newFriendReq.next(0) //set default
              if(user.friends){
                if(user.friends.friendRequestsToMe){
                  this.newFriendReq.next(user.friends.friendRequestsToMe.length)
                }
              }
            }
          }
        })
      },
      (err: any) => console.error(err),
      () => this.dbSubscription.unsubscribe()
    )
  }
}
