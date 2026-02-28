module View.Widgets exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import Types exposing (..)




----------------------------- COLORS -------------------------------------------

purpleGrad : String
purpleGrad = "linear-gradient(135deg, #7c4dff, #e040fb)"


pinkGrad : String
pinkGrad = "linear-gradient(135deg, #ff4081, #f06292)"




--------------------------- PANEL WRAPPERS -----------------------------------------

panel : List (Attribute Msg) -> List (Html Msg) -> Html Msg
panel attrs children =
    div
        ([ style "background" "rgba(255,255,255,0.04)"
         , style "border" "1px solid rgba(255,255,255,0.08)"
         , style "border-radius" "16px"
         , style "padding" "18px"
         ]
            ++ attrs
        )
        children


panelTitle : String -> Html Msg
panelTitle t =
    div
        [ style "font-size" "1.35rem"
        , style "font-weight" "600"
        , style "margin-bottom" "14px"
        , style "color" "#fff"
        ]
        [ text t ]


rowLabel : String -> Html Msg
rowLabel t =
    div
        [ style "font-size" "0.75rem"
        , style "color" "#9fa8da"
        , style "font-weight" "500"
        , style "margin-top" "10px"
        ]
        [ text t ]


collapsibleHeader : String -> Bool -> Msg -> Html Msg
collapsibleHeader title isCollapsed toggleMsg =
    div
        [ onClick toggleMsg
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "space-between"
        , style "cursor" "pointer"
        , style "user-select" "none"
        , style "-webkit-user-select" "none"
        ]
        [ span
            [ style "font-size" "0.78rem"
            , style "font-weight" "700"
            , style "letter-spacing" "1px"
            , style "text-transform" "uppercase"
            , style "color" "#9fa8da"
            ]
            [ text title ]
        , span
            [ style "font-size" "0.85rem"
            , style "color" "#9fa8da"
            , style "transition" "transform 0.2s"
            , style "display" "inline-block"
            , style "transform" (if isCollapsed then "rotate(-90deg)" else "rotate(0deg)")
            ]
            [ text "▾" ]
        ]




--------------------- BUTTONS --------------------------------------------------

styledBtn : String -> Msg -> String -> String -> String -> Html Msg
styledBtn label msg bg w padding =
    button
        [ onClick msg
        , style "background" bg
        , style "color" "white"
        , style "border" "none"
        , style "border-radius" "10px"
        , style "padding" padding
        , style "width" w
        , style "font-family" "inherit"
        , style "font-size" "0.85rem"
        , style "font-weight" "600"
        , style "cursor" "pointer"
        , style "margin-top" "8px"
        , style "display" "block"
        , style "text-align" "center"
        ]
        [ text label ]


autoRunBtn : Model -> Html Msg
autoRunBtn model =
    button
        [ onClick StartAutoRun
        , style "flex" "1"
        , style "background"
            (if model.autoRunning then
                "linear-gradient(135deg, #388e3c, #66bb6a)"
             else
                "rgba(255,255,255,0.07)"
            )
        , style "border"
            (if model.autoRunning then "1px solid #66bb6a" else "1px solid rgba(255,255,255,0.1)")
        , style "border-radius" "8px"
        , style "padding" "7px 10px"
        , style "font-size" "0.78rem"
        , style "font-weight" "600"
        , style "cursor" "pointer"
        , style "color" (if model.autoRunning then "#fff" else "#9fa8da")
        , style "font-family" "inherit"
        ]
        [ text "▶ Run" ]


autoStopBtn : Model -> Html Msg
autoStopBtn model =
    button
        [ onClick StopAutoRun
        , style "flex" "1"
        , style "background" "rgba(255,255,255,0.07)"
        , style "border" "1px solid rgba(255,255,255,0.1)"
        , style "border-radius" "8px"
        , style "padding" "7px 10px"
        , style "font-size" "0.78rem"
        , style "font-weight" "600"
        , style "cursor" "pointer"
        , style "color" "#9fa8da"
        , style "font-family" "inherit"
        ]
        [ text "⏹ Stop" ]



