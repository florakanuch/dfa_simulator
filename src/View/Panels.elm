module View.Panels exposing
    ( viewTestStringPanel
    , viewCodePanel
    , viewStateList
    , viewRenamePopup
    , viewTransCharPopup
    , viewHelpModal
    , viewFeedbackModal
    )


import Dict
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput, custom)
import Json.Decode as Decode
import Types exposing (..)
import View.Widgets exposing (..)




------------------------- TEST STRING PANEL --------------------------------------------------

viewTestStringPanel : Model -> Html Msg
viewTestStringPanel model =
    panel
        []
        [ collapsibleHeader "Test String" model.testCollapsed ToggleTestPanel
        , if model.testCollapsed then text "" else
          div [ style "margin-top" "10px" ]
          [ div [] [ text "" ]
          , input
              [ value model.testWord
              , onInput SetTestWord
              , placeholder "Enter test word…"
              , style "width" "100%"
              , style "background" "rgba(255,255,255,0.06)"
              , style "border" "2px solid #7c4dff"
              , style "border-radius" "10px"
              , style "padding" "10px 14px"
              , style "color" "#e8eaf6"
              , style "font-family" "monospace"
              , style "font-size" "0.9rem"
              , style "outline" "none"
              , style "box-sizing" "border-box"
              ]
              []
          , styledBtn "⚙ Load DFA" LoadDFA purpleGrad "100%" "9px 0"
          , rowLabel "Auto run"
          , div [ style "display" "flex", style "gap" "8px", style "margin-top" "6px" ]
              [ autoRunBtn model
              , autoStopBtn model
              ]
          , div [ style "margin-top" "8px" ]
              [ div
                  [ style "display" "flex"
                  , style "align-items" "center"
                  , style "justify-content" "space-between"
                  , style "margin-bottom" "4px"
                  ]
                  [ span [ style "font-size" "0.72rem", style "color" "#9fa8da" ] [ text "Speed" ]
                  , span [ style "font-size" "0.72rem", style "color" "#9fa8da", style "font-family" "monospace" ]
                      [ text
                          (let
                              tenths = round (toFloat (2100 - model.autoSpeed) / 100)
                              whole = tenths // 10
                              frac = remainderBy 10 tenths
                           in
                           String.fromInt whole ++ "." ++ String.fromInt frac ++ " s/step"
                          )
                      ]
                  ]
              , div [ style "display" "flex", style "align-items" "center", style "gap" "8px" ]
                  [ span [ style "font-size" "1rem" ] [ text "🐌" ]
                  , input
                      [ type_ "range"
                      , Html.Attributes.min "100"
                      , Html.Attributes.max "2000"
                      , step "100"
                      , value (String.fromInt model.autoSpeed)
                      , onInput (\v -> SetAutoSpeed (String.toInt v |> Maybe.withDefault 800))
                      , style "flex" "1"
                      , style "accent-color" "#7c4dff"
                      , style "cursor" "pointer"
                      ]
                      []
                  , span [ style "font-size" "1rem" ] [ text "🐎" ]
                  ]
              ]
          , rowLabel "Step-by-step"
          , div [ style "display" "flex", style "gap" "6px", style "margin-top" "6px" ]
              [ stepBtn "<< Reset" ResetSim
              , stepBtn "< Back" StepBack
              , stepBtn "> Step" StepForward
              , stepBtn ">> Read all" RunAll
              ]
          , div
              [ style "background" "rgba(255,255,255,0.05)"
              , style "border-radius" "10px"
              , style "padding" "12px 14px"
              , style "margin-top" "12px"
              , style "font-family" "monospace"
              , style "font-size" "0.78rem"
              , style "line-height" "1.8"
              , style "border-left"
                  (if String.contains "ACCEPTED" model.simMessage then
                      "3px solid #69f0ae"
                   else if String.contains "REJECTED" model.simMessage then
                      "3px solid #ef5350"
                   else
                      "3px solid #7c4dff"
                  )
              ]
              [ div []
                  [ span [ style "color" "#9fa8da" ] [ text "Status: " ]
                  , span [ style "color" "#e040fb", style "font-weight" "700" ]
                      [ text model.simMessage ]
                  ]
              , div []
                  [ span [ style "color" "#9fa8da" ] [ text "Index: " ]
                  , span []
                      [ text
                          (String.fromInt model.simPosition
                              ++ " / "
                              ++ String.fromInt (String.length model.testWord)
                          )
                      ]
                  ]
              , div []
                  [ span [ style "color" "#9fa8da" ] [ text "Current State: " ]
                  , span [] [ text (Maybe.withDefault "—" model.currentState) ]
                  ]
              ]
          ]
        ]





