import { A } from "@solidjs/router";
import { FaBrandsBehance, FaBrandsInstagram, FaBrandsLinkedin, FaBrandsPinterest } from "solid-icons/fa";

function SiteWideLinks() {
	return (
		<div class="position-fixed bottom-0 left-0 py-2 px-6 flex flex-items-center gap-2 text-xl font-bold h-6">
			<span class="text-sm">
				Connect :
			</span>
			<A class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/fecundlie/"><FaBrandsLinkedin /></A>
			<A class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/fecundlie/"><FaBrandsInstagram /></A>
			<A class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href="https://www.behance.net/Fecundlie"><FaBrandsBehance /></A>
			<A class="text-white hover:text-white leading-none" target="_blank" rel="noopener noreferrer" href="https://www.pinterest.com/fecundlie/"><FaBrandsPinterest /></A>
		</div>
	)
}

export default SiteWideLinks;
