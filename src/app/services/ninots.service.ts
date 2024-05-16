import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getApp } from 'firebase/app';
import { Firestore, collectionData, increment, setDoc } from '@angular/fire/firestore';
import { Observable, finalize, of } from 'rxjs';
import { getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { first, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class NinotsService {
  private _firebaseApp = getApp();

  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore, 'ninots');

  private _storage = getStorage(this._firebaseApp, 'gs://exponinot.appspot.com');

  private ninotsCache: any[] | null = null;

  incrementVisits(ninotId: string) {
    const ninotRef = doc(this._firestore, 'ninots', ninotId);
    return updateDoc(ninotRef, {
      visitas: increment(1)
    });
  }

  // Create
  async createNinot(ninotData: any, id: string) {
    await setDoc(doc(this._firestore, 'ninots', id), ninotData);
    // await addDoc(collection(this._firestore, 'ninots'), ninotData);
  }

  // Read
  getNinots() {
    return collectionData(this._collection) as Observable<any[]>;
  }

  getNinotsWithCache(): Observable<any[]> {
    if (this.ninotsCache) {
      return of(this.ninotsCache);
    }
  
    const ninotsData = localStorage.getItem('ninots');
    if (ninotsData) {
      const { ninots, time } = JSON.parse(ninotsData);
      const currentTime = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
      if (currentTime - time < oneDay) {
        this.ninotsCache = ninots;
        return of(ninots);
      }
    }
    
    return this.getNinots().pipe(
      first(),
      tap(ninots => {
        this.ninotsCache = ninots;
        this.storeNinotsInLocalStorage(ninots);
      })
    );
  }
  
  storeNinotsInLocalStorage(ninots: any[]) {
    const date = new Date();
    const ninotsData = {
      ninots: ninots,
      time: date.getTime()
    };
    localStorage.setItem('ninots', JSON.stringify(ninotsData));
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

  uploadImageNinot(filePath: string, file: any, field: string, ninotForm: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileRef = ref(this._storage, filePath);
      const task = uploadBytesResumable(fileRef, file);

      task.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, (error) => {
          console.error('Error uploading file -> ', error);
          reject(error);
        }, () => {
          getDownloadURL(task.snapshot.ref).then((downloadURL: string) => {
            console.log('File available at', downloadURL);
            ninotForm.controls[field].setValue(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  }
}