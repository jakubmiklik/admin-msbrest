
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';

const app = express();
app.use(cors({ origin: true }));
admin.initializeApp();

app.get('/users/getUser/:uid', async (req, res) => {

  try {
      const uid = req.params.uid;
      const db = admin.firestore();
      const user = db.collection("users").where('uid', '==', uid);
      let userData;
      await (await user.get()).docs.forEach(doc => {
        userData = doc.data();
      })
      return res.status(200).send(userData);
  } catch (error) {
      return res.status(500).send(error);
  }
})

app.post('/users/createUser', async (req, res) => {
  try {
    await admin.auth().createUser(
      {
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName
      }
    ).then(async (user) => {
      await admin.firestore()
        .collection('users')
        .doc(user.uid)
        .set({
            uid: user.uid,
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName
        });

      for(const child of req.body.children){
        const ref = admin.firestore()
          .collection(`users/${user.uid}/children`)
          .doc()
        const id = ref.id;
        await ref.set(({
          id: id,
          name: child
        }));
      }
    });
    const message = req.query.message || req.body.message || 'User successfully created!';
    return res.status(200).send(message);
  } catch (error) {
    return res.status(500).send(error);
  }
})

app.post('/users/editUser/:uid', async (req, res) => {
  
  try {
    await admin.auth()
      .updateUser(req.params.uid, 
      {
        email: req.body.email,
        displayName: req.body.displayName
      }
    );
      
    await admin.firestore()
      .doc(`users/${req.params.uid}`)
      .update(
        {
          email: req.body.email,
          displayName: req.body.displayName
        }
    )

    for(const child of req.body.children){
      
      /*const ref = (await admin.firestore()
        .collection(`users/${req.params.uid}/children`)
        .where('name', '==', child.name)
        .get()
      );*/
      
      const exist = (await admin.firestore()
        .doc(`users/${req.params.uid}/children/${child.id}`)
        .get()).exists;

      if(exist) {
        await admin.firestore().doc(`users/${req.params.uid}/children/${child.id}`).update({ name: child.name });
      }
      if(!child.id){
        const doc = admin.firestore()
          .collection(`users/${req.params.uid}/children`)
          .doc();
        const id = doc.id;
        await doc.set({
          id: id,
          name: child.name
        });
      } 
    }
    const message = req.query.message || req.body.message || 'User successfully updated!';
    return res.status(200).send(message);
  } catch (error) {
    return res.status(500).send(error);
  }
})

app.get('/users/deleteUser/:uid', async (req, res) => {

  try {
    const uid = req.params.uid;
    const db = admin.firestore();
    const collection = db.collection("users");
    await collection.doc(uid).delete();
    await admin.auth().deleteUser(uid);
    const message = req.query.message || req.body.message || 'User successfully deleted!';
    return res.status(200).send(message);
  } catch (error) {
    return res.status(500).send(error);
  }
})

app.get('/users/children/getAllAbsence', async (req, res) => {
  const array: FirebaseFirestore.DocumentData[] = [];
  (await admin.app()
    .firestore()
    .collectionGroup('absence')
    .get()).docs
      .forEach(docs => {
        array.push(docs.data())
  })
  try {
    return res.status(200).send(array);
  } catch (error) {
    return res.status(500).send(error);
  }
})

app.get('/photogallery/getListOfFolders', async (req, res) => {
  await admin.app()
    .storage()
    .bucket('skolka-brest.appspot.com')
    .setMetadata({cacheControl: 'max-age=1209600'});
  try {
    const files = await admin.storage()
      .bucket()
      .getFiles();
    return res.status(200).send(files);
  } catch (error) {
    return res.status(500).send(error);
  }
})

app.post('/news/addFile', async (req, res) => {
  await admin.app().storage().bucket('skolka-brest.appspot.com')
})

/*
addFile(files: FileList, id: string) {
  return new Observable<State>((observer) => {
    const arrayOfUrls = [];
    const complete = [];
    for (let i = 0; i < files.length; i++) {
      const storageRef = this.storage.ref(`articles/${id}/${files.item(i).name}`);
      const task = storageRef.put(files.item(i), {contentType: files.item(i).type});
      task.percentageChanges().subscribe(state => {
        complete[i] = Math.round(state);
        observer.next({state: complete} as State);
      });
      task.then(test => {
        test.ref.getDownloadURL().then(url => {
          arrayOfUrls.push(url);
          if (arrayOfUrls.length === files.length) {
            observer.next({array: arrayOfUrls} as State);
            observer.complete();
          }
        });
      });
    }
  });
}
*/
/*
app.get('/users/getAllUsers', async (req, res) => {
    (await admin.app().firestore().collection('users').get()).docs.map((user) => {
      try {
        return res.status(200).send(user.data());
      } catch (error) {
        return res.status(500).send(error);
      }
    });
})

app.get('/users/getAllChildren', async (req, res) => {
  let array: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[] = [];
  req.body.users.forEach(async (uid: string) => {
    array.push(...await admin.app().firestore().collection(`users/${uid}/children`).listDocuments())
  });
  try {
    return res.status(200).send(array);
  } catch (error) {
    return res.status(500).send(error);
  }
})
*/



export class User {
  constructor(public uid: string, public children?: Child[]){}
}
  
export class Child {
  constructor( public id: string, public name: string, public absence?: Absence[]){}
}

export class Absence {
  constructor(public dateFrom: number, public dateTo: number, public text: string){}
}

export interface ArrayToDisplay{
  childName: string;
  absence: Absence[];
}

export interface Absence {
  dateFrom: number;
  dateTo: number;
  text: string;
}

export interface Child {
  id: string;
  name: string;
  absence?: Absence[];
}

export interface User {
  uid: string;
  children?: Child[];
}

exports.app = functions.https.onRequest(app);
