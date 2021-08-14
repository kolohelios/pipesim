import * as React from 'react';
import { createMachine, interpret } from '@xstate/fsm';
import Plot from 'react-plotly.js';

const toggleMachine = createMachine(
	{
		id: 'toggle',
		context: {
			accumulatedData: 0,
			connected: true,
		},
		initial: 'connected',
		states: {
			connected: {
				on: {
					TOGGLE: 'disconnected',
					HANDLE_DATA: 'handleData',
				},
			},
			disconnected: { on: { TOGGLE: 'connected' } },
			handleData: { always: [{}] },
		},
	},
	{
		actions: {
			collectData: (context, event) => {},
		},
	},
);

const toggleService = [];

const numberOfDevices = 3;

for (let i = 0; i < numberOfDevices; i++) {
	toggleService[i] = interpret(toggleMachine).start();

	toggleService[i].subscribe((state) => {
		console.log(state);
		console.log(toggleService[i].state);
		console.log(i, state.value);
	});

	setInterval(() => {
		if (Math.random() > 0.95) {
			toggleService[i].send('TOGGLE');
		}
		toggleService[i].send('HANDLE_DATA');
	}, 1000);
}

export const Application: () => JSX.Element = () => (
	<div>
		<Plot
			data={[
				{
					x: [1, 2, 3],
					y: [2, 6, 3],
					type: 'scatter',
					mode: 'lines+markers',
					marker: { color: 'red' },
				},
				{ type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
			]}
			layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
		/>
	</div>
);
