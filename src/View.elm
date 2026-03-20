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




----------------------- MAIN VIEW -----------------------------------------------

view : Model -> Html Msg
view model =
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
        [ viewTopBar
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
                [ viewTestStringPanel model
                , viewCodePanel model
                ]
            , viewDiagramPanel model
            ]
        , if model.showTransCharPopup then
            viewTransCharPopup model
          else
            text ""
        , case model.renamingState of
            Just stateName ->
                viewRenamePopup stateName model.renameValue

            Nothing ->
                text ""
        , if model.showHelp then
            viewHelpModal
          else
            text ""
        , if model.showFeedback then
            viewFeedbackModal
          else
            text ""
        ]



---------------------------- TOP BAR ------------------------------------------------

viewTopBar : Html Msg
viewTopBar =
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
            [ topBarBtn "📖 Guide" ToggleHelp
            , topBarBtn "💬 Feedback" ToggleFeedback
            , topBarBtn "🗑 Clear All" ClearAll
            ]
        ]




------------------------------------- DIAGRAM PANEL -----------------------------------------------------

viewDiagramPanel : Model -> Html Msg
viewDiagramPanel model =
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
            [ panelTitle "State Diagram" ]
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
            [ toolGroup "Draw"
                [ toolBtn "✋" (model.drawTool == SelectTool) (SetDrawTool SelectTool) "Select/Move"
                , toolBtn "⊕" (model.drawTool == AddStateTool) (SetDrawTool AddStateTool) "Add state"
                , toolBtn "→" (model.drawTool == AddTransitionTool) (SetDrawTool AddTransitionTool) "Add transition"
                , toolBtn "X" (model.drawTool == DeleteTool) (SetDrawTool DeleteTool) "Delete state/transition"
                ]
            , toolGroup "Actions"
                [ undoRedoBtn "↩" Undo (model.undoStack /= []) "Undo"
                , undoRedoBtn "↪" Redo (model.redoStack /= []) "Redo"
                --, toolBtn "🗑" False ClearAll "Clear all"
                ]
            , toolGroup "View"
                [ toolBtn "+" False ZoomIn "Zoom in"
                , toolBtn "−" False ZoomOut "Zoom out"
                , toolBtn "⌂" False ResetView "Reset view"
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
            viewStateList model
          else
            text ""
        ]