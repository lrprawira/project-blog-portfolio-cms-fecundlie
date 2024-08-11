import { createSignal } from "solid-js";
import constants from "../lib/constants";
import { A } from "@solidjs/router";
import {
  FaBrandsBehance,
  FaBrandsInstagram,
  FaBrandsLinkedin,
  FaBrandsPinterest,
  FaRegularEnvelope,
} from "solid-icons/fa";
import { useAdminStore } from '../lib/states';

function SiteWideLinks() {
  const [secretAdminPaneClicks, setSecretAdminPaneClicks] = createSignal(0);
	const toggleAdmin = useAdminStore((state) => state.toggleAdmin);
  function handleToggleAdmin() {
		toggleAdmin();
		setSecretAdminPaneClicks(() => 0);
  }
  function handleEmailClick(ev: MouseEvent) {
    if (!ev.altKey) {
      setSecretAdminPaneClicks(() => 0);
      return;
    }
    setSecretAdminPaneClicks((prev) => prev + 1);
    ev.stopPropagation();
    if (secretAdminPaneClicks() < 5) {
      return;
    }
    handleToggleAdmin();
  }
  return (
    <div class="position-fixed bottom-0 left-0 py-2 px-6 flex flex-items-center gap-2 text-xl font-bold h-6">
      <span class="text-sm">Connect :</span>
      <A
        class="text-white hover:text-white leading-none"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        href={constants.contacts.linkedin}
      >
        <FaBrandsLinkedin />
      </A>
      <A
        class="text-white hover:text-white leading-none"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        href={constants.contacts.instagram}
      >
        <FaBrandsInstagram />
      </A>
      <A
        class="text-white hover:text-white leading-none"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Behance"
        href={constants.contacts.behance}
      >
        <FaBrandsBehance />
      </A>
      <A
        class="text-white hover:text-white leading-none"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pinterest"
        href={constants.contacts.pinterest}
      >
        <FaBrandsPinterest />
      </A>
      <a
        class="text-white hover:text-white leading-none"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Email"
        href={`mailto:${constants.contacts.email}`}
        onClick={handleEmailClick}
      >
        <FaRegularEnvelope />
      </a>
    </div>
  );
}

export default SiteWideLinks;
