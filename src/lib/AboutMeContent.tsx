import { Index } from "solid-js";
import constants from "../lib/constants";
import "../components/userComponents/Images";

const tableContent = [
  ["Cinema 4D", "Substance Painter", "Adobe Photoshop"],
  ["3ds Max", "Octane / Redshift renderer", "Adobe Illustrator"],
  ["Zbrush", "Keyshot", "Adobe After Effect"],
];
const RightSideContent = () => (
  <>
    <p class="m-0">
      Fecund has 6+ years of experience in 3D modeling industry. Working in many
      3D field like mobile apps and games, 3D advertising, toys and 3D printing.
      He loves technology, toys, games and architecture. He believe in as the
      technology will be developed stronger and better, the 3D industry will
      make their vital role as a bridge for communication's gap.
    </p>
    <p class="my-8">
      Technically, his main focus is in 3D modeling skills, especially in 3D
      product designer, asset productions, and toys characters. It makes him a
      versatile 3D artist for any kind of project. He is also a fast learner, so
      it makes him open for any kind of new knowledge. Fecund has the unique
      combination of skills and collaborative spirit which empowers him to
      dedicate himself to give the best thing that he has.
    </p>
    <p class="my-8">
      He is currently living in Jakarta, but he is also willing to move whenever
      he is needed. He thinks that time is precious, that is why he loves
      traveling with his family. Last but important, he always captures
      everything through his lens because he wants to cherish
      every moment of life.
    </p>
    <p class="my-8">
      Contact:&nbsp; Feel free to drop me a message here or write me at{" "}
      <a
        class="text-color-green hover:text-color-lime"
        href={`mailto:${constants.contacts.email}`}
      >
        {constants.contacts.email}
      </a>
    </p>
    <div class="my-8">
      Social Media:
      <table class={"w-full"}>
        <tbody>
          <tr>
            <td>-</td>
            <td>
              <a
                class="text-color-green hover:text-color-lime"
                href={constants.contacts.instagram}
              >
                Instagram
              </a>
            </td>
            <td>-</td>
            <td>
              <a
                class="text-color-green hover:text-color-lime"
                href={constants.contacts.linkedin}
              >
                Linkedin
              </a>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-8">
      Software:
      <table class={"w-full"}>
        <tbody>
          <Index each={tableContent}>
            {(row) => (
              <tr>
                <td class="align-start">-</td>
                <td class="align-start">{row()[0]}</td>
                <td class="align-start">-</td>
                <td class="align-start">{row()[1]}</td>
                <td class="align-start">-</td>
                <td class="align-start">{row()[2]}</td>
              </tr>
            )}
          </Index>
        </tbody>
      </table>
    </div>
    <div>
      <bpc-images min-size={150}>
        <picture>
          <source
            srcset="/data/about-me/7166432JlTrOMi.avif"
            type="image/avif"
          />
          <source
            srcset="/data/about-me/7166432JlTrOMi.webp"
            type="image/webp"
          />
          <img src="/data/about-me/7166432JlTrOMi.png" alt="" loading="lazy" />
        </picture>
        <picture>
          <source
            srcset="/data/about-me/716643qu7bH3bo.avif"
            type="image/avif"
          />
          <source
            srcset="/data/about-me/716643qu7bH3bo.webp"
            type="image/webp"
          />
          <img src="/data/about-me/716643qu7bH3bo.png" alt="" loading="lazy" />
        </picture>
        <picture>
          <source
            srcset="/data/about-me/716643pk0JcOEJ.avif"
            type="image/avif"
          />
          <source
            srcset="/data/about-me/716643pk0JcOEJ.webp"
            type="image/webp"
          />
          <img src="/data/about-me/716643pk0JcOEJ.png" alt="" loading="lazy" />
        </picture>
      </bpc-images>
    </div>
  </>
);

export default () => (
  <>
    <div class={"flex-1"}>
      <picture>
        <source
          srcset="/data/about-me/photo-profile-caf364.avif"
          type="image/avif"
        />
        <source
          srcset="/data/about-me/photo-profile-caf364.webp"
          type="image/webp"
        />
        <img
          src="/data/about-me/photo-profile-caf364.jpg"
          alt="Profile Picture"
          class="w-full"
          loading="lazy"
        />
      </picture>
    </div>
    <div
      class={
        "flex-1 font-abeezee text-base lh-relaxed color-[#BFC0C9] tracking-wide"
      }
    >
      <RightSideContent />
    </div>
  </>
);
