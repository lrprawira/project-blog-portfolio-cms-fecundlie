import type { ComponentProps } from "solid-js"

export type CustomElement<T> = Partial<T & ComponentProps<'div'>>


