import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SentimentGraph from "./SentimentGraph";
import Chart from "chart.js";
import { Card, CardContent } from "@material-ui/core";

class OverallReport extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.calculateData = this.calculateData.bind(this);
  }
  chartRef = React.createRef();

  componentDidMount() {
    const ctx = this.chartRef.current.getContext('2d');
    const getGradient = color => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, color);   
      gradient.addColorStop(1, 'rgba(250,174,50,0)');
      return gradient;
    };
    const datasetOptions = {
      positive: {
        backgroundColor: getGradient("rgba(30, 69, 31, 0.9)"),
        data: [],
        label: 'positive'
      },
      negative: {
        backgroundColor: getGradient('rgba(231, 76, 60, 0.9)'),
        data: [],
        label: 'negative'
      },
      neutral: {
        backgroundColor: getGradient("rgba(149, 165, 166, 0.9)"),
        data: [],
        label: 'neutral'
      }
    };

    const { positiveData, negativeData, neutralData } = this.calculateData();

    this.myChart = new Chart(this.chartRef.current, {
      type: "line",
      data: {
        labels: Array(positiveData.length).fill(''),
        datasets: [
          { ...datasetOptions.positive, data: positiveData },
          { ...datasetOptions.negative, data: negativeData },
          { ...datasetOptions.neutral, data: neutralData },
        ]
      },
      options: {
        responsive: true
      }
    });
    console.log("mounted")
  }

  calculateData() {
    const negativeData = [], positiveData = [], neutralData = [];
    this.props.callData.voiceAnalysis.forEach(data => {
      positiveData.push(data.positive);
      negativeData.push(data.negative);
      neutralData.push(data.neutral);
    });
    return { negativeData, positiveData, neutralData };
  }

  componentDidUpdate() {
    // const { positiveData, negativeData, neutralData } = this.calculateData();
    // this.myChart.data.datasets[0].data = positiveData;
    // this.myChart.data.datasets[1].data = negativeData;
    // this.myChart.data.datasets[2].data = neutralData;
    // this.myChart.update();
  }

  render() {
    const { callData, totalSentiments: item } = this.props;
    const { voiceAnalysis } = callData;
    return (
      <div style={{ textAlign: 'center' }}>
        <Paper elevation={5} style={{ padding: 10 }}>
          <Typography variant="display1" style={{ marginBottom: 20 }}>
            Overall Call Report
          </Typography>
          {
            item.positive > item.negative && item.positive > item.neutral ?
              <img
                alt="final-feedback"
                src="https://www.paralleldots.com/static/images/positive.png"
              /> : (item.negative > item.positive && item.negative > item.neutral ?
                <img
                  alt="final-feedback"
                  src="https://www.paralleldots.com/static/images/negative.png"
                /> :
                <img
                  alt="final-feedback"
                  src="https://www.paralleldots.com/static/images/neutral.png"
                />
              )
          }
          <Typography variant="headline" style={{ marginBottom: 4 }}>
            Positive: {item.positive ? (Number((item.positive * 100) / item.totalDataPoints).toFixed(2) + '%') : '---'}
          </Typography>
          <Typography variant="headline" style={{ marginBottom: 4 }}>
            Negative: {item.negative ? (Number((item.negative * 100) / item.totalDataPoints).toFixed(2) + '%') : '---'}
          </Typography>
          <Typography variant="headline" style={{ marginBottom: 4 }}>
            Neutral: {item.neutral ? (Number((item.neutral * 100) / item.totalDataPoints).toFixed(2) + '%') : '---'}
          </Typography>
          </Paper>
          <Card style={{ padding: 20 }}>
            <CardContent>
              <canvas
                id="myChart"
                ref={this.chartRef}
              />
            </CardContent>
          </Card>
      </div>
    );
  }
}

export default OverallReport;
