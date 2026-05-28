//import AsyncStorage from "@react-native-async-storage/async-storage";
import {View, Text, TextInput, Platform, Button } from "react-native";
import {useEffect, useState} from "react" //hooks
import * as SQLite from 'expo-sqlite';
import axios from "axios";


export default function Home(){//componente funcional es una funcion que manda una vista y se exporta
  
  const [text, setText] = useState("")
  const [lista, setLista]= useState<string[]>([])
  const [indexEditar, setIndexEditar] = useState(-1);
  const [textoAEditar, setTextoAEditar] = useState<string>("")
  const [db, setDB] = useState<SQLite.SQLiteDatabase>();

  //crud de localstorage(Asyncstorage)
  
  function setList(list){
    AsyncStorage.setItem("list", list)
  }

  async function getList(): Promise<string[]>{
   await db?.execAsync(`
       PRAGMA journal_mode = WALL;
       DROP TABLE words;
       CREATE TABLE IF NOT EXISTS words (id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL, word TEXT NOT NULL);
   `);
   const result: {id: number, word:string}[] | undefined =await db?.getAllAsync("SELECT * FROM  words")
   const words = (result || []).map(
   (row) => row.word
   )
   setLista(words)
   return words;
  }



  function updateList(newList){
    AsyncStorage.setItem("list", newList)
  }
   
  function deleteList(){
    AsyncStorage.removeItem("list")
  }
    
  async function deleteItem(index:number){
    const list = await getList();
    //delete list[index]
    list.splice(index, 1)
    setLista(list)
    updateList(JSON.stringify(list))
  }
      
  async function onSaveNewName(){
    if(!db) return;
    if(text){
    await db.runAsync(`INSERT INTO words(word) VALUES (?);`, text)
    await getList()
    setText("")
    }
  }

  async function onSaveEditRow(){
    const list = await getList()
    const valorAntiguo = list[indexEditar];
    db?.runAsync("UPDATE words SET word = ? WHERE word = ?;", textoAEditar, valorAntiguo)
    setIndexEditar(-1)
    await getList()
  }

  async function connectSQLite(){
    const conexion = await SQLite.openDatabaseAsync('list-4b');
    setDB(conexion)
  }

  useEffect(// no es buena practica hacerlos asyncronos hacer el callback de useEffect
    ()=> {
      if(db){
        getList()
      }
    },//callback
    []      //lista de dependencias
  )

  useEffect(
    ()=>{
        connectSQLite()
    },
    []
  )

  useEffect(
  ()=>{
    axios.get("https://jsonplaceholder.typicode.com/todos")
    .then(
      (result)=>{
        console.log(result.data)
      }
    )
    .catch(
      (error)=>{}
    ) // then es sincrona y await es asyncrona
  },[]
  )

  return(
    <View
      style={{
        paddingTop:60,
        flex:1
      }}
    >
      <text>Hola mundo</text>
      <view
        style={{
          flex:1
        }}
      >
        {
          lista.map(
            (nombre, index)=>{
              return(
                <View
                  style={{
                    flexDirection:"row"
                  }}
                >
                  {
                    index === indexEditar ?
                    <TextInput 
                    value ={textoAEditar}
                    onChangeText={
                      (newPalabra) => setTextoAEditar(newPalabra)
                    }
                    style={{flex:1, fontSize:24}}/>
                    : <Text
                    style={{
                      fontSize:24,
                      flex: 1
                    }}
                  >{nombre}</Text>
                  }
                {
                  indexEditar !== index ?
                
                  
                  <Button 
                    title="Actualizar"
                    color="green"
                    onPress={
                      ()=> {
                            setIndexEditar(index)
                            setTextoAEditar(nombre)
                      }
                    }
                  />
                  :
                  <Button
                  title= "guardar"
                  color = "gren"
                  onPress={onSaveEditRow}
                  />
                }
                <Button 
                title="Eliminar"
                color="red"
                onPress={
                  ()=> deleteItem(index)
                }
                />
                </View>
              )
            }
          )
        }
      </view>
      <view
        style={{
          flexDirection:"row"
        }}
      >
        <TextInput
          underlineColorAndroid="black"
          keyboardType="phone-pad"
          maxLength={10}
          value={text}
          onChangeText={
            (newText)=> setText(newText)
          }
          placeholder="ingresa tu num"
          style={{
            flex:1,
            fontSize:20,
            color:"blue",
            fontWeight:"bold",
            borderBottomColor:"red",
            borderBottomWidth: Platform.OS === "android" ? 1 : 0
          }}
        />
        <Button 
          title="Guardar"
          onPress={onSaveNewName}
        />
        
      </view>
    </View>
  )
}


