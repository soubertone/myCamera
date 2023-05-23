import {Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useRef, useState} from "react";
import {Camera, CameraType} from "expo-camera";
import {Icon} from "react-native-elements";

export default function App() {
  const camRef = useRef(null)
  const [type, setType] = useState(CameraType.back)
  const [permission , requestPermission] = Camera.useCameraPermissions()
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>Acesso à camera negado</Text>
          <Button onPress={requestPermission} title="Habilitar Permissão" />
        </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function toggleCameraPhoto() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync()
      await setCapturedPhoto(data.uri)
      await setOpenModal(true)
    }
  }

  return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={camRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Mudar Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer2}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraPhoto}>
              <Text style={styles.text}>Tirar Foto</Text>
            </TouchableOpacity>
          </View>
        </Camera>

        {capturedPhoto && (
        <Modal
            transparent={true}
            animationType={"slide"}
            visible={openModal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
                onPress={() => {
                  setOpenModal(false)
                }}
                style={styles.buttonModal}
            >
              <Icon name='close' color='#000' size={30} backgroundColor='#fff' borderRadius={100} />
            </TouchableOpacity>
            <Image source={{ uri: capturedPhoto }} style={styles.imageModal} />
          </View>
        </Modal>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  buttonContainer2: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginVertical: 40,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    width: '100%',
    height: 400,
    position: "absolute",
    alignItems: "flex-start",
    top: '20%',
    flex: 1,
  },
  buttonModal: {
  },
  imageModal: {
    width: '100%',
    height: 400,
  }
});
