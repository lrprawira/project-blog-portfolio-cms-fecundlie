import { Component, Show } from "solid-js"

const BlogEntry: Component<{ slug: string, title?: string, content?: string, timestamp?: number }> = (props) => {
	const content = props.content?.replace(/(src|srcset)=["'](?!https?:\/\/)(.+?)["']/g, `$1="/data/personal-blog/${props.slug}.d/$2"`);
	console.log(content);
	return (
		<div class="w-full text-sm">
			<h1 class="text-2xl text-slate font-bold uppercase">{props.title ?? 'Untitled'}</h1>
			<div class="text-base font-light" innerHTML={content ?? '(no content)'}></div>
			<div class="mt-8 text-gray-400">
				<Show when={props.timestamp !== undefined} fallback={'Invalid Date'}>
					{new Date((props.timestamp!) * 1000).toLocaleDateString('en-SG', {
						weekday: 'long',
						day: '2-digit',
						month: 'long',
						year: 'numeric',
					})}
				</Show>
			</div>
		</div>
	);
}

export default BlogEntry;
