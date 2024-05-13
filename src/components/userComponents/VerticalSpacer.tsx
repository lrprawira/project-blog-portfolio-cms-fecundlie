import { customElement, noShadowDOM } from 'solid-element';
import { CustomElement } from './types';
import { Component } from 'solid-js';

const componentTag = 'bpc-vertical-spacer';

const VerticalSpacer: Component<{size?: number}> = (props) => {
	noShadowDOM();
	return (
		<div class={`${componentTag}`} style={{height: `${props.size ?? 1 * .25}em`}}></div>
	);
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			[componentTag]: CustomElement<typeof VerticalSpacer>
		}
	}
}

customElement(componentTag, {size: 1}, VerticalSpacer);

export default VerticalSpacer;