---------------------------------- CODE PANEL -----------------------------------------------------------

viewCodePanel : Model -> Html Msg
viewCodePanel model =
    panel
        []
        [ collapsibleHeader "Code" model.codeCollapsed ToggleCodePanel
        , if model.codeCollapsed then text "" else
          div [ style "margin-top" "10px" ]
          [ div [ style "display" "flex", style "flex-direction" "column", style "gap" "12px" ]
              [ codeField "States" model.codeStates SetCodeStates "q0, q1, q2"
              , codeField "Alphabet" model.codeAlphabet SetCodeAlphabet "a, b"
              , codeField "Start state" model.codeStart SetCodeStart "q0"
              , codeField "Accept states" model.codeAccept SetCodeAccept "q2"
              , div [ style "position" "relative" ]
                  [ codeFieldLabel "Transitions"
                  , textarea
                      [ value model.codeTransitions
                      , onInput SetCodeTransitions
                      , placeholder "q0,a,q1\nq1,b,q2\nq2,a,q2"
                      , style "width" "100%"
                      , style "background" "rgba(255,255,255,0.04)"
                      , style "border" "1.5px solid rgba(124,77,255,0.4)"
                      , style "border-radius" "8px"
                      , style "padding" "14px 12px 10px"
                      , style "color" "#e8eaf6"
                      , style "font-family" "monospace"
                      , style "font-size" "0.82rem"
                      , style "outline" "none"
                      , style "resize" "vertical"
                      , style "min-height" "90px"
                      , style "line-height" "1.6"
                      , style "box-sizing" "border-box"
                      ]
                      []
                  ]
              ]
          , styledBtn "Generate diagram" GenerateDiagramFromCode pinkGrad "100%" "9px 0"
          ]
        ]


codeField : String -> String -> (String -> Msg) -> String -> Html Msg
codeField lbl val handler ph =
    div [ style "position" "relative" ]
        [ codeFieldLabel lbl
        , input
            [ value val
            , onInput handler
            , placeholder ph
            , style "width" "100%"
            , style "background" "rgba(255,255,255,0.04)"
            , style "border" "1.5px solid rgba(124,77,255,0.4)"
            , style "border-radius" "8px"
            , style "padding" "10px 12px"
            , style "color" "#e8eaf6"
            , style "font-family" "monospace"
            , style "font-size" "0.82rem"
            , style "outline" "none"
            , style "box-sizing" "border-box"
            ]
            []
        ]


codeFieldLabel : String -> Html Msg
codeFieldLabel lbl =
    span
        [ style "font-size" "0.68rem"
        , style "color" "#7c4dff"
        , style "font-weight" "600"
        , style "letter-spacing" "0.8px"
        , style "text-transform" "uppercase"
        , style "position" "absolute"
        , style "top" "-8px"
        , style "left" "10px"
        , style "background" "#1a1a2e"
        , style "padding" "0 4px"
        , style "z-index" "1"
        ]
        [ text lbl ]




-------------------------------------- STATE LIST -------------------------------

viewStateList : Model -> Html Msg
viewStateList model =
    div
        [ style "margin-top" "12px"
        , style "flex-shrink" "0"
        , style "background" "rgba(255,255,255,0.04)"
        , style "border-radius" "10px"
        , style "padding" "10px 12px"
        ]
        [ collapsibleHeader
            ("States  (" ++ String.fromInt (Dict.size model.statePositions) ++ ")")
            model.stateListCollapsed
            ToggleStateList
        , if model.stateListCollapsed then
            text ""
          else
            div
                [ style "margin-top" "8px"
                , style "max-height" "160px"
                , style "overflow-y" "auto"
                ]
                ([ div
                    [ style "font-size" "0.68rem"
                    , style "color" "#9fa8da"
                    , style "margin-bottom" "6px"
                    , style "letter-spacing" "0.3px"
                    ]
                    [ text "✎ rename · S start · A accept · X delete" ]
                 ]
                    ++ (Dict.keys model.statePositions
                            |> List.map (viewStateRow model)
                       )
                )
        ]


viewStateRow : Model -> String -> Html Msg
viewStateRow model state =
    div
        [ style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "space-between"
        , style "padding" "4px 6px"
        , style "margin-bottom" "3px"
        , style "border-radius" "6px"
        , style "border-left"
            ("3px solid "
                ++ (if state == model.startState then
                        "#ffb74d"
                    else if List.member state model.acceptStates then
                        "#4fc3f7"
                    else
                        "#444"
                   )
            )
        , style "background" "rgba(255,255,255,0.03)"
        ]
        [ span [ style "font-family" "monospace", style "font-size" "0.85rem" ] [ text state ]
        , div [ style "display" "flex", style "gap" "4px" ]
            [ miniBtn "✎" (StartRename state) False "#e040fb"
            , miniBtn "S" (SetStartState state) (state == model.startState) "#ffb74d"
            , miniBtn "A" (ToggleAcceptState state) (List.member state model.acceptStates) "#4fc3f7"
            , miniBtn "X" (DeleteState state) False "#ef5350"
            ]
        ]



