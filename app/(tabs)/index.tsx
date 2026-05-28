// import { Image, StyleSheet, Platform } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           Tap the Explore tab to learn more about what's included in this starter app.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           When you're ready, run{' '}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });

import {View, Text, TextInput, Platform, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


//import * as SQLite from 'expo-sqlite';
import {useEffect, useState} from "react" //hooks

export default function Home(){//componente funcional es una funcion que manda una vista y se exporta
  
  const [text, setText] = useState("")
  const [lista, setLista]= useState<string[]>([])
  const [indexEditar, setIndexEditar] = useState(-1);
  const [textoAEditar, setTextoAEditar] = useState<string>("")
  //crud de localstorage(Asyncstorage)
  
   function setList(list){
     AsyncStorage.setItem("list", list)
   }

   async function getList(): Promise<string[]>{
     const result  = await AsyncStorage.getItem("list");//la primera vez devuelve un null
     if(result){
       setLista(JSON.parse(result))
       return JSON.parse(result); // a array
    }else{
      return[]
    }
   }

   function updateList(newList){
     AsyncStorage.setItem("list", newList)
   }

  async function onSaveEditRow(){
    const list = await getList()
    list[indexEditar] = textoAEditar;
    updateList(JSON.stringify(list));
    setLista(list);
    setIndexEditar(-1)
  }

  useEffect(// no es buena practica hacerlos asyncronos hacer el callback de useEffect
    ()=> {
      getList()
    },//callback
    []      //lista de dependencias
  )

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
    if(text){
    const list = await getList()
    list.push(text)
    setLista(list)
    setText('')
    updateList(JSON.stringify(list))// a string
    }
  }

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
                    value={textoAEditar}
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



//proops: propiedades

// C = Create = POST
// R = Read = GET
// U = Update = PATCH or PUT
// D = Delete = DELETE

// URL = endpoint
// endpoint necesita un metodo
// puede tener n metodos
// url base + path