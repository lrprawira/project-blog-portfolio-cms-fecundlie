import type { ComponentProps, ValidComponent } from "solid-js"

export type CustomElement<T extends ValidComponent> = Partial<ComponentProps<T>>


