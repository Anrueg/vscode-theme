import * as fs from "node:fs"
import Color from "color"

const WHAT_IS_THIS = "#FF0000"

interface Theme {
    bg: string
    fg: string
    blueish: string
    greenish: string
    yellowish: string
    pinkish: string
    redish: string
    cyanish: string
    brownish: string
    violetish: string
    comment: string
    punctuation: string
    ui: ThemePair
    uiAccent: ThemePair
    uiFocus: ThemePair
    uiPopover: ThemePair
}

interface ThemePair {
    color: string
    fg: string
}

function theme(theme: Theme) {
    const { bg, fg, greenish, brownish, yellowish, redish, violetish, cyanish, blueish, comment, punctuation, pinkish, ui, uiAccent, uiPopover, uiFocus } = theme
    const tokens: Schema = normalizeTokens({
        fg: { foreground: fg },
        comment: { foreground: comment },
        string: { foreground: greenish },
        selfDef: { foreground: brownish },
        selfRef: { foreground: brownish },
        propertyDef: { foreground: darken(fg, 0.3) },
        propertyRef: { foreground: fg },
        variableDef: { foreground: fg },
        variableRef: { foreground: fg },
        typeDef: { foreground: redish },
        typeRef: { foreground: redish },
        functionDef: { foreground: violetish },
        functionRef: { foreground: violetish },
        // typeDef: { foreground: violetish  },
        // typeRef: { foreground: violetish },
        // functionDef: { foreground: redish },
        // functionRef: { foreground: redish },
        paramDef: { foreground: cyanish },
        paramRef: { foreground: cyanish },
        punctuation: { foreground: punctuation },
        decorator: { foreground: blueish },
        keyword: { foreground: yellowish },
        constant: { foreground: pinkish },
        // lifetime: { foreground: pinkish },
        // interpolation: {foreground: redish}
    })

    const popoverBorder = uiAccent.color
    const border = lighten(bg, 0.2)
    const selected = alpha(uiAccent.color, 0.1)
    const selectedFg = uiAccent.color
    const appShell = darken(ui.color, 0.3)
    const editorSelection = lighten(bg, 0.8)

    return {
        name: "Anrueg",
        colors: {
            "foreground": fg,
            "disabledForeground": alpha(fg, 0.5),
            "editor.background": bg,
            "editor.foreground": fg,
            "selection.background": uiAccent.color,
            "focusBorder": alpha(uiAccent.color, 0.5),
            "descriptionForeground": comment,
            "errorForeground": redish,
            "icon.foreground": uiAccent.color,
            "widget.border": uiAccent.color,
            "widget.shadow": alpha(uiAccent.color, 0.2),

            "textLink.activeForeground": blueish,
            "textLink.foreground": blueish,

            "titleBar.activeBackground": appShell,
            "titleBar.activeForeground": uiAccent.color,
            "titleBar.inactiveBackground": appShell,
            "titleBar.inactiveForeground": uiAccent.color,
            // "titleBar.border": border,

            "panel.border": border,
            "panel.background": ui.color,
            // "panelTitle.background": ui.color,
            "panelTitle.border": border,
            "panelInput.border": alpha(border, 0),
            "panelTitle.activeForeground": selectedFg,
            "panelTitle.inactiveForeground": alpha(uiAccent.color, 0.3),

            "terminal.border": border,
            ...terminal(theme),

            "statusBar.background": ui.color,
            "statusBar.foreground": uiAccent.color,
            "statusBar.border": border,

            "sideBar.background": ui.color,
            "sideBar.foreground": ui.fg,
            // "sideBar.border": border,
            "sideBarTitle.background": appShell,
            "sideBarTitle.foreground": ui.fg,
            // "sideBarTitle.border": border,
            "sideBarSectionHeader.background": appShell,
            "sideBarSectionHeader.foreground": ui.fg,
            "sideBarActivityBarTop.border": uiAccent.color,

            "editorGroup.border": uiAccent.color,
            "editorGroup.dropBackground": alpha(uiAccent.color, 0.3),
            "editorGroupHeader.noTabsBackground": appShell,
            "editorGroupHeader.tabsBackground": appShell,
            "editorGroupHeader.tabsBorder": uiAccent.color,
            "editorGroupHeader.border": uiAccent.color,
            "breadcrumb.foreground": ui.fg,
            "breadcrumb.focusForeground": selectedFg,
            "breadcrumb.activeSelectionForeground": selectedFg,
            "breadcrumbPicker.background": appShell,

            "activityBar.background": ui.color,
            "activityBarTop.background": appShell,
            "activityBar.foreground": selectedFg,
            "activityBarTop.foreground": selectedFg,
            "activityBar.inactiveForeground": alpha(uiAccent.color, 0.5),
            "activityBarTop.inactiveForeground": alpha(uiAccent.color, 0.5),
            "activityBar.border": border,
            "activityBarBadge.background": uiAccent.color,
            "activityBarBadge.foreground": uiAccent.fg,
            "activityWarningBadge.foreground": fg,
            "activityWarningBadge.background": yellowish,
            "activityErrorBadge.foreground": fg,
            "activityErrorBadge.background": redish,
            "activityBar.activeBorder": selectedFg,
            "activityBar.activeBackground": selected,
            "activityBar.activeFocusBorder": uiFocus.color,
            "activityBarTop.activeBorder": selectedFg,
            "activityBarTop.activeBackground": selected,

            "button.background": uiAccent.color,
            "button.foreground": uiAccent.fg,
            "button.border": uiAccent.color,
            "button.hoverBackground": lighten(uiAccent.color, 0.3),
            "button.secondaryBackground": ui.color,
            "button.secondaryForeground": ui.fg,
            "button.secondaryHoverBackground": lighten(ui.color, 0.3),

            "dropdown.background": border,
            "dropdown.border": border,
            "dropdown.foreground": ui.fg,
            "dropdown.listBackground": border,

            "input.background": border,
            "input.border": border,
            "input.foreground": ui.fg,
            "input.placeholderForeground": alpha(ui.fg, 0.4),
            "inputOption.activeBackground": uiAccent.color,
            "inputOption.activeBorder": uiAccent.color,
            "inputOption.activeForeground": uiAccent.fg,
            "inputOption.hoverBackground": uiAccent.color,
            "inputValidation.errorBackground": redish,
            "inputValidation.errorBorder": redish,
            "inputValidation.errorForeground": bg,
            "inputValidation.infoBackground": blueish,
            "inputValidation.infoBorder": blueish,
            "inputValidation.infoForeground": fg,
            "inputValidation.warningBackground": yellowish,
            "inputValidation.warningBorder": yellowish,
            "inputValidation.warningForeground": bg,

            "scrollbar.shadow": alpha(uiAccent.color, 0.5),
            "scrollbarSlider.activeBackground": alpha(uiAccent.color, 0.8),
            "scrollbarSlider.background": alpha(uiAccent.color, 0.1),
            "scrollbarSlider.hoverBackground": alpha(uiAccent.color, 0.2),

            "badge.foreground": uiAccent.color,
            "badge.background": ui.color,

            "list.activeSelectionBackground": alpha(uiAccent.color, 0.1),
            "list.activeSelectionForeground": ui.fg,
            "list.dropBackground": alpha(uiAccent.color, 0.1),
            "list.focusBackground": alpha(uiAccent.color, 0.2),
            "list.focusOutline": alpha(ui.color, 0),
            "list.inactiveFocusOutline": alpha(ui.color, 0),
            "list.focusAndSelectionOutline": alpha(ui.color, 0),
            "list.hoverBackground": alpha(uiAccent.color, 0.1),
            "list.highlightForeground": uiAccent.color,
            "list.inactiveSelectionBackground": alpha(uiAccent.color, 0.1),
            "list.invalidItemForeground": pinkish,
            "list.errorForeground": redish,
            "list.warningForeground": yellowish,
            "list.deemphasizedForeground": WHAT_IS_THIS,
            "tree.indentGuidesStroke": alpha(ui.fg, 0.2),
            "tree.inactiveIndentGuidesStroke": alpha(ui.fg, 0.1),
            "tree.tableColumnsBorder": alpha(ui.fg, 0.1),
            "tree.tableOddRowsBackground": alpha(uiAccent.color, 0.05),

            "menubar.selectionBackground": uiAccent.color,
            "menubar.selectionForeground": uiAccent.fg,
            "menubar.selectionBorder": uiAccent.color,
            "menu.background": uiPopover.color,
            "menu.foreground": uiPopover.fg,
            "menu.border": popoverBorder,
            "menu.selectionBackground": selected,
            "menu.selectionForeground": selectedFg,
            // "menu.selectionBorder": alpha(uiAccent, 0.1),
            "menu.separatorBackground": alpha(uiPopover.fg, 0.1),

            "toolbar.hoverBackground": selected,
            "toolbar.activeBackground": selected,

            "commandCenter.background": alpha(uiAccent.color, 0.1),
            "commandCenter.foreground": fg,
            "commandCenter.border": alpha(ui.color, 0),
            "commandCenter.activeForeground": fg,
            "commandCenter.activeBackground": alpha(uiAccent.color, 0.3),
            "commandCenter.activeBorder": alpha(ui.color, 0),
            "commandCenter.inactiveForeground": fg,
            "commandCenter.inactiveBorder": alpha(ui.color, 0),
            "commandCenter.debuggingBackground": alpha(uiAccent.color, 0.4),

            "notificationCenter.border": popoverBorder,
            "notificationCenterHeader.background": lighten(uiPopover.color, 0.4),
            "notificationCenterHeader.foreground": uiPopover.fg,
            "notifications.foreground": uiPopover.fg,
            "notifications.background": uiPopover.color,
            "notifications.border": alpha(uiPopover.fg, 0.1),
            "notificationLink.foreground": blueish,
            "notificationsErrorIcon.foreground": redish,
            "notificationsWarningIcon.foreground": yellowish,
            "notificationsInfoIcon.foreground": blueish,
            "notificationToast.border": popoverBorder,

            "editorWidget.background": uiPopover.color,
            "editorWidget.foreground": uiPopover.fg,
            "editorWidget.border": popoverBorder,
            "editorWidget.resizeBorder": alpha(ui.color, 0),
            "editorGhostText.border": cyanish,
            "editorGhostText.background": alpha(cyanish, 0.1),
            "editorGhostText.foreground": alpha(cyanish, 0.7),

            "gitDecoration.addedResourceForeground": greenish,
            "gitDecoration.untrackedResourceForeground": greenish,
            "gitDecoration.modifiedResourceForeground": cyanish,
            "gitDecoration.deletedResourceForeground": redish,
            "gitDecoration.renamedResourceForeground": greenish,
            "gitDecoration.stageModifiedResourceForeground": brownish,
            "gitDecoration.ignoredResourceForeground": alpha(ui.fg, 0.3),
            "gitDecoration.conflictingResourceForeground": pinkish,
            "gitDecoration.submoduleResourceForeground": blueish,

            "editorLineNumber.foreground": comment,
            "editorLineNumber.activeForeground": fg,
            "editorLineNumber.dimmedForeground": alpha(fg, 0.1),
            "editorCursor.background": fg,
            "editorCursor.foreground": yellowish,
            "editor.lineHighlightBackground": alpha(uiAccent.color, 0.05),
            "editor.lineHighlightBorder": alpha(fg, 0),
            "editorWhitespace.foreground": alpha(fg, 0.4),
            "editor.selectionBackground": editorSelection,
            "editor.selectionForeground": fg,
            "editor.selectionHighlightBackground": "#000",
            // "editor.selectionHighlightBorder": alpha(uiAccent, 0.1),
            "editor.wordHighlightBackground": editorSelection,
            "editor.wordHighlightBorder": alpha(bg, 0),
            "editorIndentGuide.background": alpha(fg, 0.1),
            "editorIndentGuide.activeBackground": alpha(fg, 0.5),
            "editorRuler.foreground": alpha(uiAccent.color, 0.4),
            "editorCodeLens.foreground": alpha(uiAccent.color, 0.5),
            "editorBracketMatch.background": alpha(fg, 0.2),
            "editorBracketMatch.border": alpha(fg, 0.0),

            // "editorGutter.background": ui,
            "editorGutter.modifiedBackground": greenish,
            "editorGutter.addedBackground": greenish,
            "editorGutter.deletedBackground": redish,
            "editorGutter.commentRangeForeground": comment,
        },
        "semanticHighlighting": semanticHighlighting,
        "semanticTokenColors": semanticTokens(tokens),
        "tokenColors": tmTokens(tokens)
    }
}

