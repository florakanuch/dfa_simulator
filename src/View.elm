module View exposing (view)


import Dict
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Json.Decode as Decode
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Svg.Events as SvgEvents
import Html.Events exposing (custom)
import Types exposing (..)
import Helpers exposing (flt)
import View.Canvas exposing (drawDFA)
import View.Panels exposing (..)
import View.Widgets exposing (..)
import Lang exposing (Language(..), Translations, translations)




----------------------- MAIN VIEW -----------------------------------------------

view : Model -> Html Msg
view model =
    let
        t = translations model.language
    in
    div
        [ style "font-family" "'Segoe UI', Arial, sans-serif"
        , style "background" "#1a1a2e"
        , style "height" "100vh"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "overflow" "hidden"
        , style "color" "#e8eaf6"
        , Html.Events.on "mouseup" (Decode.succeed MouseUp)
        ]
        [ viewTopBar t model.language
        , div
            [ style "display" "grid"
            , style "grid-template-columns" "360px 1fr"
            , style "grid-template-rows" "1fr"
            , style "gap" "14px"
            , style "padding" "0 14px 14px 14px"
            , style "flex" "1"
            , style "min-height" "0"
            ]
            [ div
                [ style "display" "flex"
                , style "flex-direction" "column"
                , style "gap" "8px"
                , style "min-height" "0"
                , style "overflow-y" "auto"
                , style "padding-right" "2px"
                ]
                [ viewTestStringPanel t model
                , viewCodePanel t model
                ]
            , viewDiagramPanel t model
            ]
        , if model.showTransCharPopup then
            viewTransCharPopup t model
          else
            text ""
        , case model.renamingState of
            Just stateName ->
                viewRenamePopup t stateName model.renameValue

            Nothing ->
                text ""
        , if model.showHelp then
            viewHelpModal t
          else
            text ""
        , if model.showFeedback then
            viewFeedbackModal t
          else
            text ""
        ]



---------------------------- TOP BAR ------------------------------------------------

viewTopBar : Translations -> Language -> Html Msg
viewTopBar t lang =
    div
        [ style "background" "linear-gradient(135deg, #4a0080, #6a0dad, #7c4dff)"
        , style "padding" "12px 28px"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "space-between"
        , style "box-shadow" "0 2px 20px rgba(124,77,255,0.5)"
        ]
        [ h1
            [ style "font-family" "monospace"
            , style "font-size" "1.6rem"
            , style "color" "#fff"
            , style "margin" "0"
            , style "letter-spacing" "1px"
            ]
            [ text "DFA Simulator" ]
        , div [ style "display" "flex", style "gap" "10px" ]
            [ langToggleBtn lang
            , topBarBtn t.save RequestSave
            , topBarBtn t.load RequestLoad
            , topBarBtn t.guide ToggleHelp
            , topBarBtn t.feedback ToggleFeedback
            , topBarBtn t.clearAll ClearAll
            ]
        ]


langToggleBtn : Language -> Html Msg
langToggleBtn lang =
    button
        [ onClick ToggleLanguage
        , style "background" "rgba(255,255,255,0.12)"
        , style "border" "1px solid rgba(255,255,255,0.35)"
        , style "color" "white"
        , style "padding" "7px 14px"
        , style "border-radius" "20px"
        , style "cursor" "pointer"
        , style "font-family" "inherit"
        , style "font-size" "0.85rem"
        , style "font-weight" "600"
        , style "display" "flex"
        , style "align-items" "center"
        , style "gap" "6px"
        ]
        [ span [] [ text "🌐" ]
        , span []
            [ text
                (case lang of
                    EN -> "EN"
                    SK -> "SK"
                )
            ]
        , span [ style "font-size" "0.7rem", style "opacity" "0.7" ]
            [ text
                (case lang of
                    EN -> "→ SK"
                    SK -> "→ EN"
                )
            ]
        ]




------------------------------------- DIAGRAM PANEL -----------------------------------------------------

