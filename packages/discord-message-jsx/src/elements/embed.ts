import { Colors } from "../colors";
import { asArray } from "./message";
import { CC, Context, Element, inject, Phantomic, RootElement } from "./util";

// embeds
export interface EmbedsElement extends Phantomic<Element, "embeds"> {

}
export type EmbedsChild = EmbedElement | Element;
export interface EmbedsProps {
  children: EmbedsChild | EmbedsChild[];
}
//embed
export interface EmbedElement extends Phantomic<Element, "embed"> {
}
export type ColorResolvable = string | number | [number, number, number];
export type EmbedChild = TitleElement | string | Element;
export interface EmbedProps {
  children: EmbedChild | EmbedChild[];
  color?: string | number;
  timestamp?: number | Date;
}
// embed.title
export interface TitleElement extends CC<"title"> {
}
export type TitleChild = string | [];
export interface TitleProps {
  children?: TitleChild;
  url?: string;
}
//embed.fields
export interface FieldsElement extends Phantomic<Element, "fields"> {

}
export type FieldsChild = FieldElement | Element;
export interface FieldsProps {
  children?: FieldsChild | FieldsChild[];
}
//embed.fields[number]
export interface FieldElement extends Phantomic<RootElement, "field"> {

}
export type FieldChild = string;
export interface FieldProps {
  children: FieldChild;
  name: string;
  inline?: boolean;
}
//embed.footer
export interface FooterElement extends Phantomic<Element, "footer"> {

}
export type FooterChild = string;
export interface FooterProps {
  children: FooterChild;
  icon_url?: string;
}
// embed.author
export interface AuthorElement extends Phantomic<Element, "author"> {

}
export type AuthorChild = string;
export interface AuthorProps {
  children?: AuthorChild;
  url?: string;
  icon_url?: string;
}
// embed.thumbnail
export interface ThumbnailElement extends Phantomic<Element, "thumbnail"> {

}
export interface ThumbnailProps {
  url?: string;
}
// embed.image
export interface ImageElement extends Phantomic<Element, "image"> {

}
export interface ImageProps {
  url?: string;
}

function renderSingleProperty<K extends string, R>(props: { [k in K]?: R }, k: K): [] | [[K, R | undefined]] {
  {
    if (!props[k]) {
      return [];
    }
    if (Array.isArray(props[k])) {
      return [];
    }
    return [[k, props[k]]];
  }
}
function resolveColor(color: ColorResolvable | undefined): number {
  if (color == null) {
    return Colors.DEFAULT;
  }
  if (typeof color === "number") {
    return color;
  }
  if (Array.isArray(color)) {
    const [r, g, b] = color;
    return r << 4 | g << 2 | b;
  }
  if (color in Colors) {
    return Colors[color as keyof typeof Colors];
  }
  throw new TypeError();
}

export const embed_elements = {
  embeds(props: EmbedsProps, key?: string): EmbedsElement {
    return inject("embeds", {
      render(ctx: Context<"child" | "root">): any {
        const v = asArray(props.children).map(e => ctx.render(e, { context: "root" }));
        return ctx.context === "root" ? v : [["embeds", v]];
      }
    });
  },
  embed(props: EmbedProps, key?: string): EmbedElement {
    return inject("embed", {
      render(ctx: Context<"root" | "child">): any {
        const embed = {
          ...Object.fromEntries(asArray(props.children).flatMap(e => {
            if (typeof e === "string") {
              return [["description", e]];
            }
            return ctx.render(e, { context: "child" });
          })),
          color: resolveColor(props.color),
          timestamp: typeof props.timestamp === "number" ? props.timestamp : props.timestamp?.getDate() ?? undefined
        };
        switch (ctx.context) {
          case "child":
            return [["embed", embed]];
          case "root":
            return embed;
        }
      }

    });
  },
  title(props: TitleProps, key?: string): TitleElement {
    return inject("title", {
      render() {
        const title = props.children;

        return [["title", title], ...renderSingleProperty(props, "url")]
      }
    });
  },
  fields(props: FieldsProps): FieldsElement {
    return inject("fields", {
      render(ctx: Context<"child" | "root">): any {
        const v = asArray(props.children).map(e => ctx.render(e, { context: "root" }));
        return ctx.context === "root" ? v : [["fields", v]];
      }
    });
  },
  field(props: FieldProps): FieldElement {
    return inject("field", {
      render() {
        return {
          name: props.name,
          value: props.children,
          inline: props.inline
        };
      }
    })
  },
  footer(props: FooterProps): FooterElement {
    return inject("footer", {
      render(ctx: Context<"root" | "child">): any {
        const v = {
          text: props.children,
          icon_url: props.icon_url
        };
        return ctx.context === "root" ? v : [["footer", v]];
      }
    });
  },
  author(props: AuthorProps): AuthorElement {
    return inject("author", {
      render(ctx: Context<"root" | "child">): any {
        const v = {
          name: props.children,
          icon_url: props.icon_url,
          url: props.url
        };
        return ctx.context === "root" ? v : [["author", v]];
      }
    });
  },
  thumbnail(props: ThumbnailProps): ThumbnailElement {
    return inject("thumbnail", {
      render(ctx: Context<"root" | "child">): any {
        const v = {
          url: props.url
        };
        return ctx.context === "root" ? v : [["thumbnail", v]];
      }
    });
  },
  image(props: ImageProps): ImageElement {
    return inject("image", {
      render(ctx: Context<"root" | "child">): any {
        const v = {
          url: props.url
        };
        return ctx.context === "root" ? v : [["image", v]];
      }
    });
  },
}