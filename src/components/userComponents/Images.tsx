import { customElement, noShadowDOM } from 'solid-element';
import { CustomElement } from './types';
import { ParentComponent } from 'solid-js';

const componentTag = 'bpc-images';

const Images: ParentComponent = (props) => {
	noShadowDOM();
	return (
		<div class={`${componentTag} grid gap-2 grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))]`}>
			{(props.children instanceof HTMLCollection) ? Array.from(props.children).map((x) => {
				(x as HTMLElement).style.width = '100%';
				return x;
			}) : null}
		</div>
	);
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			[componentTag]: CustomElement<typeof Images>
		}
	}
}

customElement(componentTag, {children: <></>}, Images);

export default Images;

