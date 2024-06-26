import { defineConfig, presetWebFonts, transformerDirectives } from "unocss";
import { presetUno } from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "bunny",
      fonts: {
        abeezee: "ABeeZee",
        inter: "Inter:300,400,700",
      },
    }),
  ],
  transformers: [transformerDirectives()],
});
