const video = document.getElementById('video');

async function setupCamera(){
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
    throw new Error('Please use FireFox');
  }
    startVideo();
}

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(setupCamera)

video.addEventListener('play',()=>{

  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = {width: video.width, height: video.height}
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () =>{
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

    const resizedDetecions = faceapi.resizeResults(detections, displaySize)

    canvas.getContext('2d').clearRect(0,0, canvas.width,canvas.height)

    faceapi.draw.drawDetections(canvas, resizedDetecions)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetecions)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetecions)

  },100)

})
