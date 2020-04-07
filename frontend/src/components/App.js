import React, { Component } from "react";
import 'flexboxgrid';
import OverallReport from './OverallReport';
import RecordVoice from './RecordVoice';
import KeywordsCard from './KeywordsCard';
import Camera from './Camera';
import EmotionGraph from './EmotionGraph';
import SentimentGraph from './SentimentGraph';
import { Dialog, Button, Typography } from "@material-ui/core";

const styles = {
  loud: {
    color: 'red'
  },
  bitHarsh: {
    color: 'grey'
  },
  polite: {
    color: 'green'
  }
}
class App extends Component {

  state = {
    emotionData: [],
    sentimentData: [{ name: '', positive: 0, negative: 0, neutral: 0 }],
    keywords: [],
    overallSentimentData: {
      positive: 0,
      negative: 0,
      neutral: 0,
      compound: 0,
      totalDataPoints: 0
    },
    showOverallReport: false,
    voice: null,
    recording: false,
    callData: {
      voiceAnalysis: []
    },
  }

  componentDidMount() {
    // setInterval(() => {
    //   this.setState({
    //     emotionData: [
    //       { value: Math.random(), name: 'sad' },
    //       { value: Math.random(), name: 'excited' },
    //       { value: Math.random(), name: 'sarcasm' },
    //       { value: Math.random(), name: 'fear' },
    //       { value: Math.random(), name: 'happy' },
    //       { value: Math.random(), name: 'bored' },
    //       { value: Math.random(), name: 'angry' },
    //     ],
    //     sentimentData: [
    //       this.state.sentimentData[this.state.sentimentData.length - 3],
    //       this.state.sentimentData[this.state.sentimentData.length - 2],
    //       this.state.sentimentData[this.state.sentimentData.length - 1],
    //       { name: '', positive: Math.random(), negative: Math.random(), neutral: Math.random() }
    //     ]
    //   })
    // }, 1500);
  }

  toggleOverallReport = () => {
    this.setState({ showOverallReport: !this.state.showOverallReport });
  }

  onSpeech = (text) => {
    fetch(
      'http://localhost:4000/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      }
    ).then(res => res.json())
      .then(res => {

        const sentimentData = res.sentiments.probabilities;
        const totalSentimentData = {
          positive: this.state.overallSentimentData.positive + sentimentData.positive,
          negative: this.state.overallSentimentData.negative + sentimentData.negative,
          neutral: this.state.overallSentimentData.neutral + sentimentData.neutral,
          compound: this.state.overallSentimentData.compound + sentimentData.compound,
          totalDataPoints: this.state.overallSentimentData.totalDataPoints + 1
        };

        console.log(sentimentData);
        const { voiceAnalysis } = this.state.callData;
        this.setState({
          callData: {
            voiceAnalysis: voiceAnalysis.concat(sentimentData),
          }
        }, () => {
          console.log(this.state.callData.voiceAnalysis);
        });

        this.setState({
          'keywords': res.keywords.keywords,
          'sentimentData': [
            this.state.sentimentData[this.state.sentimentData.length - 3],
            this.state.sentimentData[this.state.sentimentData.length - 2],
            this.state.sentimentData[this.state.sentimentData.length - 1],
            res.sentiments.probabilities,
          ],
          'abusive': res.abuse,
          'overallSentimentData': totalSentimentData
        }/*, () => console.log(this.state.overallSentimentData)*/);
      })
  }

  toggleRecordingState = () => {
    this.setState({ recording: !Boolean(this.state.recording) });
  }

  updateEmotion = (emotions) => {
    if (!this.state.recording) return;
    const emotionData = [];
    for (let [key, value] of Object.entries(emotions)) {
      emotionData.push({ name: key, value });
    }
    console.log(emotionData);
    this.setState({
      'emotionData': emotionData
    });
  }

  voiceResult = (voice) => {
    if (this.state.voice !== voice) {
      this.setState({ voice })
      console.log('updating pitch...');
    }
  }

  render() {
    return (
      <div>
        <div className="row around-sm">
          <div className="col-sm-4" style={{ marginTop: 30 }}>
            <RecordVoice onSpeech={this.onSpeech} toggleRecordingState={this.toggleRecordingState} showResult={this.voiceResult}/>
          </div>
          <div className="col-sm-3" style={{ marginTop: 30 }}>
            <div className="row">
              <div className="col-sm-12">
                <div className="box">
                  <KeywordsCard list={this.state.keywords} />
                </div>
                <div className="box" style={{ position: 'relative', textAlign: 'center', marginTop: 20 }}>
                  <Dialog open={this.state.showOverallReport} onClose={this.toggleOverallReport} fullWidth={true} maxWidth={"xl"}>
                    <OverallReport
                      totalSentiments={this.state.overallSentimentData}
                      callData={this.state.callData}
                    />
                  </Dialog>
                  {!this.state.showOverallReport && <Button variant="contained" onClick={this.toggleOverallReport}>Show Overall Report</Button>}
                </div>
                {
                  this.state.voice ? (
                  <div className="box" style={{ position: 'relative', textAlign: 'center', marginTop: 26 }}>
                    <Typography variant="headline">User Tone: <b style={this.state.voice === 'Rude' ? styles.loud : (this.state.voice === 'Polite' ? styles.polite : styles.bitHarsh)}>{this.state.voice}</b></Typography>
                  </div>
                  ) : null
                }
              </div>
            </div>
          </div>
          {
            <div className="col-sm-4" style={{ marginTop: 30 }}>
              <Camera
                recording={this.state.recording}
                updateEmotion={this.updateEmotion}
              />
            </div>
          }
        </div>
        <div className="row around-sm" style={{ height: 300 }}>
          {
            <div className="col-sm-6" style={{ marginTop: 25 }}>
              <EmotionGraph emotionData={this.state.emotionData} />
            </div>
          }
          <div className="col-sm-6" style={{ marginTop: 25 }}>
            <SentimentGraph sentimentData={this.state.sentimentData} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
