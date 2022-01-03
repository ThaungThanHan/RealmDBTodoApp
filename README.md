# Sample Todo App with React-native and MongoDB Realm
Simple Todo List Application for the purpose of testing MongoDB Realm for offline support. The app contains only the creating and deleting tasks.

---

# Installation

Firstly, initialized the project with the react-native cli which is installed globally.
```bash
react-native init <project_name>
```
Once in the project folder, run -
```bash
npm install realm
```
This will install MongoDB Realm in your project and ready to be used. 

# Setting up the UI
![1](https://user-images.githubusercontent.com/49096143/147944528-39ecf40b-519a-4cb2-a9fc-c88884c228d2.png)

The above screenshot shows the essential input bar for user's input to create tasks and delete buttons for each task. At the bottom, it shows the number of tasks and a button which deletes all of the tasks.
# Setting up Database.

As a personal preference and more organized code, I created a seperate folder called "databases" and created "allSchema.js" file for all the database-related functions.

In order to use realm, import it first by -
``` javascript
import Realm from 'realm';
```
Define an object schema which includes name, primaryKey and properties which is basically the task's information.
According to MongoDB documentation, object schemas specify constraints on object fields such as the data type of each field, whether a field is required, and default field values.
``` javascript
export const TODOLIST_SCHEMA = {
    name:"tasks",
    primaryKey:'id',
    properties:{
        id:"int",
        name:'string',
        creationDate:"date"
    }
};
```
In order to interact with the database, we need to defined a realm path and a schema which we will modify.
```javascript
const databaseOptions = {
    path:"TodoApp.realm",
    schema:[TODOLIST_SCHEMA]
}
```
This wraps up the database setup for the project.
---
# Database functions
For inserting data into the realm, we need to first open the realm by using Real.open() function and pass the databaseOptions we defined above.
``` javascript 
    Realm.open(databaseOptions)
```
Upon opening, we can use realm for various methods such as write, create, update, delete which modifies the table. Here for the insertion of the data, we can use realm.create. All the create, delete, upate methods should be wrapped inside the realm.write() function. Otherwise, it won't work. 
``` javascript
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
```
To get all the queries in the database, we can use realm.objects("schema_name") and it returns all the objects in that schema. Here is the function which uses it -
``` javascript
export const queryAllTodoLists = () => new Promise((resolve,reject)=>{
    Realm.open(databaseOptions).then(realm=>{
        let allTodoLists = realm.objects("tasks");
        resolve(allTodoLists);
    }).catch((error)=>{
        reject(error)
    })
})
```
For deletion of the data, we can delete all data at once or delete particular data according to its id. This can be done by selecting all data using realm.objects() or single data with its id by using realm.obejctForPrimaryKey('schema_name',id). View the code below -
``` javascript
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
```
This wraps up the functions to modify the table for this project.
---
# Displaying Data on the webpage
The functions from the allSchemas.js are imported. In order to get the data at mount, the queryAllTodoLists() is called and set the return value as a variable. A listener is added to that object and if there's any changes as we add or delete an item, it will set state again with the old state value. Otherwise, if there's an error with the return value itself, we can set an empty array as state.
``` javascript
  useEffect(()=>{
    queryAllTodoLists().then((todolists)=>{
          const fetchTasks = todolists;
          fetchTasks.addListener(()=>{
            setTasks([...fetchTasks])
        })
      }).catch((error)=>{
          setTasks({todolists:[]})
      })
  },[])
```
For the insertion of a task, we linked a function that calls the insertNewTodoList() with the user input as props. When clicked on the plus button, a task will be inserted with the name, id and the date created.
``` javascript
  const insertNew = () => {
      const newTodoList = {name:text}
      if(text !== ""){
          insertNewTodoList(newTodoList);
          console.log("Added new task!")
          console.log(tasks)
          setText("")
      }else{
          console.log("Failed to add")};
      }
```
For deletion of each task, we can pass the id as props to the deleteOneTask() function. Tasks are displayed on the screen by using FlatList with name and button for each task.
```javascript
        {tasks.length !== 0 ? 
        <View style={styles.tasksContainer}>
            <FlatList style={styles.tasksContainer} data={tasks} renderItem={renderTasks}/>
        </View>
        : null}
```
``` javascript
  const renderTasks = ({item}) => {   // must only be item. otherwise, error.
        const{name,id} = item;
        return(
            <View style={styles.tasksItemContainer}>
            <Text style={styles.tasksItem}>{name}</Text>
            <Icon size={45} onPress={()=>deleteOneTask(id)} style={styles.tasksItemDelete} name="cross"/>
                            {/* cannot onPress={deleteOneTask(id)}}. will raise error such as -
                            cannot run HomePage component when running other component,
                            To locate the bad setState() call inside `CellRenderer`, follow the stack trace. */}
            </View>
        )
    }
```
Here is the code for the button to delete all tasks and it is also similar to the above methods.
``` javascript
        <View style={styles.footerContainer}>
            <Text style={styles.tasksCount}>You have {tasks.length} pending tasks.</Text>
            <TouchableOpacity onPress={deleteAllTasks}>
                <Text style={styles.clearAllBtn}>Clear All</Text>
            </TouchableOpacity>
        </View>
```
---
# Local Storage
There will be realm file in the local storage of the emulator. It can be found in ( Device File Explorer -> data -> project_name -> files -> pathName.realm ). In order to view the contents of the realm file, we need to view it in realm studio which can downloaded at https://docs.mongodb.com/realm-legacy/products/realm-studio/index.html
![localstorage](https://user-images.githubusercontent.com/49096143/147945276-bc9e0d17-ca97-435c-bcb8-01b61c1a5e9d.png)
As shown in the screenshot, it shows the data and table I created in the app.
---
