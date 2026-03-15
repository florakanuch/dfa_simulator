module Update exposing (update, defaultModel)

import Dict
import Types exposing (..)
import Simulation exposing (stepOnce, stepBack, runToEnd, checkAcceptance)
import CodeSync exposing (syncCodeFromDiagram, generateDiagramFromCode)




------------------------------ DEFAULT MODEL -----------------------------------------------------------

defaultModel : Model
defaultModel =
    { statePositions = Dict.empty
    , startState = ""
    , acceptStates = []
    , transitions = Dict.empty
    , stateCounter = 0
    , undoStack = []
    , redoStack = []
    , drawTool = AddStateTool
    , transitionFrom = Nothing
    , dragging = Nothing
    , renamingState = Nothing
    , renameValue = ""
    , testWord = ""
    , currentState = Nothing
    , simPosition = 0
    , simHistory = []
    , simMessage = "Add states by clicking the canvas."
    , codeStates = ""
    , codeAlphabet = ""
    , codeStart = ""
    , codeAccept = ""
    , codeTransitions = ""
    , showHelp = False
    , showFeedback = False
    , showTransCharPopup = False
    , pendingTransFrom = ""
    , pendingTransTo = ""
    , transitionChar = "a"
    , autoRunning = False
    , autoSpeed = 800
    , svgZoom = 1.0
    , svgPanX = 0
    , svgPanY = 0
    , isPanning = False
    , panStartX = 0
    , panStartY = 0
    , panStartPanX = 0
    , panStartPanY = 0
    , testCollapsed = False
    , codeCollapsed = False
    , stateListCollapsed = False
    }



--------------------- UNDO/REDO HELPERS ------------------------------------------------------

snapshotDiagram : Model -> DiagramSnapshot
snapshotDiagram model =
    { statePositions = model.statePositions
    , startState = model.startState
    , acceptStates = model.acceptStates
    , transitions = model.transitions
    , stateCounter = model.stateCounter
    }


saveUndo : Model -> Model
saveUndo model =
    { model | undoStack = List.take 50 (snapshotDiagram model :: model.undoStack)
        , redoStack = []
    }


applySnapshot : DiagramSnapshot -> Model -> Model
applySnapshot snap model =
    { model
        | statePositions = snap.statePositions
        , startState = snap.startState
        , acceptStates = snap.acceptStates
        , transitions = snap.transitions
        , stateCounter = snap.stateCounter
    }


-------------------------------------------UPDATE-------------------------

