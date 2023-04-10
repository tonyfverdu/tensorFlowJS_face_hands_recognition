import React, { useState, useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/face-landmarks-detection'
import * as handpose from '@tensorflow-models/hand-pose-detection'
import { drawMesh } from './functions/utilitiesFaceRecog.js'
import { drawHand } from './functions/utilitiesHandsRecog.js'
import ButtonKlein from './components/ButtonKlein.jsx'

import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import javaScript from './assets/JavaScript.svg'
import tensorFlow from './assets/tensorflow.svg'
import faceRecognition from './assets/face-id-icon.svg'
import handRecognition from './assets/hand-layout.svg'
import '../public/CSS/index.css'


function App() {
  //  Config webcam and models
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
    screenshotQuality: 1
  };

  const [faceRecog, setFaceRecog] = useState(false);
  const [handRecog, setHandRecog] = useState(false);
  const [isShowVideo, setIsShowVideo] = useState(true);

  //  Toogle Webcam
  function toogleWebCam() {
    setIsShowVideo(!isShowVideo)
    if (isShowVideo) {
      if (faceRecog) startFaceRecognition(faceRecog);
      if (handRecog) startHandsRecognition(handRecog);
    } else {
      if (!faceRecog) exitDetection(idRFFace, idFace);
      if (!handRecog) exitDetection(idRFHand, idHand);
    }
  }

  //  1.-  Setup references:  "setup webcam component and canvas"
  const webCamRef = useRef(null);
  const canvasRef = useRef(null)
  const canvasAvatarRef = useRef(null);
  const canvasPhotoRef = useRef(null);

  //  Global variables
  let videoWidth = 0;
  let videoHeight = 0;

  //  2.-  Load models of facemesh, hands:  model, function runFacemesh
  const modelFaces = facemesh.SupportedModels.MediaPipeFaceMesh;
  const modelHands = handpose.SupportedModels.MediaPipeHands;

  const detectorFaceConfig = {
    runtime: "tfjs",  // or 'mediapipe'
    solutionPath: '"https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh"',
    modelType: 'full'
  }
  const detectorHandsConfig = {
    runtime: "tfjs",  // or 'mediapipe'
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
    modelType: 'full'
  }

  //  ids of setInterval and frameAnimation
  let idFace = null;
  let idHand = null;
  let idRFFace = null;
  let idRFHand = null;

  //  Face detector
  const runFaceMesh = async () => {
    const detectorFaces = await facemesh.createDetector(modelFaces, detectorFaceConfig);

    idFace = setInterval(async () => {
      detectFace(detectorFaces);
    }, 100);
  };
  //  Hands detector
  const runHandPose = async () => {
    const detectorHands = await handpose.createDetector(modelHands, detectorHandsConfig);

    //  Loop of detect hands
    idHand = setInterval(() => {
      detectHands(detectorHands);
      if (!handRecog) clearInterval(idHand);
    }, 100);
  };

  //  3.-  Detect function:  async function with 2 parameters:  "detector" and "parPhoto" (optional)
  const detectFace = async (detector, parPhoto) => {
    if (
      typeof webCamRef.current !== "undefined" &&
      webCamRef.current !== null &&
      webCamRef.current.video.readyState === 4 &&
      isShowVideo
    ) {
      const video = webCamRef.current.video;
      videoWidth = webCamRef.current.video.videoWidth;
      videoHeight = webCamRef.current.video.videoHeight;

      if (parPhoto === 'photo') {
        const photo = new Image();
        const ctxAvatar = canvasAvatarRef.current.getContext('2d')
        const imagePhoto = ctxAvatar.getImageData(0, 0, videoWidth, videoHeight)

        canvasPhotoRef.current.width = videoWidth;
        canvasPhotoRef.current.height = videoHeight;
        const ctxPhoto = canvasPhotoRef.current.getContext('2d');

        ctxPhoto.clearRect(0, 0, videoWidth, videoHeight);
        ctxPhoto.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctxAvatar.putImageData(imagePhoto, 0, 0)

        // const urlPhoto = './Beatlesforsale.jpg';
        // photo.setAttribute('src', urlPhoto);
        photo.setAttribute('width', videoWidth)
        photo.setAttribute('height', videoHeight)

        const face = await detector.estimateFaces(photo);
        drawMesh(face, ctxPhoto);
      }

      webCamRef.current.video.width = videoWidth;
      webCamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      canvasAvatarRef.current.width = videoWidth;
      canvasAvatarRef.current.height = videoHeight;
      // canvasAvatarRef.current.width = 280;
      // canvasAvatarRef.current.height = 280;

      const face = await detector.estimateFaces(video);

      let ctx = null
      if (canvasRef.current) ctx = canvasRef.current.getContext("2d");
      const ctxAvatar = canvasAvatarRef.current.getContext('2d')

      idRFFace = requestAnimationFrame(() => {
        drawMesh(face, ctx);
        drawMesh(face, ctxAvatar);
      });
    }
  }

  async function detectHands(detectorHands) {
    if (
      //  Check data is avaible.
      typeof webCamRef.current !== "undefined" &&
      webCamRef.current !== null &&
      webCamRef.current.video.readyState === 4 &&
      isShowVideo
    ) {
      //  Get video properties:  videoWidth and videoHeight
      const video = webCamRef.current.video;
      videoWidth = webCamRef.current.video.videoWidth;
      videoHeight = webCamRef.current.video.videoHeight;

      //  Set video width and height
      webCamRef.current.video.width = videoWidth;
      webCamRef.current.video.height = videoHeight;

      //  Set canvas properties width and height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      canvasAvatarRef.current.width = videoWidth;
      canvasAvatarRef.current.height = videoHeight;

      //  Make detections of hands
      const hands = await detectorHands.estimateHands(video);

      //  Draw mesh of hands
      let ctx = null
      if (canvasRef.current) ctx = canvasRef.current.getContext("2d");
      const ctxAvatar = canvasAvatarRef.current.getContext('2d');

      idRFHand = requestAnimationFrame(() => {
        drawHand(hands, ctx);
        drawHand(hands, ctxAvatar);
      });
    }
  }

  //  Capture of figure detections in another canvas
  const capture = async () => {
    const detector2 = await facemesh.createDetector(modelFaces, detectorFaceConfig);
    //  Face recognition
    detectFace(detector2, 'photo')
    const ctxPhoto = canvasPhotoRef.current.getContext('2d')
    // const ctxAvatar = canvasRef.current.getContext('2d')
    // const ctxAvatar = canvasAvatarRef.current.getContext('2d')
    // ctxPhoto.clearRect(0, 0, canvasPhotoRef.current.width, canvasPhotoRef.current.height)

    // const imagePhoto = ctxAvatar.getImageData(0, 0, videoWidth, videoHeight)
    ctxPhoto.drawImage(canvasAvatarRef.current, 0, 0, canvasAvatarRef.current.width, canvasAvatarRef.current.height)
    // ctxPhoto.putImageData(imagePhoto, videoWidth, videoHeight);

  }

  //  Begin detections:  function "startFaceRecognition" in useEffect Hook
  function startFaceRecognition(parRecog) {
    if (typeof (parRecog) === 'boolean') {
      const ctx = canvasRef.current.getContext('2d');
      const ctxAvatars = canvasAvatarRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxAvatars.clearRect(0, 0, canvasAvatarRef.current.width, canvasAvatarRef.current.height);
      let txt = '';

      if (faceRecog) {
        txt = "Enter:  Face Recognition mit TensorFlowJS";

        runFaceMesh()
      } else if (!faceRecog) {
        txt = "Exit:  Face Recognition mit TensorFlowJS";
        // clearInterval(idFace)
        exitDetection(idRFFace, idFace)
      }
      ctxAvatars.fillStyle = "white";
      ctxAvatars.font = "12px Arial";
      ctxAvatars.fillText(txt, 15, 40);
    } else {
      console.error('Error:  The argument of the function "startFaceRecognition", must be a boolean type!!')
    }
  }
  function startHandsRecognition(parRecog) {
    if (typeof (parRecog) === 'boolean') {
      const ctx = canvasRef.current.getContext('2d');
      const ctxAvatars = canvasAvatarRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxAvatars.clearRect(0, 0, canvasAvatarRef.current.width, canvasAvatarRef.current.height);
      let txt = '';

      if (handRecog) {
        txt = "Enter:  Hand Recognition mit TensorFlowJS";

        runHandPose()
      } else if (!handRecog) {
        txt = "Exit:  Hand Recognition mit TensorFlowJS";
        //clearInterval(idHand)
        exitDetection(idRFHand, idHand)
      }
      ctxAvatars.fillStyle = "white";
      ctxAvatars.font = "12px Arial";
      ctxAvatars.fillText(txt, 15, 120);
    } else {
      console.error('Error:  The argument of the function "startHandsRecognition", must be a boolean type!!')
    }
  }

  //  Exit of recognition
  function exitDetection(parIdFrameAnimation, parIdSetIntenvar) {
    clearInterval(parIdSetIntenvar);
    cancelAnimationFrame(parIdFrameAnimation);

    if(canvasAvatarRef.current) canvasAvatarRef.current.getContext('2d').clearRect(0, 0, canvasAvatarRef.current.width, canvasAvatarRef.current.height);
    if (canvasRef.current) canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  //  Handle of face and hand recognitions
  function handleFace() {
    setFaceRecog(!faceRecog);
  }
  function handleHands() {
    setHandRecog(!handRecog);
  }

  useEffect(() => {
    if (isShowVideo) {
      startFaceRecognition(faceRecog);
      startHandsRecognition(handRecog);
      if (!canvasRef) canvasRef.current.remove()
    } else {
      exitDetection(idRFFace, idFace);
      exitDetection(idRFHand, idHand);
    }

    if (!faceRecog) exitDetection(idRFFace, idFace);
    if (!handRecog) exitDetection(idRFHand, idHand);
  }, [isShowVideo, faceRecog, handRecog]);


  return (
    <div className="contCentral">
      <div className="contLogos">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <header className="headerTitle">
          <h1 className="title">TensorFlow Face Recognition</h1>
        </header>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer">
          <img src={javaScript} className="logo" alt="JavaScrit logo" />
        </a>
        <a href="https://www.tensorflow.org/js?hl=es-419" target="_blank" rel="noreferrer">
          <img src={tensorFlow} className="logo" alt="TensorFlow logo" />
        </a>
      </div>

      <main className="mainProgram">
        <div className="recognition">
          <div className={`${isShowVideo ? "contWebCam ActivCam" : "contWebCam notActivCam"}`}>
            {isShowVideo &&
              <>
                <Webcam
                  ref={webCamRef}
                  audio={false}
                  screenshotFormat="/assets/image/sliceVoyager12.jpg"
                  videoConstraints={videoConstraints}
                  style={{
                    position: 'absolute',
                    top: '0%',
                    left: '0%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyItems: 'center',
                    justifyContent: 'center',
                    width: '900px',
                    height: '580px',
                    margin: '0% auto',
                    padding: '0%',
                    borderRadius: '6px'
                    //zIndex: '10'
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    top: '0%',
                    left: '0%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyItems: 'center',
                    justifyContent: 'center',
                    width: '900px',
                    height: '580px',
                    margin: '0% auto',
                    padding: '0%',
                    border: '2px solid rgb(205, 204, 204)',
                    borderRadius: '6px'
                    //zIndex: '10'
                  }}
                />
              </>
            }
          </div>

          <div className="contPhoto">
            <canvas
              ref={canvasAvatarRef}
            />
            <canvas
              ref={canvasPhotoRef}
            />
          </div>
        </div>
      </main >

      <div className="contButtons">
        <div className="contCheckboxes">
          <fieldset>
            <legend>TensorFlowJS Recognition</legend>
            <label className="contLabel">
              <figure className="figureIcon">
                <img src={faceRecognition} className="iconRecog" alt="Face recognition" />
              </figure>
              <input className="selectRecog" type="checkbox" id="faceRecog" name="faceRecognition" value="face" onChange={() => handleFace()} />
            </label>
            <label className="contLabel">
              <figure className="figureIcon">
                <img src={handRecognition} className="iconRecog" alt="Hand recognition" />
              </figure>
              <input className="selectRecog" type="checkbox" id="handRecog" name="handRecognition" value="hand" onChange={() => handleHands()} />
            </label>
          </fieldset>
        </div>
        <div className="contButtonsSelect">
          <ButtonKlein
            handleButton={toogleWebCam}
            text={'Webcam'}
            parW={'5rem'}
            parH={'2.2rem'}
            parFS={'0.8rem'}
          />
          <ButtonKlein
            handleButton={capture}
            text={'Photo'}
            parW={'5rem'}
            parH={'2.2rem'}
            parFS={'0.8rem'}
          />
        </div>
      </div>
    </div >
  );
}

export default App

//  Instal dependencies
//  Import dependencies
//  Setup webcam component and canvas
//  Define references to those
//  Load facemesh, handpose
//  Detect function
//  Drawing utilities
//  Load triangulation
//  Setup triangle path
//  Setup point drawing
//  DrawMesh to detect function
