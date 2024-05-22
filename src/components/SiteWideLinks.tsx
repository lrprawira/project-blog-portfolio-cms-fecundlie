import constants from '../lib/constants';
import { A } from "@solidjs/router";
import { FaBrandsBehance, FaBrandsInstagram, FaBrandsLinkedin, FaBrandsPinterest, FaRegularEnvelope } from "solid-icons/fa";

function SiteWideLinks() {
	return (
		<div class="position-fixed bottom-0 left-0 py-2 px-6 flex flex-items-center gap-2 text-xl font-bold h-6">
			<span class="text-sm">
				Connect :
			</span>
			<A class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href={constants.contacts.linkedin}><FaBrandsLinkedin /></A>
			<A class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href={constants.contacts.instagram}><FaBrandsInstagram /></A>
			<A class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href={constants.contacts.behance}><FaBrandsBehance /></A>
			<A class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href={constants.contacts.pinterest}><FaBrandsPinterest /></A>
			<a class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href={`mailto:${constants.contacts.email}`}><FaRegularEnvelope /></a>
		</div>
	)
}

export default SiteWideLinks;
