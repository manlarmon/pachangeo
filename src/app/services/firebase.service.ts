import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, addDoc, collection, collectionData, query } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";


//provideIn: 'root indica que el servicio se inyectará en el módulo raíz de la aplicación.
//Esto significa que el servicio estará disponible para toda la aplicación.
//Angular creará una única instancia del servicio y la inyectará en cualquier clase que lo requiera.
@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsService = inject(UtilsService);

  //----------Autenticación----------

  //Obtener el estado de autenticación
  getAuth() {
    return getAuth();
  }

  //Acceso de usuario
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Registro de usuario
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //Cerrar sesión
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/Auth');
  }

  //Acutalizar usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //Recuperar contraseña
  forgotPasswordEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }



  //----------Base de Datos----------


  //Obtener documentos de una colección

  getCollectionData(path: string, collectionQuery?: any) {
    //Referencia a la colección
    const ref = collection(getFirestore(), path);
    //Retornar la data de la colección y su id 
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }


  //Setear un documento
  //Lo utilizamos para crear un nuevo documento 
  //En nuestro caso lo utilizamos para guardar los datos de un usuario (le pasamos el id en el path)
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //Obtener un documento

  //Para obtener un documento, se debe de hacer uso de la función getDoc() de Firestore,
  //la cual recibe como parámetro la referencia del documento que se quiere obtener.

  //La hacemos asíncrona para poder esperar a que se resuelva la promesa que retorna getDoc() y obtener la data.
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // Agregar un documento
  // El addDocumment se encarga de darle un id único a cada documento que se agrega a una colección.
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  updateDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //----------Storage----------

  //Subir imagen
  async uploadImage(path: string, dataUrl: string) {

    //Referencia al storage ref(getStorage(), path)

    //Subir la imagen con la referencia y la dataUrl y el tipo de dato (data_url) 
    // () después de la promesa para que retorne la promesa de getDownloadURL()
    return uploadString(ref(getStorage(), path), dataUrl, 'data_url').then(() => {
      //Obtener la url de la imagen
      return getDownloadURL(ref(getStorage(), path));
    });
  }

}
