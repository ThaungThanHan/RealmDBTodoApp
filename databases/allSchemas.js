import Realm from 'realm';

export const TODOLIST_SCHEMA = {
    name:"tasks",
    primaryKey:'id',
    properties:{
        id:"int",
        name:'string',
        creationDate:"date"
    }
};

const databaseOptions = {
    path:"TodoApp.realm",
    schema:[TODOLIST_SCHEMA]
}

export const insertNewTodoList = newTodoList => {
    Realm.open(databaseOptions).then(realm => {
        const date = new Date(Date.now());
        realm.write(()=>{
            task = realm.create('tasks',{
                id:Date.now(),
                name:newTodoList.name,
                creationDate:date,
                status:"incomplete"
            })
        })
    })
}

export const queryAllTodoLists = () => new Promise((resolve,reject)=>{
    Realm.open(databaseOptions).then(realm=>{
        let allTodoLists = realm.objects("tasks");
        resolve(allTodoLists);
    }).catch((error)=>{
        reject(error)
    })
})

export const deleteAllTasks = () => {
    Realm.open(databaseOptions).then(realm => {
        let allTasks = realm.objects('tasks');
        realm.write(()=>{
            realm.delete(allTasks)
        })
    })
}

export const deleteOneTask = (id) => {
    Realm.open(databaseOptions).then(realm=>{
        realm.write(()=>{
            let Task = realm.objectForPrimaryKey('tasks',id);
            realm.delete(Task)
        })
    })
}
// export const queryAllTasks = () => {
//     Realm.open(databaseOptions).then(realm=>{
//         return realm.objects('tasks')
//     })
// }