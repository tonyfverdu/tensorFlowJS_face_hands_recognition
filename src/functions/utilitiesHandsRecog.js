//  Dictionary of landmarks fingers (points (21) of recognition hand from tensorFlowJS)
const fingerPointsDictionary = {
  wrist: [0],
  thumb: [0, 1, 2, 3, 4],
  index_finger: [0, 5, 6, 7, 8],
  middle_finger: [0, 9, 10, 11, 12],
  ring_finger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20]
}

//  Draw funtion of hands recognition
export function drawHand(pointsPrediction, ctx) {
 //  Chek first if are there some points prediction or not, and if ctx is not "null"
 if(pointsPrediction.length > 0 && ctx) {
  //  Loop for each element "prediction" from the array "pointsPrediction"
  pointsPrediction.forEach(prediction => {
    // Grab landmarks of the hand model (hand model reference points)
    const landmarks = prediction.keypoints;

    //  Loop throught landmarks and then draw it
    for (let i = 0; i < landmarks.length; i++) {
      //  Get x point
        const x = landmarks[i].x
      //  Get y point
        const y = landmarks[i].y

       //  Loop through of fingers
       for (let j = 0; j < Object.keys(fingerPointsDictionary).length; j++) {
        let finger = Object.keys(fingerPointsDictionary)[j];

        // Loop through pairs of joins for each finger
        for (let k = 0; k < fingerPointsDictionary[finger].length - 1; k++) {
          const firstJoinIndex = fingerPointsDictionary[finger][k];
          const secondJoinIndex = fingerPointsDictionary[finger][k + 1];

          //  Draw path of finger
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "rgb(246, 240, 240)";
          ctx.moveTo(landmarks[firstJoinIndex].x, landmarks[firstJoinIndex].y);
          ctx.lineTo(landmarks[secondJoinIndex].x, landmarks[secondJoinIndex].y);
          ctx.stroke();
          ctx.closePath();
        }
       }

       //  liks the fingers
       ctx.beginPath();
       ctx.lineWidth = 2;
       ctx.fillStyle = "rgba(253, 161, 253, 0.2)";
       ctx.moveTo(landmarks[0].x, landmarks[0].y)
       ctx.lineTo(landmarks[1].x, landmarks[1].y)
       ctx.lineTo(landmarks[2].x, landmarks[2].y)
       ctx.lineTo(landmarks[5].x, landmarks[5].y)
       ctx.lineTo(landmarks[9].x, landmarks[9].y)
       ctx.lineTo(landmarks[13].x, landmarks[13].y)
       ctx.lineTo(landmarks[17].x, landmarks[17].y)
       ctx.lineTo(landmarks[0].x, landmarks[0].y)

       ctx.fill();
       ctx.closePath();

      //  Start drawing landmarks points fron the hand detection
      for (let j = 0; j < landmarks.length; j++) {
       if(landmarks[i].name === 'wrist') {
            ctx.beginPath();
            ctx.fillStyle='rgb(252, 249, 112)';
            ctx.arc(x,y,22, 0, 2*Math.PI);
            ctx.fill();
          } else if(landmarks[i].name === 'thumb_mcp' || landmarks[i].name === 'index_finger_mcp' ||  landmarks[i].name === 'middle_finger_mcp' ||
            landmarks[i].name === 'ring_finger_mcp' || landmarks[i].name === 'pinky_finger_mcp') {
            ctx.beginPath();
            ctx.fillStyle='rgb(103, 255, 2)';
            ctx.arc(x,y,10, 0, 2*Math.PI);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.fillStyle='rgb(250, 29, 29)';
            ctx.arc(x,y,8, 0, 2*Math.PI);
            ctx.fill();
          }
        }
      }
  });
 }
}

