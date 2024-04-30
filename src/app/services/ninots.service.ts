import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NinotsService {
  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore, 'ninots');

  // Create
  async createNinot(ninotData: any) {
    await addDoc(collection(this._firestore, 'ninots'), ninotData);
  }

  // Read
  getNinots() {
    return collectionData(this._collection) as Observable<any[]>;
  }

  // Read one
  async getNinot(id: string) {
    const ninotRef = doc(this._firestore, 'ninots', id);
    const ninotSnap = await getDoc(ninotRef); // Replace getDocs with getDoc
    if (ninotSnap.exists()) {
      return ninotSnap.data();
    } else {
      throw new Error('No such document!');
    }
  }

  // Update
  async updateNinot(id: any, updatedData: any) {
    const ninotRef = doc(this._firestore, 'ninots', id);
    await updateDoc(ninotRef, updatedData);
  }

  // Delete
  async deleteNinot(id: any) {
    const ninotRef = doc(this._firestore, 'ninots', id);
    await deleteDoc(ninotRef);
  }
}