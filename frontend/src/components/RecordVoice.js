import React, { Component } from "react";
import p5 from "p5";
import "p5/lib/addons/p5.sound";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import RecordVoiceOverRounded from '@material-ui/icons/RecordVoiceOverRounded';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { ReactMic } from 'react-mic';

class RecordVoice extends Component {

	constructor(props) {
		super(props);
		this.state = {
			recording: false,
			finalSpeechText: '',
			tempSpeechText: '',
      forceEnd: false,
      minutes: 0,
      seconds: 0,
			registeredInterval: null,
			voiceCounter: 0
		};

		this.recognition = new window.webkitSpeechRecognition();
		this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      if (!this.registeredInterval)
      this.registeredInterval = setInterval(() => {
        if (this.state.seconds > 59) {
          this.setState({ minutes: this.state.minutes + 1, seconds: 0 });
        } else {
          this.setState({ seconds: this.state.seconds + 1 });
        }
      }, 1000);
    }

		this.recognition.onend = () => {
			if (this.state.recording) {
				this.recognition.start();
			} else {
        clearInterval(this.state.registeredInterval);
        this.setState({ seconds: 0, minutes: 0 });
      }
		}

		this.recognition.onresult = async (event) => {
			const resultIndex = event.resultIndex;
			const currentTranscript = event.results[resultIndex][0].transcript;
			if (event.results[resultIndex].isFinal) {
        this.setState({ finalSpeechText: this.state.finalSpeechText + ' ' + currentTranscript, tempSpeechText: '' });
        this.props.onSpeech(currentTranscript);
			} else {
				this.setState({ tempSpeechText: ' ' + currentTranscript });
			}
		}
	}

	changeRecorderState = () => {
		if (this.state.recording) {
			this.recognition.stop();
			this.setState({ recording: false });
			if (this.ampInterval) clearInterval(this.ampInterval);
			if (this.props.toggleRecordingState) this.props.toggleRecordingState();
		} else {
			if (this.props.toggleRecordingState) this.props.toggleRecordingState();
			this.setState({ recording: true });
			this.recognition.start();

			const mic = new p5.AudioIn();
			mic.start();
			const amplitudeInstance = new p5.Amplitude();
			amplitudeInstance.setInput(mic);

			let lastAmpVal = 0;
			this.ampInterval = setInterval(() => {
				const amplitude = Math.ceil(amplitudeInstance.getLevel() * 100);
				if (amplitude - lastAmpVal > 15) this.setState({
					voiceCounter: this.state.voiceCounter + 1
				});
				
				if (this.state.voiceCounter < 5 && this.state.voiceCounter >= 2) this.handleAmplitude('Harsh');
				else if(this.state.voiceCounter >= 5) this.handleAmplitude('Rude');
				else this.handleAmplitude('Polite');

				// console.log('calculating pitch...');

				lastAmpVal = amplitude;
			}, 100);
		}
	}

	handleAmplitude = (result) => {
		this.props.showResult(result);
	}

	onSpeechData = (data) => {
		// console.log(data);
	}

	render() {
		return (
			<div className="box">
				<Paper elevation={5} style={{ padding: 20 }}>
					<div className="center-sm">
						<div className="row" style={{ padding: 8 }}>
							<div className="col-sm-12">
								<div className="box">
									<img
										src="https://cdn0.iconfinder.com/data/icons/thin-communication-messaging/57/thin-217_call_support_phone_help_assistance-512.png"
                    style={{ width: 70 }}
                    alt="assisstant"
									/>
								</div>
							</div>
						</div>

						<Paper style={{ padding: 10, margin: 10, background: 'lightgrey' }}>
							{this.state.finalSpeechText + this.state.tempSpeechText || '...'}
						</Paper>

						<ReactMic
							record={this.state.recording}
							className="sound-wave"
							onStop={this.onStop}
							onData={this.onSpeechData}
							strokeColor="#000"
							backgroundColor="#fff"
						/>

						<Button
							variant="extendedFab"
							style={{ background: this.state.recording ? '#f44336' : '#4caf50' }}
							onClick={this.changeRecorderState}
						>
							{
								this.state.recording ?
									<RecordVoiceOverRounded style={{ marginRight: 10 }} /> :
									<PlayArrow/>
							}
              {/* {this.state.recording ? 'Recording...' : 'Play'} */}
              {
                this.state.recording ?
                ((this.state.minutes < 10 ? '0' + this.state.minutes : this.state.minutes)
                  + ' : ' + 
                (this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds)) :
                'Play'
              }
						</Button>
					</div>
				</Paper>
			</div>
		);
	}
}

export default RecordVoice;
