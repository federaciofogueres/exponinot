import { Injectable, inject } from '@angular/core';
import { getApp } from '@angular/fire/app';
import { Firestore, collectionData, increment, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { collection, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NinotsService {
  private _firebaseApp = getApp();

  private _firestore = inject(Firestore);

  private pathCollection = 'ninots/2025/ninots';

  private _collection = collection(this._firestore, this.pathCollection);

  private _storage = getStorage(this._firebaseApp, 'gs://exponinot.appspot.com');

  private ninotsCache: any[] | null = null;



  incrementVisits(ninotId: string) {
    const ninotRef = doc(this._firestore, this.pathCollection, ninotId);
    return updateDoc(ninotRef, {
      visitas: increment(1)
    });
  }

  // Create
  async createNinot(ninotData: any, id: string) {
    await setDoc(doc(this._firestore, this.pathCollection, id), ninotData);
    // await setDoc(doc(this._firestore, 'ninots', id), ninotData);
    // await addDoc(collection(this._firestore, 'ninots'), ninotData);
  }

  // Read
  getNinots() {
    return collectionData(this._collection) as Observable<any[]>;
  }

  getNinotsWithCache(): Observable<any[]> {
    return this.getNinots();
    // if (this.ninotsCache) {
    //   return of(this.ninotsCache);
    // }

    // // const ninotsData = this.storage.getItem('ninots');
    // const ninotsData = sessionStorage.getItem('ninots');
    // // const ninotsData = localStorage.getItem('ninots');
    // if (ninotsData) {
    //   const { ninots } = JSON.parse(ninotsData);
    //   // if (currentTime - time < oneDay) {
    //   //   this.ninotsCache = ninots;
    //   //   return of(ninots);
    //   // }
    //   this.ninotsCache = ninots;
    //   return of(ninots);
    // }

    // return this.getNinots().pipe(
    //   first(),
    //   tap(ninots => {
    //     this.ninotsCache = ninots;
    //     this.storeNinotsInLocalStorage(ninots);
    //   })
    // );
  }

  storeNinotsInLocalStorage(ninots: any[]) {
    const date = new Date();
    const ninotsData = {
      ninots: ninots,
      time: date.getTime()
    };
    sessionStorage.setItem('ninots', JSON.stringify(ninotsData));
    // this.storage.setItem('ninots', JSON.stringify(ninotsData));
    // localStorage.setItem('ninots', JSON.stringify(ninotsData));
  }

  // Read one
  async getNinot(id: string) {
    console.log('getting Ninot');

    const cachedNinot = await this.ninotsCache?.find(ninot => ninot.id === id);
    console.log('cachedNinot', cachedNinot);

    if (cachedNinot) {
      return cachedNinot;
    } else {
      const ninotRef = doc(this._firestore, this.pathCollection, id);
      const ninotSnap = await getDoc(ninotRef); // Replace getDocs with getDoc
      if (ninotSnap.exists()) {
        return ninotSnap.data();
      } else {
        throw new Error('No such document!');
      }
    }
  }

  // Update
  async updateNinot(id: any, updatedData: any) {
    const ninotRef = doc(this._firestore, this.pathCollection, id);
    await updateDoc(ninotRef, updatedData);
  }

  // Delete
  async deleteNinot(id: any) {
    const ninotRef = doc(this._firestore, this.pathCollection, id);
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
            ninotForm.controls[field].setValue(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  }
}