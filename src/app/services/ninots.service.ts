import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class NinotsService {
  private db;

  constructor(private firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDb();
  }

  // Create
  async createNinot(ninotData: any) {
    await addDoc(collection(this.db, 'ninots'), ninotData);
  }

  // Read
  async getNinots() {
    const querySnapshot = await getDocs(collection(this.db, 'ninots'));
    return querySnapshot.docs.map(doc => doc.data());
  }

  // Read one
  async getNinot(id: string) {
    console.log(id);
    console.log(this.db);
    const ninotRef = doc(this.db, 'ninots', id);
    console.log(ninotRef);
    const ninotSnap = await getDoc(ninotRef); // Replace getDocs with getDoc
    console.log(ninotSnap);
    if (ninotSnap.exists()) {
      console.log('Document data:', ninotSnap.data());
      
      return ninotSnap.data();
    } else {
      throw new Error('No such document!');
    }
  }

  // Update
  async updateNinot(id: any, updatedData: any) {
    const ninotRef = doc(this.db, 'ninots', id);
    await updateDoc(ninotRef, updatedData);
  }

  // Delete
  async deleteNinot(id: any) {
    const ninotRef = doc(this.db, 'ninots', id);
    await deleteDoc(ninotRef);
  }
}