function normalizeTokens(schema: Partial<Schema>): Schema {
    return {
        ...schema,
        interpolation: schema.interpolation || schema.keyword,
        selfDef: schema.selfDef || schema.paramDef,
        selfRef: schema.selfRef || schema.paramRef,
        macro: schema.macro || schema.decorator,
        enum: schema.enum || schema.constant,
        functionRef: schema.functionRef || schema.functionDef,
        typeRef: schema.typeRef || schema.typeDef,
        typeAnnot: schema.typeAnnot || schema.typeRef || schema.typeDef,
        lifetime: schema.lifetime || schema.punctuation,
        variableDef: schema.variableDef || schema.fg,
        variableRef: schema.variableRef || schema.variableDef || schema.fg,
    } as Schema
}


/*

// #181003, 161316, 221E22, 03120E, 141414
// 181003 - brownish
// 161316 - violetish
const bg = "#181003"

// #ececeb, #D4DCCB, D8DDEF, F5F5F5, EBEBEB, CCCCCC
const fg = "#CCCCCC"




// blueish #439ff3, 3185FC, #96C9DC, #5998C5, #4CC9F0, #66C3FF, 457B9D,1C5D99, 4079C9
const blueish = "#4079C9"
// 4E937A, 849483, C7F2A7, 639FAB
const cyanish = "#639FAB"
// yeelowish #fac036, #eab432, #FABC3C, #FFB238, #F19143, #FF773D, #F55536, ECA72C, D19F47
const yellowish = "#D19F47"
// #F06C9B, #F72585, D81E5B, F61379, EC096F, C4075C, B10653, D43A7F
const pinkish = "#D43A7F"
// #5d584f, #466365, 221E22, 463F3A, 4E4337
const comment = "#4E4337"
// violet, #A76EB1, #BAA5FF
const violetish = "#A76EB1"
// #E03616, #E63946, #DD6031, F87060, EA4A2A, ED6145, ED4545, D93A3A, DE5454
const redish = "#DE5454"
// #25A16E, 1EA896, 21D19F
const greenish = "#25A16E"
const lime = "#C7DE54"
// #B49A67, #CEB3AB, 9E643C, C77A48, BE7341
const brownish = "#BE7341"

*/