-------------------------- RENAME POPUP -------------------------------------


viewRenamePopup : String -> String -> Html Msg
viewRenamePopup stateName currentVal =
    div
        [ style "position" "fixed"
        , style "inset" "0"
        , style "background" "rgba(0,0,0,0.6)"
        , style "z-index" "200"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        ]
        [ div
            [ style "background" "#1e1e3a"
            , style "border" "2px solid #e040fb"
            , style "border-radius" "14px"
            , style "padding" "22px 24px"
            , style "min-width" "260px"
            , style "box-shadow" "0 8px 32px rgba(0,0,0,0.5)"
            ]
            [ div
                [ style "font-size" "0.9rem"
                , style "font-weight" "600"
                , style "margin-bottom" "6px"
                ]
                [ text ("Rename state: " ++ stateName) ]
            , input
                [ value currentVal
                , onInput SetRenameValue
                , Html.Events.on "keydown"
                    (Decode.field "key" Decode.string
                        |> Decode.andThen
                            (\k ->
                                if k == "Enter" then
                                    Decode.succeed ConfirmRename
                                else if k == "Escape" then
                                    Decode.succeed CancelRename
                                else
                                    Decode.fail "other key"
                            )
                    )
                , style "width" "100%"
                , style "background" "rgba(255,255,255,0.06)"
                , style "border" "1px solid #e040fb"
                , style "border-radius" "8px"
                , style "padding" "8px 12px"
                , style "color" "#e8eaf6"
                , style "font-family" "monospace"
                , style "font-size" "0.9rem"
                , style "outline" "none"
                , style "box-sizing" "border-box"
                , style "margin-bottom" "12px"
                ]
                []
            , div [ style "display" "flex", style "gap" "10px" ]
                [ styledBtn "Rename" ConfirmRename purpleGrad "50%" "8px 0"
                , styledBtn "Cancel" CancelRename "rgba(255,255,255,0.1)" "50%" "8px 0"
                ]
            ]
        ]



---------------------------------- TRANSITION CHAR POPUP --------------------------------------------

viewTransCharPopup : Model -> Html Msg
viewTransCharPopup model =
    div
        [ style "position" "fixed"
        , style "inset" "0"
        , style "background" "rgba(0,0,0,0.6)"
        , style "z-index" "200"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        ]
        [ div
            [ style "background" "#1e1e3a"
            , style "border" "2px solid #7c4dff"
            , style "border-radius" "14px"
            , style "padding" "22px 24px"
            , style "min-width" "260px"
            , style "box-shadow" "0 8px 32px rgba(0,0,0,0.5)"
            ]
            [ div
                [ style "font-size" "0.9rem"
                , style "font-weight" "600"
                , style "margin-bottom" "6px"
                ]
                [ text
                    ("Transition: "
                        ++ model.pendingTransFrom
                        ++ " → "
                        ++ model.pendingTransTo
                    )
                ]
            , div
                [ style "font-size" "0.78rem"
                , style "color" "#9fa8da"
                , style "margin-bottom" "10px"
                ]
                [ text "Character for this transition:" ]
            , input
                [ value model.transitionChar
                , onInput SetTransitionChar
                , placeholder "e.g.  a"
                , Html.Events.on "keydown"
                    (Decode.field "key" Decode.string
                        |> Decode.andThen
                            (\k ->
                                if k == "Enter" then
                                    Decode.succeed ConfirmTransition
                                else if k == "Escape" then
                                    Decode.succeed CancelTransition
                                else
                                    Decode.fail "other key"
                            )
                    )
                , style "width" "100%"
                , style "background" "rgba(255,255,255,0.06)"
                , style "border" "1px solid #7c4dff"
                , style "border-radius" "8px"
                , style "padding" "8px 12px"
                , style "color" "#e8eaf6"
                , style "font-family" "monospace"
                , style "font-size" "0.9rem"
                , style "outline" "none"
                , style "box-sizing" "border-box"
                , style "margin-bottom" "12px"
                ]
                []
            , div [ style "display" "flex", style "gap" "10px" ]
                [ styledBtn "Add" ConfirmTransition purpleGrad "50%" "8px 0"
                , styledBtn "Cancel" CancelTransition "rgba(255,255,255,0.1)" "50%" "8px 0"
                ]
            ]
        ]



