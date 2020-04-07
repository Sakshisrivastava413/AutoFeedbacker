import React, { Component } from "react";
import Webcam from 'react-webcam';

import Paper from '@material-ui/core/Paper';

import $ from 'jquery';

const EMOTION_TYPES = {
  ANGRY: 0,
  DISGUST: 1,
  FEAR: 2,
  HAPPY: 3,
  SAD: 4,
  SURPRISE: 5,
  NEUTRAL: 6
};

class Camera extends Component {

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  componentDidMount() {
    setInterval(() => {
      if (this.props.recording) {
        let base64Image = this.webcam.getScreenshot();
        if (!base64Image) return;
        base64Image = base64Image.split('base64,')[1];
  
        const { updateEmotion } = this.props;
  
        $.ajax({
          url: 'http://localhost:5000/analyse_image',
          data: JSON.stringify({
            image: base64Image
          }),
          crossDomain: true,
          type: 'POST',
          success: (response) => {
            console.log(String(response));
            let result = response.split(',');
            result = result.map(val => val * 100);
            const emotionsData = {
              'angry': result[EMOTION_TYPES.ANGRY],
              'disgust': result[EMOTION_TYPES.DISGUST],
              'fear': result[EMOTION_TYPES.FEAR],
              'happy': result[EMOTION_TYPES.HAPPY],
              'sad': result[EMOTION_TYPES.SAD],
              'surpise': result[EMOTION_TYPES.SURPRISE],
              'neutral': result[EMOTION_TYPES.NEUTRAL]
            };
  
            const upThreshold = 10;
  
            let thresholdEmotion = (emotionType) => {
              emotionsData[emotionType] += emotionsData[EMOTION_TYPES.NEUTRAL] / 2;
              emotionsData[EMOTION_TYPES.NEUTRAL] /= 2;
            }
  
            if (emotionsData[EMOTION_TYPES.NEUTRAL] > 30) {
              if (emotionsData[EMOTION_TYPES.HAPPY] > upThreshold) {
                thresholdEmotion(EMOTION_TYPES.HAPPY);
              } else if (emotionsData[EMOTION_TYPES.SAD] > upThreshold) {
                thresholdEmotion(EMOTION_TYPES.SAD);
              } else if (emotionsData[EMOTION_TYPES.ANGRY] > upThreshold) {
                thresholdEmotion(EMOTION_TYPES.ANGRY);
              } else if (emotionsData[EMOTION_TYPES.SURPRISE] > upThreshold) {
                thresholdEmotion(EMOTION_TYPES.SURPRISE);
              } else if(emotionsData[EMOTION_TYPES.FEAR] > upThreshold) {
                thresholdEmotion(EMOTION_TYPES.FEAR);
              } else if (emotionsData[EMOTION_TYPES.DISGUST] > upThreshold) {
                thresholdEmotion(EMOTION_TYPES.DISGUST);              
              }
            }
            console.log(emotionsData)
            updateEmotion(emotionsData);
          },
          error: function (error) {
            console.log(error);
          }
        });
      }
    }, 1000);
  }

  render() {
    return (
      <div className="box">
        <Paper elevation={5} style={{ padding: 20 }}>
          <Webcam
            ref={this.setRef}
            screenshotFormat="image/png"
            style={{ maxWidth: '100%', maxHeight: 270 }}
          />
        </Paper>
      </div>
    );
  }
}

export default Camera;
