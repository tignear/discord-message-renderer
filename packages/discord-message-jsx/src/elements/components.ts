import { asArray } from "./message";
import { CC, inject, Phantomic, RootElement, Element, Context } from "./util";

export interface ComponentsElement extends CC<"components"> {

}
export type ComponentsChild = ActionRowElement | Element;
export interface ComponentsProps {
  children: ComponentsChild | ComponentsChild[];
}

export interface ActionRowElement extends Phantomic<RootElement, "action_row"> {

}
export type ActionRowChild = ButtonElement | Element;

export interface ActionRowProps {
  children: ActionRowChild | ActionRowChild[];
}

export interface ButtonElement extends Phantomic<RootElement, "button"> {

}
export type ButtonChild = string | EmojiElement | Element;
export const BUTTON_STYLES = {
  PRIMARY: 1,
  SECONDARY: 2,
  SUCCESS: 3,
  DANGER: 4,
  LINK: 5
} as const;
export interface ButtonPropsEvt {
  children?: ButtonChild | ButtonChild[];
  style: keyof Omit<typeof BUTTON_STYLES, "LINK"> | typeof BUTTON_STYLES[keyof Omit<typeof BUTTON_STYLES, "LINK">]
  custom_id: string;
  disabled?: boolean;
}
export interface ButtonPropsLnk {
  children?: ButtonChild | ButtonChild[];
  style: "LINK" | 5
  url: string;
  disabled?: boolean;
}
export type ButtonProps = ButtonPropsEvt | ButtonPropsLnk;
export type EmojiElement = UnicodeEmojiElement | CustomEmojiElement | Element;
export interface UnicodeEmojiElement extends Phantomic<RootElement, "unicode_emoji"> {

}
export type UnicodeEmojiChild = string;
export interface UnicodeEmojiProps {
  children: string
}
export interface CustomEmojiElement extends Phantomic<RootElement, "custom_emoji"> {

}
export interface CustomEmojiProps {
  id: string;
  animated?: boolean;
}
export const components_elements = {
  components(props: ComponentsProps): ComponentsElement {
    return inject("components", {
      render(ctx) {
        return [["components", asArray(props.children).map(e => ctx.render(e, { context: "root" }))]];
      },
    });
  },
  action_row(props: ActionRowProps): ActionRowElement {
    return inject("action_row", {
      render(ctx) {
        return {
          type: 1,
          components: asArray(props.children).map(e => ctx.render(e, { context: "root" })),
        };
      }
    });
  },
  button(props: ButtonProps): ButtonElement {

    const style = typeof props.style === "string" ? BUTTON_STYLES[props.style] : props.style;
    function renderChildren(ctx: Context<"root">) {
      return Object.fromEntries(asArray(props.children).map(e => {
        if (typeof e === "string") {
          return ["label", e];
        } else {
          return ["emoji", ctx.render(e, { context: "root" })];
        }
      }));
    }
    if (props.style === 5 || props.style === "LINK") {
      return inject("button", {
        render(ctx) {

          return {
            type: 2,
            style: style,
            url: props.url,
            disabled: props.disabled,
            ...renderChildren(ctx)
          };
        }
      });
    } else if (props.style === 1 || props.style === 2 || props.style === 3 || props.style === 4 || props.style === "SUCCESS" || props.style === "SECONDARY" || props.style === "DANGER" || props.style === "PRIMARY") {
      return inject("button", {
        render(ctx) {
          return {
            type: 2,
            style: style,
            custom_id: props.custom_id,
            disabled: props.disabled,
            ...renderChildren(ctx)
          };
        }
      });
    } else {
      throw new TypeError();
    }
  },
  unicode_emoji(props: UnicodeEmojiProps): UnicodeEmojiElement {
    return inject("unicode_emoji", {
      render() {
        return {
          name: props.children
        };
      }
    });
  },
  custom_emoji(props: CustomEmojiProps): CustomEmojiElement {
    return inject("custom_emoji", {
      render() {
        return {
          id: props.id,
          animated: props.animated
        };
      }
    });
  },
};