function hsl(h: number, s: number, l: number, a?: number) {
    if (a != null) {
        return Color.hsl(h, s, l, a).hexa()
    } else {
        return Color.hsl(h, s, l).hex()
    }
}

function luminate(color: string, l: number) {
    return Color(color).l(l).hexa()
}

const luminance = 50



function darken(color: string, percent: number) {
    return Color(color).darken(percent).hex()
}

function lighten(color: string, percent: number) {
    return Color(color).lighten(percent).hex()
}

function alpha(color: string, percent: number) {
    return Color(color).alpha(percent).hexa()
}


// const uiBg = "#161316"
// const ui = darken(bg, 0.2)
// const ui.fg = fg
// const uiAccent = brownish
// const uiAccent.fg = darken(bg, 0.4)
// const popover = bg
// const uiPopover.fg = fg
// const popoverBorder = uiAccent
// // const border = WHAT_IS_THIS
// const border = lighten(bg, 0.2)
// const uiFocus = blueish
// const selected = alpha(uiAccent, 0.1)
// const selectedFg = uiAccent
// const appShell = darken(ui, 0.3)
// const editorSelection = lighten(bg, 0.8)

// const codeFg = darken(fg, 0.25)

// pinky #F06C9B, #F9B9B7

function terminal({ fg, blueish, cyanish, greenish, pinkish, redish, yellowish, bg, ui }: Theme) {
    return {
        "terminal.background": ui.color,
        "terminal.foreground": fg,
        "terminal.ansiBlack": ui,
        "terminal.ansiBlue": blueish,
        "terminal.ansiCyan": cyanish,
        "terminal.ansiGreen": greenish,
        "terminal.ansiMagenta": pinkish,
        "terminal.ansiRed": redish,
        "terminal.ansiWhite": fg,
        "terminal.ansiYellow": yellowish,
        "terminal.ansiBrightBlack": lighten(bg, 0.2),
        "terminal.ansiBrightBlue": lighten(blueish, 0.2),
        "terminal.ansiBrightCyan": lighten(cyanish, 0.2),
        "terminal.ansiBrightGreen": lighten(greenish, 0.2),
        "terminal.ansiBrightMagenta": lighten(pinkish, 0.2),
        "terminal.ansiBrightRed": lighten(redish, 0.2),
        "terminal.ansiBrightWhite": darken(fg, 0.2),
        "terminal.ansiBrightYellow": lighten(yellowish, 0.2),
        "terminal.selectionBackground": lighten(bg, 0.4),
        "terminal.selectionForeground": fg,
    }
}

// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#semantic-token-scope-map
interface Schema {
    fg: TokenStyle
    comment: TokenStyle
    string: TokenStyle
    constant: TokenStyle
    punctuation: TokenStyle
    keyword: TokenStyle,
    typeDef?: TokenStyle
    typeAnnot?: TokenStyle
    typeRef?: TokenStyle
    selfDef?: TokenStyle
    selfRef?: TokenStyle
    enum?: TokenStyle
    functionDef?: TokenStyle
    functionRef?: TokenStyle
    paramDef?: TokenStyle
    paramRef?: TokenStyle
    decorator: TokenStyle
    propertyDef?: TokenStyle
    propertyRef?: TokenStyle
    macro?: TokenStyle
    interpolation?: TokenStyle
    lifetime?: TokenStyle
    variableDef?: TokenStyle,
    variableRef?: TokenStyle,
}

interface TokenStyle {
    foreground: string
    // fontStyle?: "italic" | "bold" | "underline" | ""
    bold?: boolean
    italic?: boolean
    underline?: boolean
}

const semanticHighlighting = true
function semanticTokens(schema: Schema) {
    return {
        "parameter": schema.paramRef,
        "parameter.declaration": schema.paramDef,
        "selfParameter": schema.selfRef,
        "selfParameter.declaration": schema.selfDef,
        "selfTypeKeyword": schema.selfRef,
        "selfKeyword.declaration": schema.selfDef,
        "selfKeyword.reference": schema.selfRef,
        "decorator": schema.decorator,
        "module.decorator": schema.decorator,
        "property.decorator": schema.decorator,
        "function.decorator": schema.decorator,
        "operator.attribute": schema.punctuation,
        "macro": schema.decorator,
        "property": schema.propertyRef,
        "property.declaration:python": schema.propertyRef,
        "property.declaration": schema.propertyDef,
        "property.declaration.readonly": schema.constant,
        "lifetime": schema.lifetime,
        "struct.declaration": schema.typeDef,
        "struct": schema.typeRef,
        "class.builtin": { bold: true },
        // "*.defaultLibrary": { bold: true },
        "class.declaration": schema.typeDef,
        "enum.declaration": schema.typeDef,
        "enum": schema.typeDef,
        "enumMember": schema.constant,
        "enumMember.declaration": schema.constant,
        "method": schema.functionRef,
        "method.declaration": schema.functionDef,
        "function": schema.functionRef,
        "function.declaration": schema.functionDef,
        "variable": schema.variableRef,
        "variable.readonly": schema.constant,
        "variable.readonly.local": schema.variableRef,
        "variable.declaration": schema.variableDef,
        "variable.declaration.readonly": schema.constant,
        "variable.declaration.readonly.local": schema.constant,
        "tomlTableKey": schema.propertyDef,
        "tomlArrayKey": schema.propertyDef,
        "generic.injected": schema.fg,
        "punctuation.injected": schema.punctuation,
        // "formatSpecifier": schema.interpolation,
    }
}