viewDiagramPanel : Translations -> Model -> Html Msg
viewDiagramPanel t model =
    panel
        [ style "grid-column" "2"
        , style "grid-row" "1"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "min-height" "0"
        ]
        [ div
            [ style "display" "flex"
            , style "align-items" "center"
            , style "justify-content" "space-between"
            , style "margin-bottom" "12px"
            , style "flex-shrink" "0"
            ]
            [ panelTitle t.stateDiagram ]
        , div
            [ style "flex" "1"
            , style "position" "relative"
            , style "background" "rgba(255,255,255,0.025)"
            , style "border" "1px dashed rgba(255,255,255,0.12)"
            , style "border-radius" "12px"
            , style "overflow" "hidden"
            , style "min-height" "0"
            ]
            [ Svg.svg
                [ SvgAttr.width "100%"
                , SvgAttr.height "100%"
                , SvgAttr.style
                    ("display:block; cursor: "
                        ++ (if model.isPanning then "grabbing"
                            else case model.drawTool of
                                AddStateTool -> "crosshair"
                                AddTransitionTool -> "cell"
                                SelectTool ->
                                    case model.dragging of
                                        Just _ -> "grabbing"
                                        Nothing -> "grab"
                                DeleteTool -> "pointer"
                           )
                    )
                , SvgEvents.on "mousemove"
                    (Decode.map2
                        (\ox oy ->
                            if model.isPanning then
                                PanMove ox oy
                            else
                                MouseMove
                                    ((ox - model.svgPanX) / model.svgZoom)
                                    ((oy - model.svgPanY) / model.svgZoom)
                        )
                        (Decode.field "offsetX" Decode.float)
                        (Decode.field "offsetY" Decode.float)
                    )
                , SvgEvents.on "mouseup" (Decode.succeed MouseUp)
                ]
                [ Svg.rect
                    [ SvgAttr.x "0"
                    , SvgAttr.y "0"
                    , SvgAttr.width "100%"
                    , SvgAttr.height "100%"
                    , SvgAttr.fill "transparent"
                    , custom "click"
                        (Decode.map2
                            (\ox oy ->
                                { message = ClickedCanvas
                                    ((ox - model.svgPanX) / model.svgZoom)
                                    ((oy - model.svgPanY) / model.svgZoom)
                                , stopPropagation = False
                                , preventDefault = False
                                }
                            )
                            (Decode.field "offsetX" Decode.float)
                            (Decode.field "offsetY" Decode.float)
                        )
                    , SvgEvents.on "mousedown"
                        (Decode.map2 PanStart
                            (Decode.field "offsetX" Decode.float)
                            (Decode.field "offsetY" Decode.float)
                        )
                    ]
                    []
                , Svg.g
                    [ SvgAttr.transform
                        ("translate(" ++ flt model.svgPanX ++ "," ++ flt model.svgPanY ++ ") scale(" ++ flt model.svgZoom ++ ")")
                    ]
                    (drawDFA model)
                ]
            ]
        , div
            [ style "display" "flex"
            , style "gap" "24px"
            , style "margin-top" "12px"
            , style "align-items" "flex-start"
            ]
            [ toolGroup t.draw
                [ toolBtn "✋" (model.drawTool == SelectTool) (SetDrawTool SelectTool) t.selectMove
                , toolBtn "⊕" (model.drawTool == AddStateTool) (SetDrawTool AddStateTool) t.addState
                , toolBtn "→" (model.drawTool == AddTransitionTool) (SetDrawTool AddTransitionTool) t.addTransition
                , toolBtn "X" (model.drawTool == DeleteTool) (SetDrawTool DeleteTool) t.deleteStateTrans
                ]
            , toolGroup t.actions
                [ undoRedoBtn "↩" Undo (model.undoStack /= []) t.undo
                , undoRedoBtn "↪" Redo (model.redoStack /= []) t.redo
                --, toolBtn "🗑" False ClearAll t.clearAllShort
                ]
            , toolGroup t.view
                [ toolBtn "+" False ZoomIn t.zoomIn
                , toolBtn "−" False ZoomOut t.zoomOut
                , toolBtn "⌂" False ResetView t.resetView
                , div
                    [ style "font-size" "0.68rem"
                    , style "color" "#9fa8da"
                    , style "font-family" "monospace"
                    , style "text-align" "center"
                    , style "min-width" "36px"
                    , style "line-height" "40px"
                    ]
                    [ text (String.fromInt (round (model.svgZoom * 100)) ++ "%") ]
                ]
            ]
        , if not (Dict.isEmpty model.statePositions) then
            viewStateList t model
          else
            text ""
        ]