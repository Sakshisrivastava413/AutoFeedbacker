import React, { Component } from "react";

import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";

import {
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Bar
} from 'recharts';

class EmotionGraph extends Component {
	render() {
		return (
			<div className="box center-sm">
				<Paper elevation={5} style={{ padding: 20 }}>
					<div className="row">
						<div className="col-sm-12">
							<div className="box">
								<BarChart
									width={600}
									height={320}
									data={this.props.emotionData}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar name="Intensity of Emotion" dataKey="value" fill="#4caf50" />
								</BarChart>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
							<div className="box">
								<Typography variant="headline">
									Video Analysis
								</Typography>
							</div>
						</div>
					</div>
				</Paper>
			</div>
		);
	}
}

export default EmotionGraph;
