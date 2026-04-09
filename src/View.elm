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
import Html.Events exposing (onInput)



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
        , if model.showSettings then
            viewSettingsModal t model 
          else
            text ""
        , if model.showSaveModal then
            viewSaveModal t model
          else
            text ""
        , if model.showLoadModal then
            viewLoadModal t model
          else
            text ""
        , viewToast model
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
            , topBarBtn t.save OpenSaveModal
            , topBarBtn t.load OpenLoadModal
            , topBarBtn t.guide ToggleHelp
            , topBarBtn t.feedback ToggleFeedback
            , topBarBtn t.clearAll ClearAll
            ]
        ]


settingsBtn : Translations -> Model -> Html Msg
settingsBtn t model =
     button
            [ onClick ToggleSettings
            , style "background" "rgba(255,255,255,0.15)"
            , style "border" "1px solid rgba(255,255,255,0.3)"
            , style "color" "white"
            , style "padding" "7px 14px"
            , style "border-radius" "20px"
            , style "cursor" "pointer"
            , style "font-family" "inherit"
            , style "font-size" "0.85rem"
            , style "font-weight" "600"
            ]
            [ text t.settingsTitle ]
        

viewSettingsModal : Translations -> Model -> Html Msg
viewSettingsModal t model =
    div
        [ style "position" "fixed"
        , style "inset" "0"
        , style "background" "rgba(0,0,0,0.7)"
        , style "z-index" "9999"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        , onClick ToggleSettings
        ]
        [ div
            [ style "background" "#1e1e3a"
            , style "border" "1px solid rgba(124,77,255,0.4)"
            , style "border-radius" "16px"
            , style "padding" "26px 28px"
            , style "width" "340px"
            , style "max-width" "90vw"
            , style "box-shadow" "0 8px 32px rgba(0,0,0,0.5)"
            , style "display" "flex"
            , style "flex-direction" "column"
            , style "gap" "16px"
            , Html.Events.stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
            ]
            [ div [ style "display" "flex", style "align-items" "center", style "margin-bottom" "4px" ]
                [ h3 [ style "margin" "0", style "font-size" "1.1rem", style "color" "#fff" ]
                    [ text t.settingsTitle ]
                , button
                    [ onClick ToggleSettings
                    , style "margin-left" "auto"
                    , style "background" "transparent"
                    , style "border" "none"
                    , style "color" "#9fa8da"
                    , style "font-size" "1.2rem"
                    , style "cursor" "pointer"
                    ]
                    [ text "✕" ]
                ]
            , div []
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
            , div [ style "height" "1px", style "background" "rgba(255,255,255,0.08)" ] []
            , div
                [ style "display" "flex"
                , style "align-items" "flex-start"
                , style "gap" "12px"
                , style "cursor" "pointer"
                , onClick ToggleAutoReorder
                ]
                [ div
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
                    , style "margin-top" "2px"
                    , style "transition" "background 0.2s"
                    ]
                    [ div
                        [ style "position" "absolute"
                        , style "top" "3px"
                        , style "left" (if model.autoReorderOnDelete then "19px" else "3px")
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
               , button
                    [ onClick ExportSvg
                    , title t.exportSvgBtn
                    , style "background" "rgba(38,166,154,0.2)"
                    , style "border" "1.5px solid rgba(38,166,154,0.6)"
                    , style "color" "#80cbc4"
                    , style "width" "40px"
                    , style "height" "40px"
                    , style "border-radius" "10px"
                    , style "cursor" "pointer"
                    , style "font-size" "0.72rem"
                    , style "font-weight" "700"
                    , style "font-family" "monospace"
                    , style "display" "flex"
                    , style "align-items" "center"
                    , style "justify-content" "center"
                    , style "padding" "0"
                    ]
                    [ text "SVG" ]
                ]
            ]
        , if not (Dict.isEmpty model.statePositions) then
            viewStateList t model
          else
            text ""
        ]

--------------SAVE MODAL --------------------------------------------------------


viewSaveModal : Translations -> Model -> Html Msg
viewSaveModal t model =
    modalBackdrop CloseSaveModal
        [ modalCard
            [ modalHeader t.modalSaveTitle CloseSaveModal
            , div [ style "display" "flex", style "gap" "10px", style "margin-bottom" "16px" ]
                [ input
                    [ value model.saveNameInput
                    , onInput SetSaveNameInput
                    , placeholder t.modalSaveNamePlaceholder
                    , Html.Events.on "keydown"
                        (Decode.field "key" Decode.string
                            |> Decode.andThen
                                (\k -> if k == "Enter" then Decode.succeed ConfirmSave else Decode.fail "")
                        )
                    , style "flex" "1"
                    , style "background" "rgba(255,255,255,0.07)"
                    , style "border" "1.5px solid rgba(124,77,255,0.5)"
                    , style "border-radius" "10px"
                    , style "padding" "9px 14px"
                    , style "color" "#e8eaf6"
                    , style "font-family" "inherit"
                    , style "font-size" "0.9rem"
                    , style "outline" "none"
                    ]
                    []
                , modalPrimaryBtn t.modalSaveBtn ConfirmSave
                ]
            , modalSectionLabel t.modalSavedDiagrams
            , div [ style "display" "flex", style "flex-direction" "column", style "gap" "8px", style "overflow-y" "auto", style "max-height" "340px" ]
                (if List.isEmpty model.savedDiagrams then
                    [ div [ style "text-align" "center", style "color" "#5c6bc0", style "font-size" "0.85rem", style "padding" "32px 0" ]
                        [ text t.modalNoSaves ]
                    ]
                else
                    List.map (viewSaveItem t model) (List.reverse model.savedDiagrams)
                )
            ]
        ]


viewSaveItem : Translations -> Model -> SavedDiagram -> Html Msg
viewSaveItem t model saved =
    div
        [ style "background" "rgba(255,255,255,0.05)"
        , style "border" "1px solid rgba(255,255,255,0.1)"
        , style "border-radius" "12px"
        , style "padding" "12px 16px"
        , style "display" "flex"
        , style "align-items" "center"
        , style "gap" "12px"
        ]
        [ div [ style "flex" "1", style "min-width" "0" ]
            [ case model.renamingDiagramId of
                Just rid ->
                    if rid == saved.id then
                        div [ style "display" "flex", style "gap" "6px" ]
                            [ input
                                [ value model.renameDialogValue
                                , onInput SetRenameDiagramValue
                                , Html.Events.on "keydown"
                                    (Decode.field "key" Decode.string
                                        |> Decode.andThen
                                            (\k ->
                                                if k == "Enter" then Decode.succeed ConfirmRenameDiagram
                                                else if k == "Escape" then Decode.succeed CancelRenameDiagram
                                                else Decode.fail ""
                                            )
                                    )
                                , style "flex" "1"
                                , style "background" "rgba(255,255,255,0.1)"
                                , style "border" "1.5px solid #7c4dff"
                                , style "border-radius" "6px"
                                , style "padding" "3px 8px"
                                , style "color" "#fff"
                                , style "font-family" "inherit"
                                , style "font-size" "0.88rem"
                                , style "outline" "none"
                                ]
                                []
                            , button [ onClick ConfirmRenameDiagram, style "background" "none", style "border" "none", style "color" "#9fa8da", style "cursor" "pointer", style "font-size" "1rem" ] [ text "✔" ]
                            , button [ onClick CancelRenameDiagram,  style "background" "none", style "border" "none", style "color" "#9fa8da", style "cursor" "pointer", style "font-size" "1rem" ] [ text "✕" ]
                            ]
                    else
                        savedItemName saved.name

                Nothing ->
                    savedItemName saved.name
            , div [ style "font-size" "0.73rem", style "color" "#7986cb", style "margin-top" "3px" ]
                [ text (savedItemMeta t saved) ]
            ]
        , div [ style "display" "flex", style "gap" "6px", style "flex-shrink" "0" ]
            [ savedBtn t.modalRenameBtn "pointer" (StartRenameDiagram saved.id) "rgba(124,77,255,0.2)" "rgba(124,77,255,0.5)" "#ce93d8" "dfa-btn-purple"
            , savedBtn t.exportDfaBtn  "pointer" (ExportDiagram saved.id)      "rgba(38,166,154,0.18)" "rgba(38,166,154,0.5)" "#80cbc4" "dfa-btn-teal"
            , savedBtn t.modalDeleteBtn "pointer" (DeleteSavedDiagram saved.id) "rgba(239,83,80,0.15)"  "rgba(239,83,80,0.4)"  "#ef9a9a" "dfa-btn-red"
            ]
        ]


------------------------------ LOAD MODAL -------------------------------------------

viewLoadModal : Translations -> Model -> Html Msg
viewLoadModal t model =
    modalBackdrop CloseLoadModal
        [ modalCard
            [ modalHeader t.modalLoadTitle CloseLoadModal
            , div
                [ style "display" "flex"
                , style "align-items" "center"
                , style "gap" "10px"
                , style "margin-bottom" "14px"
                ]
                [ button
                    [ onClick RequestImportFile
                    , style "background" "rgba(38,166,154,0.18)"
                    , style "border" "1px solid rgba(38,166,154,0.5)"
                    , style "color" "#80cbc4"
                    , style "padding" "8px 18px"
                    , style "border-radius" "10px"
                    , style "cursor" "pointer"
                    , style "font-family" "inherit"
                    , style "font-size" "0.85rem"
                    , style "font-weight" "600"
                    , style "white-space" "nowrap"
                    ]
                    [ text t.importDfaBtn ]
                , span [ style "font-size" "0.75rem", style "color" "#5c6bc0" ] [ text t.importHint ]
                ]
            , modalSectionLabel t.modalYourSavedDiagrams
            , div [ style "display" "flex", style "flex-direction" "column", style "gap" "8px", style "overflow-y" "auto", style "max-height" "360px" ]
                (if List.isEmpty model.savedDiagrams then
                    [ div [ style "text-align" "center", style "color" "#5c6bc0", style "font-size" "0.85rem", style "padding" "32px 0" ]
                        [ text t.modalNoSaves ]
                    ]
                else
                    List.map (viewLoadItem t) (List.reverse model.savedDiagrams)
                )
            ]
        ]


viewLoadItem : Translations -> SavedDiagram -> Html Msg
viewLoadItem t saved =
    div
        [ style "background" "rgba(255,255,255,0.05)"
        , style "border" "1px solid rgba(255,255,255,0.1)"
        , style "border-radius" "12px"
        , style "padding" "12px 16px"
        , style "display" "flex"
        , style "align-items" "center"
        , style "gap" "12px"
        ]
        [ div [ style "flex" "1", style "min-width" "0" ]
            [ savedItemName saved.name
            , div [ style "font-size" "0.73rem", style "color" "#7986cb", style "margin-top" "3px" ]
                [ text (savedItemMeta t saved) ]
            ]
        , div [ style "display" "flex", style "gap" "6px", style "flex-shrink" "0" ]
            [ savedBtn t.modalLoadBtn  "pointer" (LoadSavedDiagram saved.id)  "rgba(124,77,255,0.2)"  "rgba(124,77,255,0.5)"  "#ce93d8" "dfa-btn-purple"
            , savedBtn t.exportDfaBtn  "pointer" (ExportDiagram saved.id)     "rgba(38,166,154,0.18)" "rgba(38,166,154,0.5)"  "#80cbc4" "dfa-btn-teal"
            , savedBtn t.modalDeleteBtn "pointer" (DeleteSavedDiagram saved.id) "rgba(239,83,80,0.15)" "rgba(239,83,80,0.4)"  "#ef9a9a" "dfa-btn-red"
            ]
        ]



------------------------ MODAL SHARED HELPERS ---------------------------------------

modalBackdrop : Msg -> List (Html Msg) -> Html Msg
modalBackdrop closeMsg children =
    div
        [ style "position" "fixed"
        , style "inset" "0"
        , style "background" "rgba(0,0,0,0.65)"
        , style "z-index" "9999"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        , onClick closeMsg
        ]
        children


modalCard : List (Html Msg) -> Html Msg
modalCard children =
    div
        [ style "background" "#1e1e3a"
        , style "border" "1px solid rgba(124,77,255,0.4)"
        , style "border-radius" "18px"
        , style "padding" "28px 32px"
        , style "width" "560px"
        , style "max-width" "95vw"
        , style "max-height" "82vh"
        , style "display" "flex"
        , style "flex-direction" "column"
        , style "box-shadow" "0 8px 48px rgba(0,0,0,0.7)"
        , style "font-family" "'Segoe UI', Arial, sans-serif"
        , style "color" "#e8eaf6"
        , Html.Events.stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
        ]
        children


modalHeader : String -> Msg -> Html Msg
modalHeader title closeMsg =
    div
        [ style "display" "flex"
        , style "align-items" "center"
        , style "margin-bottom" "20px"
        ]
        [ h2
            [ style "font-size" "1.25rem"
            , style "font-weight" "700"
            , style "color" "#fff"
            , style "margin" "0"
            ]
            [ text title ]
        , button
            [ onClick closeMsg
            , style "margin-left" "auto"
            , style "background" "transparent"
            , style "border" "none"
            , style "color" "#9fa8da"
            , style "font-size" "1.3rem"
            , style "cursor" "pointer"
            , style "line-height" "1"
            , style "padding" "0 4px"
            ]
            [ text "✕" ]
        ]


modalSectionLabel : String -> Html Msg
modalSectionLabel lbl =
    div
        [ style "font-size" "0.72rem"
        , style "color" "#7986cb"
        , style "letter-spacing" "0.5px"
        , style "text-transform" "uppercase"
        , style "font-weight" "600"
        , style "margin-bottom" "10px"
        ]
        [ text lbl ]


modalPrimaryBtn : String -> Msg -> Html Msg
modalPrimaryBtn lbl msg =
    button
        [ onClick msg
        , style "background" "linear-gradient(135deg, #7c4dff, #e040fb)"
        , style "border" "none"
        , style "color" "#fff"
        , style "padding" "9px 22px"
        , style "border-radius" "10px"
        , style "cursor" "pointer"
        , style "font-family" "inherit"
        , style "font-size" "0.88rem"
        , style "font-weight" "600"
        , style "white-space" "nowrap"
        ]
        [ text lbl ]


savedItemName : String -> Html Msg
savedItemName name =
    div
        [ style "font-weight" "600"
        , style "font-size" "0.92rem"
        , style "color" "#fff"
        , style "white-space" "nowrap"
        , style "overflow" "hidden"
        , style "text-overflow" "ellipsis"
        ]
        [ text name ]


savedItemMeta : Translations -> SavedDiagram -> String
savedItemMeta t saved =
    let
        sc = saved.data.states      |> String.split "," |> List.filter (String.trim >> (/=) "") |> List.length
        tc = saved.data.transitions |> String.lines     |> List.filter (String.trim >> (/=) "") |> List.length
    in
    (if saved.savedAt /= "" then saved.savedAt ++ "  ·  " else "")
    ++ t.statsSuffix sc tc


savedBtn : String -> String -> Msg -> String -> String -> String -> String -> Html Msg
savedBtn lbl cursor msg bg border color cssClass =
    button
        [ onClick msg
        , class cssClass
        , style "background" bg
        , style "border" ("1px solid " ++ border)
        , style "color" color
        , style "padding" "5px 12px"
        , style "border-radius" "8px"
        , style "cursor" cursor
        , style "font-family" "inherit"
        , style "font-size" "0.78rem"
        , style "font-weight" "600"
        ]
        [ text lbl ]


--------------------- TOAST----------------------------------

viewToast : Model -> Html Msg
viewToast model =
    div
        [ style "position" "fixed"
        , style "bottom" "32px"
        , style "left" "50%"
        , style "transform"
            (if model.toastVisible then
                "translateX(-50%) translateY(0)"
             else
                "translateX(-50%) translateY(80px)"
            )
        , style "opacity" (if model.toastVisible then "1" else "0")
        , style "background" "linear-gradient(135deg, #7c4dff, #e040fb)"
        , style "color" "#fff"
        , style "padding" "10px 28px"
        , style "border-radius" "24px"
        , style "font-family" "'Segoe UI', Arial, sans-serif"
        , style "font-size" "0.88rem"
        , style "font-weight" "600"
        , style "z-index" "99999"
        , style "box-shadow" "0 4px 24px rgba(0,0,0,0.5)"
        , style "transition" "transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.35s"
        , style "pointer-events" "none"
        ]
        [ text model.toastMessage ]