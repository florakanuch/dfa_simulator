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

        bothCollapsed = model.testCollapsed && model.codeCollapsed

        sidebarWidth =
            if bothCollapsed then 44
            else model.leftPanelWidth

        gridCols = 
            if bothCollapsed then "44px 1fr"
            else 
                String.fromFloat sidebarWidth ++ "px 6px 1fr"
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
        , Html.Events.on "mouseup" (Decode.succeed DragSidebarEnd)
        , Html.Events.on "mousemove"
            (Decode.field "clientX" Decode.float
                |> Decode.map DragSidebarMove
            )
        ]
        [ viewTopBar t model
        , div
            [ style "display" "grid"
            , style "grid-template-columns" gridCols
            , style "grid-template-rows" "1fr"
            , style "gap" "0"
            , style "padding" "0 14px 14px 14px"
            , style "flex" "1"
            , style "min-height" "0"
            ]
            [ if bothCollapsed then
                viewCollapsedStrip t model
              else
                div
                    [ style "display" "flex"
                    , style "flex-direction" "column"
                    , style "gap" "8px"
                    , style "min-height" "0"
                    , style "overflow-y" "auto"
                    , style "padding-right" "2px"
                    , style "overflow-x" "hidden"
                    ]
                    [ if model.testCollapsed then
                        collapsedPanelBtn "📝" t.testString ToggleTestPanel
                      else
                        viewTestStringPanel t model
                    , if model.codeCollapsed then
                        collapsedPanelBtn "{ }" t.code ToggleCodePanel
                      else
                        viewCodePanel t model
                    ]
            , 
              if bothCollapsed then
                text ""
              else
                div
                    [ style "width" "6px"
                    , style "cursor" "col-resize"
                    , style "display" "flex"
                    , style "align-items" "center"
                    , style "justify-content" "center"
                    , style "margin" "0 4px"
                    , style "flex-shrink" "0"
                    , Html.Events.on "mousedown" (Decode.succeed DragSidebarStart)
                    ]
                    [ div
                        [ style "width" "3px"
                        , style "height" "48px"
                        , style "border-radius" "2px"
                        , style "background"
                            (if model.isDraggingSidebar then
                                "rgba(124,77,255,0.9)"
                             else
                                "rgba(255,255,255,0.18)"
                            )
                        , style "transition" "background 0.15s"
                        ]
                        []
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


collapsedPanelBtn : String -> String -> Msg -> Html Msg
collapsedPanelBtn icon label msg =
    button
        [ onClick msg
        , title label
        , style "display" "flex"
        , style "align-items" "center"
        , style "gap" "8px"
        , style "width" "100%"
        , style "padding" "8px 12px"
        , style "border-radius" "10px"
        , style "background" "rgba(124,77,255,0.15)"
        , style "border" "1px solid rgba(124,77,255,0.35)"
        , style "color" "#ce93d8"
        , style "font-size" "0.82rem"
        , style "font-weight" "600"
        , style "cursor" "pointer"
        , style "font-family" "inherit"
        , style "flex-shrink" "0"
        ]
        [ span [ style "font-family" "monospace" ] [ text icon ]
        , span [] [ text label ]
        , span [ style "margin-left" "auto", style "opacity" "0.6", style "font-size" "0.7rem" ] [ text "▶" ]
        ]



viewCollapsedStrip : Translations -> Model -> Html Msg
viewCollapsedStrip t model =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        , style "align-items" "center"
        , style "gap" "6px"
        , style "padding-top" "8px"
        , style "width" "44px"
        , style "flex-shrink" "0"
        ]
        [ stripIconBtn "📝" t.testString ToggleTestPanel
        , stripIconBtn "{ }" t.code ToggleCodePanel
        ]


stripIconBtn : String -> String -> Msg -> Html Msg
stripIconBtn icon tooltip msg =
    button
        [ onClick msg
        , title tooltip
        , style "width" "36px"
        , style "height" "36px"
        , style "border-radius" "10px"
        , style "background" "rgba(124,77,255,0.25)"
        , style "border" "1px solid rgba(124,77,255,0.4)"
        , style "color" "#ce93d8"
        , style "font-size" "0.85rem"
        , style "cursor" "pointer"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        , style "font-family" "monospace"
        ]
        [ text icon ]


---------------------------- TOP BAR ------------------------------------------------

viewTopBar : Translations -> Model -> Html Msg
viewTopBar t model =
    div
        [ style "background" "linear-gradient(135deg, #4a0080, #6a0dad, #7c4dff)"
        , style "padding" "12px 28px"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "space-between"
        , style "box-shadow" "0 2px 20px rgba(124,77,255,0.5)"
        , style "position" "relative"
        ]
        [ h1
            [ style "font-family" "monospace"
            , style "font-size" "1.6rem"
            , style "color" "#fff"
            , style "margin" "0"
            , style "letter-spacing" "1px"
            ]
            [ text "DFA Simulator" ]
        , div [ style "display" "flex", style "gap" "10px", style "align-items" "center" ]
            [ settingsBtn t model
            , topBarBtn t.save RequestSave
            , topBarBtn t.load RequestLoad
            , topBarBtn t.guide ToggleHelp
            , topBarBtn t.feedback ToggleFeedback
            , topBarBtn t.clearAll ClearAll
            ]
        ]


settingsBtn : Translations -> Model -> Html Msg
settingsBtn t model =
    div [ style "position" "relative" ]
        [ button
            [ onClick ToggleSettings
            , style "background"
                (if model.showSettings then
                    "rgba(124,77,255,0.5)"
                 else
                    "rgba(255,255,255,0.12)"
                )
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
            [ text "⚙️"
            , span [] [ text t.settingsTitle ]
            ]
        , if model.showSettings then
            settingsDropdown t model
          else
            text ""
        ]


settingsDropdown : Translations -> Model -> Html Msg
settingsDropdown t model =
    div
        [ style "position" "absolute"
        , style "top" "calc(100% + 8px)"
        , style "right" "0"
        , style "background" "#1e1e3a"
        , style "border" "1px solid rgba(124,77,255,0.4)"
        , style "border-radius" "14px"
        , style "padding" "18px 20px"
        , style "min-width" "300px"
        , style "box-shadow" "0 8px 32px rgba(0,0,0,0.6)"
        , style "z-index" "9000"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "16px"
        ]
        [ 
          div []
            [ div
                [ style "font-size" "0.72rem"
                , style "color" "#7986cb"
                , style "letter-spacing" "0.5px"
                , style "text-transform" "uppercase"
                , style "font-weight" "600"
                , style "margin-bottom" "8px"
                ]
                [ text t.settingsLanguage ]
            , div [ style "display" "flex", style "gap" "8px" ]
                [ langChoiceBtn model.language EN "EN"
                , langChoiceBtn model.language SK "SK"
                ]
            ]
        , div
            [ style "height" "1px"
            , style "background" "rgba(255,255,255,0.08)"
            ]
            []
        ,
          div
            [ style "display" "flex"
            , style "align-items" "flex-start"
            , style "gap" "12px"
            , style "cursor" "pointer"
            , onClick ToggleAutoReorder
            ]
            [ 
              div
                [ style "width" "36px"
                , style "height" "20px"
                , style "border-radius" "10px"
                , style "background"
                    (if model.autoReorderOnDelete then
                        "linear-gradient(135deg,#7c4dff,#e040fb)"
                     else
                        "rgba(255,255,255,0.15)"
                    )
                , style "position" "relative"
                , style "flex-shrink" "0"
                , style "margin-top" "1px"
                , style "transition" "background 0.2s"
                ]
                [ div
                    [ style "position" "absolute"
                    , style "top" "3px"
                    , style "left"
                        (if model.autoReorderOnDelete then "19px" else "3px")
                    , style "width" "14px"
                    , style "height" "14px"
                    , style "border-radius" "50%"
                    , style "background" "#fff"
                    , style "transition" "left 0.2s"
                    ]
                    []
                ]
            , div []
                [ div
                    [ style "font-size" "0.88rem"
                    , style "font-weight" "600"
                    , style "color" "#e8eaf6"
                    , style "margin-bottom" "3px"
                    ]
                    [ text t.settingsAutoReorder ]
                , div
                    [ style "font-size" "0.74rem"
                    , style "color" "#7986cb"
                    , style "line-height" "1.4"
                    ]
                    [ text t.settingsAutoReorderDesc ]
                ]
            ]
        ]


langChoiceBtn : Language -> Language -> String -> Html Msg
langChoiceBtn current target label =
    button
        [ onClick
            (if current == target then NoOp else ToggleLanguage)
        , style "background"
            (if current == target then
                "linear-gradient(135deg,#7c4dff,#e040fb)"
             else
                "rgba(255,255,255,0.08)"
            )
        , style "border"
            (if current == target then
                "1.5px solid #7c4dff"
             else
                "1.5px solid rgba(255,255,255,0.2)"
            )
        , style "color" "#fff"
        , style "padding" "6px 18px"
        , style "border-radius" "20px"
        , style "cursor" (if current == target then "default" else "pointer")
        , style "font-family" "inherit"
        , style "font-size" "0.83rem"
        , style "font-weight" "600"
        ]
        [ text label ]




------------------------------------- DIAGRAM PANEL -----------------------------------------------------

viewDiagramPanel : Translations -> Model -> Html Msg
viewDiagramPanel t model =
    panel
        [ style "display" "flex"
        , style "flex-direction" "column"
        , style "min-height" "0"
        , style "min-width" "0"
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