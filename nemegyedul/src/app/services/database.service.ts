import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  loggedInUser: any = new Subject<any>();

  constructor(private firestore: AngularFirestore) { }

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
