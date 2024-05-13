import {
	useNavigate
} from '@solidjs/router';
import {
	createEffect, createSignal
} from 'solid-js';
function NotFound() {
	const navigate = useNavigate();
	const [countdownInt, setCountDownInt
	] = createSignal(5);

	let interval: NodeJS.Timeout;
	createEffect(() => {
		interval = setInterval(() => {
			console.log('running interval', countdownInt())
			if (countdownInt() <= 0) {
				clearInterval(interval);
				navigate('/',
				{
						replace: true
				});
			}
			setCountDownInt(prev => prev - 1);
		},
		1000);
	})
	return (
		<div class='flex flex-justify-center flex-align-center w-full h-full flex-col text-center'>
			<div class='mb-8'>
				<div class={'text-8xl font-bold'}>
					4<span class='text-7xl'>0</span>4
				</div>
				<div class='text-3xl font-bold'>Not Found</div>
			</div>
			<div class={'text-xl mb-2'}>
				Sorry, we could not resolve that address or perhaps the link is broken.
			</div>
			<div class='text-xl mb-2'>
				Redirecting to the main page in
			</div>
			<div class='text-4xl'>
			{countdownInt() > 0 ? `${countdownInt()}` : 'now'}
			</div>
		</div>
	)
}

export default NotFound;