smallModeBtn : String -> Msg -> Html Msg
smallModeBtn label msg =
    button
        [ onClick msg
        , style "flex" "1"
        , style "background" "rgba(255,255,255,0.07)"
        , style "border" "1px solid rgba(255,255,255,0.1)"
        , style "border-radius" "8px"
        , style "padding" "7px 10px"
        , style "font-size" "0.78rem"
        , style "font-weight" "600"
        , style "cursor" "pointer"
        , style "color" "#9fa8da"
        , style "font-family" "inherit"
        ]
        [ text label ]


stepBtn : String -> Msg -> Html Msg
stepBtn label msg =
    button
        [ onClick msg
        , style "flex" "1"
        , style "background" "rgba(255,255,255,0.07)"
        , style "border" "1px solid rgba(255,255,255,0.1)"
        , style "border-radius" "8px"
        , style "padding" "8px 4px"
        , style "font-size" "0.73rem"
        , style "font-weight" "600"
        , style "cursor" "pointer"
        , style "color" "#e8eaf6"
        , style "font-family" "inherit"
        ]
        [ text label ]



toolGroup : String -> List (Html Msg) -> Html Msg
toolGroup label children =
    div [ style "display" "flex", style "flex-direction" "column", style "gap" "5px" ]
        [ div
            [ style "font-size" "0.72rem"
            , style "color" "#9fa8da"
            , style "font-weight" "500"
            ]
            [ text label ]
        , div [ style "display" "flex", style "gap" "6px" ] children
        ]


undoRedoBtn : String -> Msg -> Bool -> String -> Html Msg
undoRedoBtn icon msg enabled titleText =
    button
        ([ title titleText
         , style "width" "40px"
         , style "height" "40px"
         , style "background"
             (if enabled then "rgba(224,64,251,0.18)" else "rgba(255,255,255,0.04)")
         , style "border"
             ("1px solid " ++ (if enabled then "#e040fb" else "rgba(255,255,255,0.08)"))
         , style "border-radius" "10px"
         , style "font-size" "1.2rem"
         , style "color" (if enabled then "#e040fb" else "rgba(255,255,255,0.25)")
         , style "cursor" (if enabled then "pointer" else "default")
         ]
            ++ (if enabled then [ onClick msg ] else [])
        )
        [ text icon ]



toolBtn : String -> Bool -> Msg -> String -> Html Msg
toolBtn icon isActive msg titleText =
    button
        [ onClick msg
        , title titleText
        , style "width" "40px"
        , style "height" "40px"
        , style "background"
            (if isActive then "rgba(79,195,247,0.25)" else "rgba(255,255,255,0.08)")
        , style "border"
            ("1px solid " ++ (if isActive then "#4fc3f7" else "rgba(255,255,255,0.1)"))
        , style "border-radius" "10px"
        , style "cursor" "pointer"
        , style "font-size" "1.1rem"
        , style "color" (if isActive then "#4fc3f7" else "#e8eaf6")
        ]
        [ text icon ]


miniBtn : String -> Msg -> Bool -> String -> Html Msg
miniBtn label msg isActive color =
    button
        [ onClick msg
        , style "padding" "2px 7px"
        , style "font-size" "0.72rem"
        , style "border-radius" "4px"
        , style "border" ("1px solid " ++ color)
        , style "cursor" "pointer"
        , style "font-weight" "700"
        , style "background" (if isActive then color else "transparent")
        , style "color" (if isActive then "#fff" else color)
        ]
        [ text label ]



topBarBtn : String -> Msg -> Html Msg
topBarBtn label msg =
    button
        [ onClick msg
        , style "background" "rgba(255,255,255,0.15)"
        , style "border" "1px solid rgba(255,255,255,0.3)"
        , style "color" "white"
        , style "padding" "7px 18px"
        , style "border-radius" "20px"
        , style "cursor" "pointer"
        , style "font-family" "inherit"
        , style "font-size" "0.85rem"
        , style "font-weight" "500"
        ]
        [ text label ]



helpLine : String -> String -> Html Msg
helpLine title body =
    div [ style "margin-bottom" "8px", style "font-size" "0.83rem", style "line-height" "1.5" ]
        [ span [ style "color" "#e040fb", style "font-weight" "700" ] [ text (title ++ ": ") ]
        , span [ style "color" "#c5cae9" ] [ text body ]
        ]