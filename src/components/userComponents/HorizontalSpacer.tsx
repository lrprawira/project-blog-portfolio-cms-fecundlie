import { customElement, noShadowDOM } from 'solid-element';
import { CustomElement } from './types';
import { Component } from 'solid-js';

const componentTag = 'bpc-horizontal-spacer';

const HorizontalSpacer: Component<{size?: number}> = (props) => {
	noShadowDOM();
	return (
		<div class={`${componentTag}`} style={{width: `${props.size ?? 1 * .25}em`}}></div>
	);
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			[componentTag]: CustomElement<typeof HorizontalSpacer>
		}
	}
}

customElement(componentTag, {size: 1}, HorizontalSpacer);

export default HorizontalSpacer;

