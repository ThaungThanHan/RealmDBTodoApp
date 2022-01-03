import React, {useState,useEffect} from 'react';
import {Text,View,TouchableOpacity,StyleSheet,TextInput,FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {queryAllTodoLists,insertNewTodoList,deleteAllTasks,deleteOneTask}  from '../databases/allSchemas';
import NetInfo from "@react-native-community/netinfo";

const HomePage = () => {
  const [text,setText] = useState("");
  const [tasks,setTasks] = useState([]);
  const [netInfo,setnetInfo] = useState(null);
  const [translation,setTranslation] = useState(0);
  const onTextChange = (inputText) => {
      setText(inputText);
  }

  useEffect(()=>{
    queryAllTodoLists().then((todolists)=>{
          const fetchTasks = todolists;
          fetchTasks.addListener(()=>{
            setTasks([...fetchTasks])
        })
      }).catch((error)=>{
          setTasks({todolists:[]})
      })

      const unsubscribe = NetInfo.addEventListener(state=>{
          setnetInfo(state.isConnected);
      });
      unsubscribe();
  },[])
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

  const renderTasks = ({item}) => {   // must only be item. otherwise, error.
        const{name,id} = item;
        return(
            <View style={styles.tasksItemContainer}>
            <Text style={{transform:[{translateX:translation}]}}
             onPress={setTranslation(-10)} style={styles.tasksItem}>{name}</Text>
            <Icon size={45} onPress={()=>deleteOneTask(id)} style={styles.tasksItemDelete} name="cross"/>
                            {/* cannot onPress={deleteOneTask(id)}}. will raise error such as -
                            cannot run HomePage component when running other component,
                            To locate the bad setState() call inside `CellRenderer`, follow the stack trace. */}
            </View>
        )
    }
//   const testing = JSON.stringify(tasks)
  return (
    <>
     {netInfo == true ? <Text>You are online</Text> : <Text>You are offline</Text>}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Todo App</Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput value={text} onChangeText={onTextChange} placeholder="Add your task" style={styles.inputSearch} />
            <TouchableOpacity onPress={insertNew}> 
                <Icon size={45} style={styles.inputBtn} name="plus"/>
            </TouchableOpacity>
        </View>
        {/* {testing ? <Text>{testing}</Text> : null} */}
        {tasks.length !== 0 ? 
        <View style={styles.tasksContainer}>
            <FlatList style={styles.tasksContainer} data={tasks} renderItem={renderTasks}/>
        </View>
        : null}
        <View style={styles.footerContainer}>
            <Text style={styles.tasksCount}>You have {tasks.length} pending tasks.</Text>
            <TouchableOpacity onPress={deleteAllTasks}>
                <Text style={styles.clearAllBtn}>Clear All</Text>
            </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",paddingVertical:14,
        height:"100%",paddingHorizontal:30,
    },
    titleText:{
        fontSize:30,marginBottom:20
    },
    inputContainer:{
        flexDirection:'row',alignItems:"center",justifyContent:"space-between",
    },
    inputSearch:{
        borderWidth:1, width:300,paddingHorizontal:10,paddingVertical:8,
        fontSize:20,marginBottom:20,borderColor:"rgba(158, 150, 150, .5)",borderRadius:4
    },
    inputBtn:{
        backgroundColor:"#8d4ae9",borderWidth:0,marginTop:-20,borderRadius:4,color:"white"
    },
    tasksContainer:{
        height:300,zIndex:-1
    },
    footerContainer:{
        justifyContent:'space-between',flexDirection:"row",alignItems:"center"
    },
    tasksCount:{
        fontSize:17,fontWeight:"bold"
    },
    tasksItemContainer:{
        backgroundColor:"#f2f2f2",
        height:42,paddingVertical:10,paddingLeft:15,marginBottom:8,
        borderRadius:4,color:'#747271',fontWeight:"bold",justifyContent:"space-between",
        flexDirection:"row"
    },
    tasksItemDelete:{
        backgroundColor:"#ff6666",borderWidth:0,marginTop:-10,borderRadius:4,color:"white",height:42
    },
    tasksItem:{
    },
    clearAllBtn:{
        backgroundColor:"#8d4ae9",paddingHorizontal:20,
        paddingVertical:10,color:"white",fontWeight:"bold",
        borderRadius:4
    }

})
export default HomePage;