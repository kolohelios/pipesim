import * as React from 'react';
import { assign, createMachine, interpret } from '@xstate/fsm';
import Plot from 'react-plotly.js';
import random from 'random';

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
					HANDLE_DATA: { actions: ['collectData'] },
				},
			},
			disconnected: {
				on: {
					TOGGLE: 'connected',
					HANDLE_DATA: { actions: ['collectData'] },
				},
			},
		},
	},
	{
		actions: {
			collectData: assign({
				accumulatedData: (context) => context.accumulatedData + 100,
			}),
		},
	},
);

const toggleService = [];

const numberOfDevices = 3;

for (let i = 0; i < numberOfDevices; i++) {
	toggleService[i] = interpret(toggleMachine).start();

	toggleService[i].subscribe((state) => {
		console.log(state);
	});

	setInterval(() => {
		if (random.int(0, 100) > 95) {
			toggleService[i].send('TOGGLE');
		}
		toggleService[i].send('HANDLE_DATA');
	}, 3000);
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
