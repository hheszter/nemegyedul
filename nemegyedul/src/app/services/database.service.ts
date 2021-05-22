import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  // dbSubsciption: Subscription | undefined;
  currentUser: any;
  currentUserArray: any[];
  
  loggedInUser: any = new Subject<any>();

  constructor(private firestore: AngularFirestore) { 
    
  }

  currentuser() {
    this.getData('users').subscribe(
      
        (data:any) => {
          this.currentUserArray = data;
          console.log(this.currentUserArray)
          this.currentUser = this.currentUserArray.filter(data => data.userUID === window.localStorage.getItem("app_user_uid"))[0];
          console.log(+this.currentUser.role)
        }
    )
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

}