update : Msg -> Model -> Model
update msg model =
    case msg of
        ClickedCanvas x y ->
            case model.drawTool of
                AddStateTool ->
                    let
                        m0 = saveUndo model

                        name = "q" ++ String.fromInt m0.stateCounter

                        newPositions = Dict.insert name { x = x, y = y } m0.statePositions

                        newStart = if m0.startState == "" then name else m0.startState
                    in
                    { m0
                        | statePositions = newPositions
                        , stateCounter = m0.stateCounter + 1
                        , startState = newStart
                        , simMessage = "State added: " ++ name
                    }
                        |> syncCodeFromDiagram

                _ ->
                    model

        ClickedState stateName ->
            case model.drawTool of
                AddTransitionTool ->
                    case model.transitionFrom of
                        Nothing ->
                            { model
                                | transitionFrom = Just stateName
                                , simMessage = "Now click the target state (from: " ++ stateName ++ ")"
                            }

                        Just fromState ->
                            { model
                                | showTransCharPopup = True
                                , pendingTransFrom = fromState
                                , pendingTransTo = stateName
                                , transitionFrom = Nothing
                            }

                DeleteTool ->
                    let
                        m0 = saveUndo model
                        newPos = Dict.remove stateName m0.statePositions
                        newTrans = Dict.filter (\( fr, _ ) to -> fr /= stateName && to /= stateName) m0.transitions
                        newAccept = List.filter ((/=) stateName) m0.acceptStates
                        newStart = if m0.startState == stateName then "" else m0.startState
                    in
                    { m0
                        | statePositions = newPos
                        , transitions = newTrans
                        , acceptStates = newAccept
                        , startState = newStart
                        , simMessage = "Deleted state: " ++ stateName
                    }
                        |> syncCodeFromDiagram

                SelectTool -> model

                AddStateTool -> model

        SetDrawTool tool ->
            { model
                | drawTool = tool
                , transitionFrom = Nothing
                , dragging = Nothing
                , simMessage =
                    case tool of
                        AddStateTool -> "Click canvas to add a state."

                        AddTransitionTool ->  "Click source state to start a transition."

                        SelectTool -> "Drag states to move. Double-click to rename."

                        DeleteTool -> "Click a state or transition to delete it."
            }

        MouseDownOnState stateName mouseX mouseY ->
            if model.drawTool == SelectTool then
                case Dict.get stateName model.statePositions of
                    Just pos ->
                        let
                            m0 = saveUndo model
                        in
                        { m0
                            | dragging =
                                Just
                                    { stateName = stateName
                                    , offsetX =0
                                    , offsetY = 0
                                    }
                        }

                    Nothing -> model

            else
                model

        MouseMove mouseX mouseY ->
            case model.dragging of
                Nothing -> model

                Just drag ->
                    { model
                        | statePositions =
                            Dict.insert drag.stateName
                                { x = mouseX 
                                , y = mouseY 
                                }
                                model.statePositions
                    }

        MouseUp ->
            { model | dragging = Nothing, isPanning = False }

        PanStart mx my ->
            { model
                | isPanning = True
                , panStartX = mx
                , panStartY = my
                , panStartPanX = model.svgPanX
                , panStartPanY = model.svgPanY
            }

        PanMove mx my ->
            if model.isPanning then
                { model
                    | svgPanX = model.panStartPanX + (mx - model.panStartX)
                    , svgPanY = model.panStartPanY + (my - model.panStartY)
                }
            else
                model

        PanEnd ->
            { model | isPanning = False }

        ZoomIn ->
            let
                newZoom = Basics.clamp 0.15 8.0 (model.svgZoom * 1.25)
                cx = 450.0
                cy = 260.0
                newPanX = cx - (cx - model.svgPanX) * (newZoom / model.svgZoom)
                newPanY = cy - (cy - model.svgPanY) * (newZoom / model.svgZoom)
            in
            { model | svgZoom = newZoom, svgPanX = newPanX, svgPanY = newPanY }

        ZoomOut ->
            let
                newZoom = Basics.clamp 0.15 8.0 (model.svgZoom * 0.8)
                cx = 450.0
                cy = 260.0
                newPanX = cx - (cx - model.svgPanX) * (newZoom / model.svgZoom)
                newPanY = cy - (cy - model.svgPanY) * (newZoom / model.svgZoom)
            in
            { model | svgZoom = newZoom, svgPanX = newPanX, svgPanY = newPanY }

        ResetView ->
            { model | svgZoom = 1.0, svgPanX = 0, svgPanY = 0 }

        ToggleTestPanel ->
            { model | testCollapsed = not model.testCollapsed }

        ToggleCodePanel ->
            { model | codeCollapsed = not model.codeCollapsed }

        ToggleStateList ->
            { model | stateListCollapsed = not model.stateListCollapsed }

        DeleteTransition from to ->
            let
                m0 = saveUndo model
                newTrans =
                    m0.transitions
                        |> Dict.filter (\( fr, _ ) tgt -> not (fr == from && tgt == to))
            in
            { m0
                | transitions = newTrans
                , simMessage = "Deleted transition: " ++ from ++ " → " ++ to
            }
                |> syncCodeFromDiagram

        StartRename stateName ->
            { model
                | renamingState = Just stateName
                , renameValue = stateName
            }

        SetRenameValue v ->
            { model | renameValue = v }

        ConfirmRename ->
            case model.renamingState of
                Nothing -> model

                Just oldName ->
                    let
                        newName = String.trim model.renameValue
                    in
                    if newName == "" || newName == oldName then
                        { model | renamingState = Nothing, renameValue = "" }

                    else if Dict.member newName model.statePositions then
                        { model | renamingState = Nothing, renameValue = "" }

                    else
                        let
                            m0 = saveUndo model

                            pos = Dict.get oldName m0.statePositions
                                    |> Maybe.withDefault { x = 0, y = 0 }

                            newPositions =
                                m0.statePositions
                                    |> Dict.remove oldName
                                    |> Dict.insert newName pos

                            newTransitions =
                                m0.transitions
                                    |> Dict.toList
                                    |> List.map
                                        (\( ( fr, ch ), to ) ->
                                            ( ( if fr == oldName then newName else fr, ch )
                                            , if to == oldName then newName else to
                                            )
                                        )
                                    |> Dict.fromList

                            newAccept =
                                List.map
                                    (\s -> if s == oldName then newName else s)
                                    m0.acceptStates

                            newStart = if m0.startState == oldName then newName else m0.startState
                        in
                        { m0
                            | statePositions = newPositions
                            , transitions = newTransitions
                            , acceptStates = newAccept
                            , startState = newStart
                            , renamingState = Nothing
                            , renameValue = ""
                            , simMessage = "Renamed: " ++ oldName ++ " → " ++ newName
                        }
                            |> syncCodeFromDiagram

        CancelRename ->
            { model | renamingState = Nothing, renameValue = "" }

        SetStartState state ->
            saveUndo model
                |> (\m0 -> { m0 | startState = state, simMessage = "Start state set: " ++ state })
                |> syncCodeFromDiagram

        ToggleAcceptState state ->
            let
                m0 = saveUndo model

                newAccept =
                    if List.member state m0.acceptStates then
                        List.filter ((/=) state) m0.acceptStates

                    else
                        state :: m0.acceptStates
            in
            { m0 | acceptStates = newAccept }
                |> syncCodeFromDiagram

        DeleteState state ->
            let
                m0 = saveUndo model

                newPos = Dict.remove state m0.statePositions

                newTrans = Dict.filter (\(fr, _ ) to -> fr /= state && to /= state) m0.transitions

                newAccept = List.filter ((/=) state) m0.acceptStates

                newStart = if m0.startState == state then "" else m0.startState
            in
            { m0
                | statePositions = newPos
                , transitions = newTrans
                , acceptStates = newAccept
                , startState = newStart
                , simMessage = "Deleted state: " ++ state
            }
                |> syncCodeFromDiagram

        SetTransitionChar c ->
            { model | transitionChar = c }

        ConfirmTransition ->
            let
                m0 = saveUndo model

                newTrans =
                    Dict.insert
                        ( m0.pendingTransFrom, m0.transitionChar )
                        m0.pendingTransTo
                        m0.transitions
            in
            { m0
                | transitions = newTrans
                , showTransCharPopup = False
                , simMessage =
                    model.pendingTransFrom
                        ++ " --["
                        ++ model.transitionChar
                        ++ "]--> "
                        ++ model.pendingTransTo
            }
                |> syncCodeFromDiagram

        CancelTransition ->
            { model | showTransCharPopup = False, transitionFrom = Nothing }

        SetTestWord w ->
            { model | testWord = w }

        LoadDFA ->
            { model
                | currentState = Just model.startState
                , simPosition = 0
                , simHistory = [ ( model.startState, 0 ) ]
                , simMessage = "Loaded. Ready to test: \"" ++ model.testWord ++ "\""
            }

        StepForward -> stepOnce model

        StepBack -> stepBack model

        RunAll -> runToEnd model

        ResetSim ->
            { model
                | currentState = Nothing
                , simPosition = 0
                , simHistory = []
                , simMessage = "Reset. Click 'Load DFA' to start."
                , autoRunning = False
            }

        SetCodeStates v ->
            { model | codeStates = v }

        SetCodeAlphabet v ->
            { model | codeAlphabet = v }

        SetCodeStart v ->
            { model | codeStart = v }

        SetCodeAccept v ->
            { model | codeAccept = v }

        SetCodeTransitions v ->
            { model | codeTransitions = v }

        GenerateDiagramFromCode ->
            generateDiagramFromCode (saveUndo model)

        GenerateCodeFromDiagram ->
            syncCodeFromDiagram model

        ToggleHelp ->
            { model | showHelp = not model.showHelp }

        ToggleFeedback ->
            { model | showFeedback = not model.showFeedback }

        ClearAll ->
            { defaultModel | simMessage = "Cleared everything." }

        NoOp ->
            model

        Undo ->
            case model.undoStack of
                [] ->
                    { model | simMessage = "Nothing to undo." }

                snap :: rest ->
                    applySnapshot snap
                        { model
                            | undoStack = rest
                            , redoStack = List.take 50 (snapshotDiagram model :: model.redoStack)
                            , simMessage = "Undone."
                        }
                        |> syncCodeFromDiagram

        Redo ->
            case model.redoStack of
                [] ->
                    { model | simMessage = "Nothing to redo." }

                snap :: rest ->
                    applySnapshot snap
                        { model
                            | redoStack = rest
                            , undoStack = List.take 50 (snapshotDiagram model :: model.undoStack)
                            , simMessage = "Redone."
                        }
                        |> syncCodeFromDiagram

        StartAutoRun ->
            if model.currentState == Nothing then
                { model
                    | currentState = Just model.startState
                    , simPosition = 0
                    , simHistory = [ ( model.startState, 0 ) ]
                    , autoRunning = True
                    , simMessage = "Auto run started..."
                }
            else
                { model | autoRunning = True, simMessage = "Auto run resumed..." }

        StopAutoRun ->
            { model | autoRunning = False, simMessage = "Paused." }

        SetAutoSpeed ms ->
            { model | autoSpeed = ms }

        AutoTick _ ->
            if not model.autoRunning then
                model
            else if model.simPosition >= String.length model.testWord || model.currentState == Nothing then
                { model | autoRunning = False }
                    |> checkAcceptance
            else
                stepOnce model