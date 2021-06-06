import { Colors } from "../colors";
import { asArray } from "./message";
import { CC, Context, Element, inject, Phantomic, RootElement } from "./util";

// embeds
export interface EmbedsElement extends CC<"embeds"> {

}
export type EmbedsChild = EmbedElement;
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
export interface FieldsElement extends CC<"fields"> {

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
export interface FooterElement extends CC<"footer"> {

}
export type FooterChild = string;
export interface FooterProps {
  children: FooterChild;
  icon_url?: string;
}
// embed.author
export interface AuthorElement extends CC<"author"> {

}
export type AuthorChild = string;
export interface AuthorProps {
  children?: AuthorChild;
  url?: string;
  icon_url?: string;
}
// embed.thumbnail
export interface ThumbnailElement extends CC<"thumbnail"> {

}
export interface ThumbnailProps {
  url?: string;
}
// embed.image
export interface ImageElement extends CC<"image"> {

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
      render(ctx): [["embeds", unknown]] {
        return [["embeds", asArray(props.children).map(e => ctx.render(e, { context: "root" }))]];
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
        switch (ctx.context ?? "root") {
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
      render(ctx) {
        return [["fields", asArray(props.children).map(e => ctx.render(e, { context: "root" }))]];
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
      render() {
        return [["footer", {
          text: props.children,
          icon_url: props.icon_url
        }]];
      }
    });
  },
  author(props: AuthorProps): AuthorElement {
    return inject("author", {
      render() {
        return [["author", {
          name: props.children,
          icon_url: props.icon_url,
          url: props.url
        }]];
      }
    });
  },
  thumbnail(props: ThumbnailProps): ThumbnailElement {
    return inject("thumbnail", {
      render() {
        return [["thumbnail", {
          url: props.url
        }]];
      }
    });
  },
  image(props: ImageProps): ImageElement {
    return inject("image", {
      render() {
        return [["image", {
          url: props.url
        }]];
      }
    });
  },
}