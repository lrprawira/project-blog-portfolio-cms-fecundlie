import BlogEntry from '../components/BlogEntry';

// User components
import '../components/userComponents/Images';

function PersonalBlog() {
	const blogEntries = [
		{
			title: 'Hantu Lokal #1',
			content: `
			<p>Hantu Lokal or Local Indonesian Ghost is a series that I made as my personal toys collection. Every series is up to 6 characters.</p>
			<p>I was thinking what to do this October? So I took the closest thing around me, it had to be spooky, but cute in the same time.</p>
			<p>Not forgetting the touch of fun and cartoon as I like that kind of style.</p>
			<bpc-images>
				<img src="https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/h400-716643AUtQvKcy.png" />
				<img src="https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/h400-716643ZmdPyBWf.png" />
				<img src="https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/h400-716643Yst9W5Zz.png" />
				<img src="https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/h400-716643uxMIGxAu.png" />
				<img src="https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/h400-716643shwfURsb.png" />
				<img src="https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/h400-716643ncJX0TS6.png" />
				<img src="https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/h400-7166436xxHXaJD.png" />
				<img src="https://d37b3blifa5mva.cloudfront.net/000_clients/716643/page/h400-716643rheEnBPb.png" />
			</bpc-images>
			`,
			timestamp: Math.floor(Date.now() / 1000),
		},
	];
	return (
		<div class="flex flex-1 flex-justify-center mt-8">
			<div class="flex flex-col max-w-275 w-75% gap-16">
				{
					blogEntries.map(blogEntry => <BlogEntry title={blogEntry.title} content={blogEntry.content} timestamp={blogEntry.timestamp} />)
				}
			</div>
		</div>
	)
}

export default PersonalBlog;
