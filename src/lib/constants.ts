const sidebarEntryDataFactory = (args: { name?: string, target?: string, prefix?: string, type?: 'link' | 'text' | 'separator', indented?: boolean }) => {
	const {
		name,
		target = '',
		prefix = '/',
		type = 'link',
		indented = false,
	} = args;

	return {
		name,
		target: `${prefix}${target ?? ''}`,
		type,
		indented,
	}
};

const pointers = {
	title: 'Lie Fecund',
	favicon: 'https://d37b3blifa5mva.cloudfront.net/000_clients/716643/file/32x32-716643ROvugApx.ico',
	sidebarHomeImage: 'https://d37b3blifa5mva.cloudfront.net/000_clients/716643/file/716643AYnUy4aM.png',
	sidebarList: [
		sidebarEntryDataFactory({ name: 'About Me', target: 'about-me' }),
		sidebarEntryDataFactory({ type: 'separator' }),
		sidebarEntryDataFactory({ name: 'Personal Blog', target: 'personal-blog' }),
		sidebarEntryDataFactory({ type: 'separator' }),
		sidebarEntryDataFactory({ name: '3D Works', type: 'text' }),
		sidebarEntryDataFactory({ name: 'Hai Dudu', prefix: '/portfolio/', target: 'hai-dudu', indented: true }),
		sidebarEntryDataFactory({ name: 'Momotaro - AR Game', prefix: '/portfolio/', target: 'momotaro', indented: true }),
		sidebarEntryDataFactory({ name: 'MCI - Singapore', prefix: '/portfolio/', target: 'mci-sg', indented: true }),
		sidebarEntryDataFactory({ type: 'separator' }),
		sidebarEntryDataFactory({ name: '2D Works', type: 'text' }),
		sidebarEntryDataFactory({ name: 'NCS - IOT', prefix: '/portfolio/', target: 'ncs-iot', indented: true }),
		sidebarEntryDataFactory({ type: 'separator' }),
		sidebarEntryDataFactory({ name: 'Personal Artworks', type: 'text' }),
		sidebarEntryDataFactory({ name: 'NFT Fanart', prefix: '/portfolio/', target: 'nft-fanart', indented: true }),
	],
	blogEntries: new Map(
		[
			['hantu-lokal', null],
		]
	),
}

export default pointers;
