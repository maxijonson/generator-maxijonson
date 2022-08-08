import React, { CSSProperties } from "react";
import { Global } from "@mantine/core";

// Example Font
// import ExampleFontThin from "../../assets/fonts/ExampleFont/ExampleFont-Thin.ttf";
// import ExampleFontThinItalic from "../../assets/fonts/ExampleFont/ExampleFont-ThinItalic.ttf";
// import ExampleFontLight from "../../assets/fonts/ExampleFont/ExampleFont-Light.ttf";
// import ExampleFontLightItalic from "../../assets/fonts/ExampleFont/ExampleFont-LightItalic.ttf";
// import ExampleFontRegular from "../../assets/fonts/ExampleFont/ExampleFont-Regular.ttf";
// import ExampleFontItalic from "../../assets/fonts/ExampleFont/ExampleFont-Italic.ttf";
// import ExampleFontBold from "../../assets/fonts/ExampleFont/ExampleFont-Bold.ttf";
// import ExampleFontBoldItalic from "../../assets/fonts/ExampleFont/ExampleFont-BoldItalic.ttf";
// import ExampleFontBlack from "../../assets/fonts/ExampleFont/ExampleFont-Black.ttf";
// import ExampleFontBlackItalic from "../../assets/fonts/ExampleFont/ExampleFont-BlackItalic.ttf";

type Font = [
    font: CSSProperties["fontFamily"],
    weight: CSSProperties["fontWeight"],
    style: CSSProperties["fontStyle"]
];

export default () => {
    // const exampleFont = React.useMemo<Font[]>(() => {
    //     return [
    //         [ExampleFontThin, 100, "normal"],
    //         [ExampleFontThinItalic, 100, "italic"],
    //         [ExampleFontLight, 300, "normal"],
    //         [ExampleFontLightItalic, 300, "italic"],
    //         [ExampleFontRegular, "normal", "normal"],
    //         [ExampleFontItalic, "normal", "italic"],
    //         [ExampleFontBold, "bold", "normal"],
    //         [ExampleFontBoldItalic, "bold", "italic"],
    //         [ExampleFontBlack, 900, "normal"],
    //         [ExampleFontBlackItalic, 900, "italic"],
    //     ];
    // }, []);

    return (
        <Global
            styles={
                [
                    // ...exampleFont.map(([font, weight, style]) => {
                    //     return {
                    //         "@font-face": {
                    //             fontFamily: "ExampleFont",
                    //             fontStyle: style,
                    //             fontWeight: weight,
                    //             src: `url(${font}) format("truetype")`,
                    //             fontDisplay: "swap",
                    //         },
                    //     };
                    // }),
                ]
            }
        />
    );
};
