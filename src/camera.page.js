import React from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import Gallery from './gallery.component';
import * as Permissions from 'expo-permissions';
import Toolbar from './toolbar.component';
import styles from './styles';

export default class CameraPage extends React.Component {
    camera = null;
    // The state has only one property "hasCameraPermission". We've used state
    //to keep track of the permission
    state = {
        captures: [],
        // setting flash to be turned off by default
        flashMode: Camera.Constants.FlashMode.off,
        capturing: null,
        // start the back camera by default
        cameraType: Camera.Constants.Type.back,
        hasCameraPermission: null,
    };
    //setFlashMode and setCameraType methods simply updates the state 
    //with the values that are passed to them
    setFlashMode = (flashMode) => this.setState({ flashMode });
    setCameraType = (cameraType) => this.setState({ cameraType });
    //handleCaptureIn sets the capturing state to true and everytime 
    //the capture button is pressed, this will be triggered.
    handleCaptureIn = () => this.setState({ capturing: true });

    //handleCaptureOut stop recording video if capturing is set to true using the
    //stopRecording() method.
    handleCaptureOut = () => {
        if (this.state.capturing)
            this.camera.stopRecording();
    };

    //handleShortCapture uses takePictureAsync() method of the camera component to 
    //take a photo and then it adds the returned data to the captures array and 
    //sets capturing to false
    handleShortCapture = async () => {
        const photoData = await this.camera.takePictureAsync();
        this.setState({ capturing: false, captures: [photoData, ...this.state.captures] })
    };
    //handleLongCapture uses the recordAsync() method of the camera component 
    //and tells the camera to start recording video.(handleLongCapture is called from 
    //the Toolbar component when user taps and holds the capture button.)
    handleLongCapture = async () => {
        const videoData = await this.camera.recordAsync();
        this.setState({ capturing: false, captures: [videoData, ...this.state.captures] });
    };
    // componentDidMount is a lifecycle component to request permissions from the user
    //Permission.askAsync is used to request using camera and audio_recording
    async componentDidMount() {
        //The askAsync method returns an object with the status property which is set 
        //to granted if the user accepts the request
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        //We set hasCameraPermission to true only if both permissions are granted
        const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

        this.setState({ hasCameraPermission });
    };

    render() {
        const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }
        //React.Fragment is used to render multiple element without adding an 
        //additional node to the DOM.

        return (
            <React.Fragment>
                <View>
                    <Camera
                        type={cameraType}
                        flashMode={flashMode}
                        style={styles.preview}
                        ref={camera => this.camera = camera}
                    />
                </View>
                {captures.length > 0 && <Gallery captures={captures}/>}
                <Toolbar
                    capturing={capturing}
                    flashMode={flashMode}
                    cameraType={cameraType}
                    setFlashMode={this.setFlashMode}
                    setCameraType={this.setCameraType}
                    onCaptureIn={this.handleCaptureIn}
                    onCaptureOut={this.handleCaptureOut}
                    onLongCapture={this.handleLongCapture}
                    onShortCapture={this.handleShortCapture}
                />
            </React.Fragment>   
        );
    };
};