function ngAttribute(type: string): string[] {
    return [
        `meta.ng-binding.${type} > entity.other.attribute-name.html`,
        `meta.ng-binding.${type} punctuation.definition.ng-binding-name.begin`,
        `meta.ng-binding.${type} punctuation.definition.ng-binding-name.end`,
        `meta.ng-binding.${type} punctuation.separator.key-value.html`,
        `meta.ng-binding.${type} punctuation.separator.key-value.html-template.ng`,
        `meta.ng-binding.${type} > string.quoted`,
        `meta.ng-binding.${type} > string.quoted > punctuation.definition.string.begin`,
        `meta.ng-binding.${type} > string.quoted > punctuation.definition.string.end`,
    ]
}

function htmlAttribute(name: string): string[] {
    return [
        `meta.attribute.${name}.html entity.other.attribute-name.html`,
        `meta.attribute.${name}.html punctuation.separator.key-value.html`,
        `meta.attribute.${name}.html punctuation.separator.key-value.html-template.ng`,
        `meta.attribute.${name}.html punctuation.separator.key-value.html-template.ng`,
        `meta.attribute.${name}.html punctuation.definition.string.begin.html`,
        `meta.attribute.${name}.html punctuation.definition.string.end.html`,
    ]
}



function tmTokens(schema: Schema) {
    return [
        tmToken(schema, "fg", [
            "text.html"
        ]),
        tmToken(schema, "comment", [
            "comment",
            "punctuation.definition.comment",
            "string.quoted.docstring",
            "string.quoted.docstring punctuation.definition.string",
        ]),
        tmToken(schema, "string", [
            "string",
            "string > storage.type.string",
            "punctuation.definition.string",
            "meta.attribute-selector",
            "source.ini",

            // CSS & HTML class
            "entity.other.attribute-name.class",
            "entity.other.attribute-name.class punctuation",
            // "meta.attribute.class entity.other.attribute-name.html",
            // "meta.attribute.class punctuation.separator.key-value.html",
            // "meta.attribute.class punctuation.separator.key-value.html-template.ng",
        ]),
        tmToken(schema, "constant", [
            "constant",
            "constant.other.caps",
            "variable.other.constant",
            "support.constant",
            "keyword.other.unit",
            "meta.type.parameters support.type.primitive",
            "meta.type.parameters support.type.builtin",
            "meta.return.type support.type.primitive",
            "meta.return.type support.type.builtin",
        ]),
        tmToken(schema, "punctuation", [
            "punctuation",
            "meta.brace.square",
            "meta.brace.round",
            "keyword.operator.assignment",
            "keyword.operator.spread",
            "keyword.operator.type",
            "keyword.operator.namespace",
            "constant.other.ellipsis",
            "meta.attribute.rust",
            "entity.name.namespace",
            "html-template.ng.expression.operator.navigator",

            // css attribute selector patter
            "meta.attribute-selector keyword.operator",
            ...ngExpr([
                "",
                "punctuation.separator",
                "keyword.operator.logical",
            ]),

            "control.block.ng > punctuation.definition.block",
        ]),
        tmToken(schema, "decorator", [
            "meta.attribute > punctuation.brackets.attribute",
            "meta.attribute > punctuation.definition.attribute",
            "entity.name.function.macro",
            "meta.decorator punctuation.decorator",
            "meta.decorator > meta.function-call > entity.name.function",
            "meta.function.decorator entity.name.function.decorator",
            "meta.function.decorator punctuation.definition.decorator",
            "meta.function.decorator punctuation.separator.period",

            // punctuations
            "meta.decorator > meta.brace.round",

            // CSS & HTML id+for
            "entity.other.attribute-name.id",
            "entity.other.attribute-name.id punctuation",
            ...htmlAttribute("id"),
            ...htmlAttribute("for"),
            // Angular: #attribute
            ...ngAttribute("template.variable"),

            "source.ini punctuation.definition.entity",
            "source.ini entity.name.section",

            "text.html.derivative meta.tag.custom.start.html meta.attribute.unrecognized.#head.html",

            // Markdown inline code
            "punctuation.definition.raw.markdown",
            "markup.inline.raw.string.markdown"
        ]),
        tmToken(schema, "keyword", [
            "keyword",
            "punctuation.definition.keyword",
            "storage.type",
            "keyword.operator",
            "storage.modifier",

            "html-template.ng.control-flow",
            "entity.other.document.begin",

            // Angular: (event)
            ...ngAttribute("event"),

            "storage.type.class.jsdoc",
            "storage.type.class.jsdoc punctuation",

            // Markdown
            "punctuation.definition.heading.markdown",
            "entity.name.section.markdown",
            "text.html.markdown punctuation.definition"
        ]),
        tmToken(schema, "functionDef", [
            "meta.function entity.name.function",
            "meta.definition.method entity.name.function",
            "variable.other entity.name.function"
        ]),
        tmToken(schema, "functionRef", [
            "meta.function-call entity.name.function",
            "meta.function-call support.type", // python builtin, mybe another color?
            "meta.function-call.generic",
            "meta.function.call > entity.name.function",

            "html-template.ng entity.name.function",

            "source.css support.function",

            "expression.ng entity.name.function",
            "control.block.expression.ng entity.name.function",

            // punctuations
            // "meta.function-call > punctuation.definition.arguments.begin",
            // "meta.function-call > punctuation.definition.arguments.end",
            // "meta.function.call > punctuation.brackets.round",
        ]),
        tmToken(schema, "selfDef", [
            "variable.parameter.function.language.special.self"
        ]),
        tmToken(schema, "selfRef", [
            "variable.language.this",
            "variable.language.special.self",
            "variable.language.self",

            // Angular: [attrName]=""
            ...ngAttribute("property"),
        ]),
        tmToken(schema, "paramDef", [
            "meta.parameters variable.parameter",
            "meta.parameters keyword.operator.rest",
            "meta.parameters keyword.operator.type.annotation",
            "meta.function.parameters variable.parameter.function",
            "meta.function.parameters punctuation.separator.annotation",
            "meta.function.definition variable.other",
            "meta.function.definition keyword.operator.key-value",

            // css parameters : --variable-name
            "variable.css",
            "variable.scss",
            "variable.argument.css",
            "variable.parameter.misc.css",

            // Markdown link
            "text.html.markdown markup.underline.link.markdown"
        ]),
        tmToken(schema, "typeDef", [
            "meta.class > entity.name.type.class",
            "meta.interface > entity.name.type.interface",
            "meta.enum > entity.name.type.enum",
            "entity.name.type.anchor.yaml",
            "punctuation.definition.anchor.yaml",
            "entity.name.tag",
            "text.pug meta.tag constant.name.attribute.tag",
            "meta.table.toml punctuation",
            "meta.table.toml support.type.property-name",
        ]),
        tmToken(schema, "typeRef", [
            "entity.other.inherited-class",
            "meta.class.inheritance meta.item-access",
            "entity.name.type",
            "variable.other.alias.yaml",
            "punctuation.definition.alias.yaml",
            "new.expr > meta.function-call > entity.name.function",
            "meta.type.parameters"
        ]),
        tmToken(schema, "typeAnnot", [
            "meta.type.annotation",
            "meta.type.annotation punctuation.accessor",
            "meta.return.type punctuation.accessor",
            // "meta.type.annotation meta.brace.square",
            "meta.type.parameters entity.name.type",
            "meta.function.parameters.python"
        ]),
        tmToken(schema, "propertyDef", [
            "meta.object-literal.key",
            "meta.object-literal.key string",
            "meta.object-literal.key punctuation.definition.string",
            "support.type.property-name",
            "entity.name.tag.yaml",
            // python keyword argument
            "meta.function-call variable.parameter",
            "keyword.operator.key-value",

            "entity.other.attribute-name.html",
            "punctuation.separator.key-value.html",
            "meta.attribute-selector entity.other.attribute-name",
            "text.pug meta.tag",
            "source.ini keyword.other.definition",
            "expression.ng variable",

            // Markdown link
            "text.html.markdown punctuation.definition.link",
            "text.html.markdown meta.link string",
            "text.html.markdown meta.link punctuation.definition.metadata",
        ]),
        tmToken(schema, "propertyRef", [
            // TS: this.property
            // NG: any template variable
            "variable.other.property",

            "variable.other.object.property",
            "meta.member.access meta.attribute",

            "expression.ng variable.other.object",
            "control.block.expression.ng variable.other.object"
        ]),
        tmToken(schema, "variableDef", [
            "source.python",
        ]),
        tmToken(schema, "variableRef", [
            "variable.other",
            "meta.interpolation.rust",

            "meta.function-call.arguments"
        ]),
        tmToken(schema, "enum", [
            "entity.name.type.option.rust",
            "entity.name.type.result.rust",
        ]),
        tmToken(schema, "interpolation", [
            "string punctuation.definition.interpolation",
            "punctuation.definition.template-expression.begin",
            "punctuation.definition.template-expression.end",
            "constant.character.format.placeholder",
            "punctuation.definition.interpolation",
            "punctuation.section.embedded",

            "html-template.ng.interpolation.begin",
            "html-template.ng.interpolation.end",
            "text.html punctuation.definition.block"
        ]),
        tmToken(schema, "lifetime", [
            "punctuation.definition.lifetime",
            "entity.name.type.lifetime"
        ]),
        /*,
        {
            "name": "Builtins bold",
            "settings": { ...schema.typeRef, fontStyle:"bold"},
            "scope": [
                "support.type",
                "support.type.exception"
            ]
        }*/
    ]
}