----------------------------------- HELP MODAL -----------------------------------------------

viewHelpModal : Html Msg
viewHelpModal =
    div
        [ style "position" "fixed"
        , style "inset" "0"
        , style "background" "rgba(0,0,0,0.7)"
        , style "z-index" "300"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        , onClick ToggleHelp
        ]
        [ div
            [ style "background" "#1e1e3a"
            , style "border" "1px solid rgba(124,77,255,0.4)"
            , style "border-radius" "16px"
            , style "padding" "26px 28px"
            , style "max-width" "420px"
            , style "width" "90%"
            , style "box-shadow" "0 8px 32px rgba(0,0,0,0.5)"
            , custom "click"
                (Decode.succeed
                    { message = NoOp
                    , stopPropagation = True
                    , preventDefault = False
                    }
                )
            ]
            [ h3
                [ style "margin-top" "0"
                , style "margin-bottom" "14px"
                , style "font-size" "1.1rem"
                ]
                [ text "📖 Help & Controls" ]
            , helpLine "✋ Select" "Drag states to move them. Double-click a state to rename it."
            , helpLine "⊕ Add State" "Click empty canvas to place a new state."
            , helpLine "→ Add Transition" "Click source state, then target. Enter the character."
            , helpLine "✎ Rename" "Via state list button or double-click on the state."
            , helpLine "S / A / X" "Set Start, toggle Accept, or delete the state."
            , helpLine "Code panel" "Format: from,char,to — one per line. Click Generate diagram."
            , helpLine "Simulation" "Enter test word → Load DFA → Step / Run / Read all."
            , helpLine "🖐 Pan" "Drag on empty canvas space to move the view."
            , helpLine "View buttons" "Use + / − / ⌂ buttons to zoom and reset the view."
            , div [ style "margin-top" "16px" ]
                [ styledBtn "Got it!" ToggleHelp purpleGrad "100%" "9px 0" ]
            ]
        ]



-------------------------------------- FEEDBACK MODAL ---------------------------------------------------------

viewFeedbackModal : Html Msg
viewFeedbackModal =
    div
        [ style "position" "fixed"
        , style "inset" "0"
        , style "background" "rgba(0,0,0,0.7)"
        , style "z-index" "300"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "center"
        , onClick ToggleFeedback
        ]
        [ div
            [ style "background" "#1e1e3a"
            , style "border" "1px solid rgba(224,64,251,0.4)"
            , style "border-radius" "16px"
            , style "padding" "26px 28px"
            , style "max-width" "400px"
            , style "width" "90%"
            , style "box-shadow" "0 8px 32px rgba(0,0,0,0.5)"
            , custom "click"
                (Decode.succeed
                    { message = NoOp
                    , stopPropagation = True
                    , preventDefault = False
                    }
                )
            ]
            [ h3
                [ style "margin-top" "0"
                , style "margin-bottom" "6px"
                , style "font-size" "1.1rem"
                ]
                [ text "💬 Feedback" ]
            , p
                [ style "font-size" "0.83rem"
                , style "color" "#c5cae9"
                , style "margin-bottom" "18px"
                , style "line-height" "1.6"
                ]
                [ text "I'd love to hear your thoughts! Fill out my quick form or send me an email." ]
            , a
                [ href "https://forms.gle/kP81UtQw5daQhpiH7"
                , target "_blank"
                , style "display" "block"
                , style "background" "linear-gradient(135deg, #7c4dff, #e040fb)"
                , style "color" "white"
                , style "text-decoration" "none"
                , style "text-align" "center"
                , style "padding" "10px 0"
                , style "border-radius" "10px"
                , style "font-size" "0.85rem"
                , style "font-weight" "600"
                , style "margin-bottom" "12px"
                ]
                [ text "📋 Open Feedback Form" ]
            , a
                [ href "mailto:florakanuch@gmail.com"
                , style "display" "block"
                , style "background" "rgba(255,255,255,0.07)"
                , style "color" "#c5cae9"
                , style "text-decoration" "none"
                , style "text-align" "center"
                , style "padding" "10px 0"
                , style "border-radius" "10px"
                , style "font-size" "0.85rem"
                , style "font-weight" "600"
                , style "margin-bottom" "16px"
                , style "border" "1px solid rgba(255,255,255,0.1)"
                ]
                [ text "✉️ florakanuch@gmail.com" ]
            , styledBtn "Close" ToggleFeedback "rgba(255,255,255,0.1)" "100%" "9px 0"
            ]
        ]