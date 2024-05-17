import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

const PATH = 'tiposNinots';

@Injectable({
  providedIn: 'root'
})
export class TiposNinotsService {
  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore, PATH);

  // Create
  async createTipoNinot(ninotData: any, id: string) {
    await setDoc(doc(this._firestore, PATH, id), ninotData);
  }

  // Read
  getTipoNinots() {
    return collectionData(this._collection) as Observable<any[]>;
  }

  // Read one
  async getTipoNinot(id: string) {
    const tipoNinotRef = doc(this._firestore, PATH, id);
    const tipoNinotSnap = await getDoc(tipoNinotRef); // Replace getDocs with getDoc
    if (tipoNinotSnap.exists()) {
      return tipoNinotSnap.data();
    } else {
      throw new Error('No such document!');
    }
  }

  // Update
  async updateTipoNinot(id: any, updatedData: any) {
    const tipoNinotRef = doc(this._firestore, PATH, id);
    await updateDoc(tipoNinotRef, updatedData);
  }

  // Delete
  async deleteTipoNinot(id: any) {
    const tipoNinotRef = doc(this._firestore, PATH, id);
    await deleteDoc(tipoNinotRef);
  }
}