function tmToken<T extends Schema>(schema: T, name: keyof T, slectors: string[]): Record<string, any> {
    const input = schema[name] as TokenStyle
    const settings = input as { foreground: string, fontStyle?: string }

    let fontStyle = [
        (input.italic ? "italic" : undefined),
        (input.bold ? "bold" : undefined),
        (input.underline ? "underline" : undefined)
    ].filter(Boolean).join(" ")

    if (fontStyle.length > 0) {
        settings.fontStyle = fontStyle
    }

    return {
        name,
        "settings": settings,
        // "settings": { foreground: settings.foreground },
        "scope": slectors
    }
}

function ngExpr(scops: string[]): string[] {
    const prefixes = [
        "expression.ng",
        "control.block.expression.ng"
    ]
    return scops.reduce<string[]>((res, scope) => {
        for (const p of prefixes) {
            res.push(`${p} ${scope}`.trim())
        }
        return res
    }, [])
}




/*

// #181003, 161316, 221E22, 03120E, 141414
// 181003 - brownish
// 161316 - violetish
const bg = "#181003"

// #ececeb, #D4DCCB, D8DDEF, F5F5F5, EBEBEB, CCCCCC
const fg = "#CCCCCC"




// blueish #439ff3, 3185FC, #96C9DC, #5998C5, #4CC9F0, #66C3FF, 457B9D,1C5D99, 4079C9
const blueish = "#4079C9"
// 4E937A, 849483, C7F2A7, 639FAB
const cyanish = "#639FAB"
// yeelowish #fac036, #eab432, #FABC3C, #FFB238, #F19143, #FF773D, #F55536, ECA72C, D19F47
const yellowish = "#D19F47"
// #F06C9B, #F72585, D81E5B, F61379, EC096F, C4075C, B10653, D43A7F
const pinkish = "#D43A7F"
// #5d584f, #466365, 221E22, 463F3A, 4E4337
const comment = "#4E4337"
// violet, #A76EB1, #BAA5FF
const violetish = "#A76EB1"
// #E03616, #E63946, #DD6031, F87060, EA4A2A, ED6145, ED4545, D93A3A, DE5454
const redish = "#DE5454"
// #25A16E, 1EA896, 21D19F
const greenish = "#25A16E"
const lime = "#C7DE54"
// #B49A67, #CEB3AB, 9E643C, C77A48, BE7341
const brownish = "#BE7341"

*/

