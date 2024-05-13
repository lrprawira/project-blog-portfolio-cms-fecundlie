import { A } from '@solidjs/router';
import { IoEnterOutline } from 'solid-icons/io';
function Welcome() {
	return (
		<main class="flex w-full h-full flex-items-center gap-8" style={{'background-image': 'linear-gradient(to right, transparent 1800px, rgb(8, 16, 37) 1920px), url(\'https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/images-02-9dd82b.jpg\')'}}>
			<div class="flex-1"></div>
			<div class="flex-1">
				<A href='/about-me' class='flex flex-col text-4xl text-light-200 hover:text-light-200 gap-3'>
					Welcome
					<div class="flex text-amber-300 hover:text-amber-300 flex-items-center gap-3 text-2xl"><IoEnterOutline />Enter Site</div>
				</A>
			</div>
		</main>
	)
}

export default Welcome;