// const uiBg = "#161316"
// const ui = darken(bg, 0.2)
// const ui.fg = fg
// const uiAccent = brownish
// const uiAccent.fg = darken(bg, 0.4)
// const popover = bg
// const uiPopover.fg = fg
// const popoverBorder = uiAccent
// // const border = WHAT_IS_THIS
// const border = lighten(bg, 0.2)
// const uiFocus = blueish
// const selected = alpha(uiAccent, 0.1)
// const selectedFg = uiAccent
// const appShell = darken(ui, 0.3)
// const editorSelection = lighten(bg, 0.8)

// const codeFg = darken(fg, 0.25)


const Themes = {
    brown: theme({
        bg: "#181003",
        fg: "#CCCCCC",
        blueish: "#4079C9",
        cyanish: "#639FAB",
        yellowish: "#D19F47",
        pinkish: "#D43A7F",
        comment: "#4E4337",
        punctuation: darken("#CCCCCC", 0.3),
        violetish: "#A76EB1",
        redish: "#DE5454",
        greenish: "#25A16E",
        brownish: "#BE7341",
        ui: { color: darken("#181003", 0.2), fg: "#CCCCCC" },
        uiAccent: { color: "#BE7341", fg: "#CCCCCC" },
        uiFocus: { color: "#4079C9", fg: "#CCCCCC" },
        uiPopover: { color: "#161316", fg: "#CCCCCC" }
    }),
    cold: theme({
        bg: "#2e3440",
        fg: "#d8dee9",
        // 8199C5, 7595D1
        blueish: "#7595D1",
        cyanish: "#67bbb3",
        // e6b263
        yellowish: "#D9B073",
        pinkish: "#c684b5",
        comment: "#58627A",
        // 60729F, 7685AD
        punctuation: "#6F81A5",
        violetish: "#BB8EC2",
        redish: "#cf9777",
        greenish: "#94b399",
        brownish: "#CF9777",
        ui: { color: darken("#2e3440", 0.2), fg: "#d8dee9" },
        uiAccent: { color: "#7595D1", fg: "#FFF" },
        uiFocus: { color: "#4079C9", fg: "#d8dee9" },
        uiPopover: { color: "#2e3440", fg: "#d8dee9" }
    })
}

for (const [themeName, theme] of Object.entries(Themes)) {
    fs.writeFileSync(`themes/anrueg-${themeName}-theme.json`, JSON.stringify(theme, null, 2))

}

// let x: {resolve?: (value: void) => void, terminated?: boolean} = {}
// process.on("SIGINT", async () => {
//     console.log("SIGINT")
//     x.resolve?.()
//     x.terminated = true
// })

// await new Promise<void>((resolve) => {
//     x.resolve = resolve
//     if (x.terminated) {
//         resolve()
//     }
// })
