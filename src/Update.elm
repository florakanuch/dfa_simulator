module Update exposing (update, defaultModel, formatDfaText, diagramDataFromModel, parseDfaText)

import Dict
import Types exposing (..)
import Simulation exposing (stepOnce, stepBack, runToEnd, checkAcceptance)
import CodeSync exposing (syncCodeFromDiagram, generateDiagramFromCode)
import Lang exposing (Language(..), translations)




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
    , simMessage = (translations EN).simInitial
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
    , language = EN
    , hoveredObject = Nothing
    , showSettings = False
    , autoReorderOnDelete = False
    , leftPanelWidth = 360
    , isDraggingSidebar = False
    , showSaveModal = False
    , showLoadModal = False
    , savedDiagrams = []
    , saveNameInput = ""
    , renamingDiagramId = Nothing
    , renameDialogValue = ""
    , toastMessage = ""
    , toastVisible = False
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



renameStateEverywhere : String -> String -> Model -> Model
renameStateEverywhere old newStateName model =
    let
        renameKey k = if k == old then newStateName else k

        newPositions =
            model.statePositions
                |> Dict.toList
                |> List.map (\( k, v ) -> ( renameKey k, v ))
                |> Dict.fromList

        newTransitions =
            model.transitions
                |> Dict.toList
                |> List.map (\( ( fr, ch ), to ) -> ( ( renameKey fr, ch ), renameKey to ))
                |> Dict.fromList

        newAccept = List.map renameKey model.acceptStates

        newStart = renameKey model.startState
    in
    { model
        | statePositions = newPositions
        , transitions = newTransitions
        , acceptStates = newAccept
        , startState = newStart
    }



reorderAfterDelete : String -> Model -> Model
reorderAfterDelete deleted model =
    case String.toInt (String.dropLeft 1 deleted) of
        Nothing ->
            model

        Just deletedIdx ->
            let
                maxIdx =
                    Dict.keys model.statePositions
                        |> List.filterMap (\k -> String.toInt (String.dropLeft 1 k))
                        |> List.maximum
                        |> Maybe.withDefault -1

                
                indicesToShift =
                    List.range (deletedIdx + 1) (maxIdx + 1)
            in
            List.foldl
                (\idx m ->
                    let
                        oldName = "q" ++ String.fromInt idx
                        newName = "q" ++ String.fromInt (idx - 1)
                    in
                    if Dict.member oldName m.statePositions then
                        renameStateEverywhere oldName newName m
                    else
                        m
                )
                model
                indicesToShift


-------------------------------------------UPDATE-------------------------

update : Msg -> Model -> Model
update msg model =
    let
        t = translations model.language

       
        loadedModel =
            if model.currentState /= Nothing then
                model
            else
                { model
                    | currentState = Just model.startState
                    , simPosition = 0
                    , simHistory = [ ( model.startState, 0 ) ]
                    , simMessage = t.simLoaded model.testWord
                }
    in
    case msg of
        ToggleLanguage ->
            let
                newLang = case model.language of
                    EN -> SK
                    SK -> EN
            in
            { model | language = newLang }

        LoadDFAFromSave states alphabet start accept trans ->
            let
                loaded = { model
                    | codeStates = states
                    , codeAlphabet = alphabet
                    , codeStart = start
                    , codeAccept = accept
                    , codeTransitions = trans
                    }
            in
            generateDiagramFromCode (saveUndo loaded)

        ClickedCanvas x y ->
            case model.drawTool of
                AddStateTool ->
                    let
                        m0 = saveUndo model

                        nextIdx =
                            Dict.keys m0.statePositions
                                |> List.filterMap
                                    (\k ->
                                        if String.startsWith "q" k then
                                            String.toInt (String.dropLeft 1 k)
                                        else
                                            Nothing
                                    )
                                |> List.maximum
                                |> Maybe.map (\n -> n + 1)
                                |> Maybe.withDefault 0

                        name = "q" ++ String.fromInt nextIdx

                        newPositions = Dict.insert name { x = x, y = y } m0.statePositions

                        newStart = if m0.startState == "" then name else m0.startState
                    in
                    { m0
                        | statePositions = newPositions
                        , stateCounter = nextIdx + 1
                        , startState = newStart
                        , simMessage = t.simAdded name
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
                                , simMessage = (case model.language of
                                    EN -> "Now click the target state (from: "
                                    SK -> "Klikni na cieľový stav (od: ") ++ stateName ++ ")"
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
                        m1 =
                            { m0
                                | statePositions = newPos
                                , transitions = newTrans
                                , acceptStates = newAccept
                                , startState = newStart
                                , simMessage = t.simDeleted stateName
                            }
                    in
                    (if model.autoReorderOnDelete then reorderAfterDelete stateName m1 else m1)
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
                        AddStateTool -> t.addState
                        AddTransitionTool -> t.addTransition
                        SelectTool -> t.selectMove
                        DeleteTool -> t.deleteStateTrans
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
                , simMessage = t.simDeletedTrans from to
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
                            , simMessage = t.simRenamed oldName newName
                        }
                            |> syncCodeFromDiagram

        CancelRename ->
            { model | renamingState = Nothing, renameValue = "" }

        SetStartState state ->
            saveUndo model
                |> (\m0 -> { m0 | startState = state, simMessage = t.simSetStart state })
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

                m1 =
                    { m0
                        | statePositions = newPos
                        , transitions = newTrans
                        , acceptStates = newAccept
                        , startState = newStart
                        , simMessage = t.simDeleted state
                    }
            in
            (if model.autoReorderOnDelete then reorderAfterDelete state m1 else m1)
                |> syncCodeFromDiagram

        SetTransitionChar c ->
            { model | transitionChar = c }

        ConfirmTransition ->
            let
                m0 = saveUndo model

                chars =
                    model.transitionChar
                        |> String.split "|"
                        |> List.map String.trim
                        |> List.filter ((/=) "")

                newTrans =
                    List.foldl
                        (\ch acc -> Dict.insert ( m0.pendingTransFrom, ch ) m0.pendingTransTo acc)
                        m0.transitions
                        chars

                charDisplay = String.join "|" chars
            in
            { m0
                | transitions = newTrans
                , showTransCharPopup = False
                , simMessage = t.simTransAdded model.pendingTransFrom charDisplay model.pendingTransTo
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
                , simMessage = t.simLoaded model.testWord
            }

        StepForward -> stepOnce t loadedModel

        StepBack -> stepBack t loadedModel

        RunAll -> runToEnd t loadedModel

        ResetSim ->
            { model
                | currentState = Just model.startState
                , simPosition = 0
                , simHistory = [ ( model.startState, 0 ) ]
                , simMessage = t.simLoaded model.testWord
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
            { defaultModel | simMessage = (translations model.language).simCleared, language = model.language , showSettings = model.showSettings, autoReorderOnDelete = model.autoReorderOnDelete, leftPanelWidth = model.leftPanelWidth, savedDiagrams = model.savedDiagrams}

        NoOp ->
            model

        Undo ->
            case model.undoStack of
                [] ->
                    { model | simMessage = t.simNothingUndo }

                snap :: rest ->
                    applySnapshot snap
                        { model
                            | undoStack = rest
                            , redoStack = List.take 50 (snapshotDiagram model :: model.redoStack)
                            , simMessage = t.simUndone
                        }
                        |> syncCodeFromDiagram

        Redo ->
            case model.redoStack of
                [] ->
                    { model | simMessage = t.simNothingRedo }

                snap :: rest ->
                    applySnapshot snap
                        { model
                            | redoStack = rest
                            , undoStack = List.take 50 (snapshotDiagram model :: model.undoStack)
                            , simMessage = t.simRedone
                        }
                        |> syncCodeFromDiagram

        StartAutoRun ->
            { loadedModel | autoRunning = True, simMessage = t.simAutoStarted }

        StopAutoRun ->
            { model | autoRunning = False, simMessage = t.simPaused }

        SetAutoSpeed ms ->
            { model | autoSpeed = ms }

        HoverEnter target ->
            { model | hoveredObject = Just target }

        HoverLeave ->
            { model | hoveredObject = Nothing }

        KeyDelete ->
            case model.hoveredObject of
                Just (HoverState name) ->
                    let
                        m0 = saveUndo model
                        newPositions = Dict.remove name m0.statePositions
                        newTrans = Dict.filter (\( fr, _ ) to -> fr /= name && to /= name) m0.transitions
                        newAccept = List.filter ((/=) name) m0.acceptStates
                        newStart = if m0.startState == name then "" else m0.startState
                        m1 =
                            { m0
                                | statePositions = newPositions
                                , transitions = newTrans
                                , acceptStates = newAccept
                                , startState = newStart
                                , hoveredObject = Nothing
                                , simMessage = t.simDeleted name
                            }
                    in
                    (if model.autoReorderOnDelete then reorderAfterDelete name m1 else m1)
                        |> syncCodeFromDiagram

                Just (HoverTransition from to) ->
                    let
                        m0 = saveUndo model
                    in
                    { m0
                        | transitions =
                            Dict.filter (\( fr, _ ) tgt -> not (fr == from && tgt == to)) m0.transitions
                        , hoveredObject = Nothing
                        , simMessage = t.simDeletedTrans from to
                    }
                    |> syncCodeFromDiagram

                Nothing ->
                    model

        KeyUndo ->
            update Undo model

        KeyRedo ->
            update Redo model

        ToggleSettings ->
            { model | showSettings = not model.showSettings }

        ToggleAutoReorder ->
            { model | autoReorderOnDelete = not model.autoReorderOnDelete }

        DragSidebarStart ->
            { model | isDraggingSidebar = True }

        DragSidebarMove x ->
            if model.isDraggingSidebar then
                { model | leftPanelWidth = max 40 (min 700 x) }
            else
                model

        DragSidebarEnd ->
            { model | isDraggingSidebar = False }
        
        
        OpenSaveModal ->
            { model
                | showSaveModal = True
                , showSettings = False
                , saveNameInput =
                    if model.saveNameInput == "" then
                        "DFA"
                    else
                        model.saveNameInput
            }

        CloseSaveModal ->
            { model | showSaveModal = False, renamingDiagramId = Nothing }

        SetSaveNameInput s ->
            { model | saveNameInput = s }

        ConfirmSave ->
            let
                name = String.trim model.saveNameInput
                data = diagramDataFromModel model
                newSave =
                    { id = String.fromInt (List.length model.savedDiagrams) ++ model.saveNameInput
                    , name = if name == "" then "DFA" else name
                    , savedAt = ""      
                    , data = data
                    }
            in
            if model.codeStates == "" && model.codeTransitions == "" then
                showToast (translations model.language).toastNothingToSave model
            else
                { model
                    | savedDiagrams = model.savedDiagrams ++ [ newSave ]
                    , saveNameInput = ""
                }
                    |> showToast ((translations model.language).toastSaved newSave.name)

        DeleteSavedDiagram id ->
            { model
                | savedDiagrams = List.filter (\s -> s.id /= id) model.savedDiagrams
            }
                |> showToast (translations model.language).toastDeleted

        LoadSavedDiagram id ->
            case List.filter (\s -> s.id == id) model.savedDiagrams |> List.head of
                Nothing ->
                    model

                Just saved ->
                    { model | showLoadModal = False }
                        |> update (LoadDFAFromSave
                                saved.data.states
                                saved.data.alphabet
                                saved.data.start
                                saved.data.accept
                                saved.data.transitions)
                        |> showToast ((translations model.language).toastLoaded saved.name)

        OpenLoadModal ->
            { model | showLoadModal = True, showSettings = False }

        CloseLoadModal ->
            { model | showLoadModal = False }

        StartRenameDiagram id ->
            let
                current =
                    model.savedDiagrams
                        |> List.filter (\s -> s.id == id)
                        |> List.head
                        |> Maybe.map .name
                        |> Maybe.withDefault ""
            in
            { model | renamingDiagramId = Just id, renameDialogValue = current }

        SetRenameDiagramValue v ->
            { model | renameDialogValue = v }

        ConfirmRenameDiagram ->
            case model.renamingDiagramId of
                Nothing ->
                    model

                Just id ->
                    let
                        newName = String.trim model.renameDialogValue
                    in
                    { model
                        | savedDiagrams =
                            List.map
                                (\s -> if s.id == id then { s | name = if newName == "" then s.name else newName } else s)
                                model.savedDiagrams
                        , renamingDiagramId = Nothing
                        , renameDialogValue = ""
                    }

        CancelRenameDiagram ->
            { model | renamingDiagramId = Nothing, renameDialogValue = "" }

        
        ExportDiagram id -> model

        RequestImportFile -> model

        ImportFileContent text ->
            let
                data = parseDfaText text
                --t = translations model.language
            in
            { model | showLoadModal = False }
                |> update (LoadDFAFromSave
                        data.states
                        data.alphabet
                        data.start
                        data.accept
                        data.transitions)
                |> showToast (t.toastImported "file")

        StorageLoaded diagrams ->
            { model | savedDiagrams = diagrams }

        DismissToast ->
            { model | toastVisible = False }

        ToastTimeout ->
            { model | toastVisible = False }

        ExportSvg -> model
        
        AutoTick _ ->
            if not model.autoRunning then
                model
            else if model.simPosition >= String.length model.testWord || model.currentState == Nothing then
                { model | autoRunning = False }
                    |> checkAcceptance t
            else
                stepOnce t model
        



------------SAVE/LOAD HANDLERS----------

diagramDataFromModel : Model -> DiagramData
diagramDataFromModel model =
    { states = model.codeStates
    , alphabet = model.codeAlphabet
    , start = model.codeStart
    , accept = model.codeAccept
    , transitions = model.codeTransitions
    }



parseDfaText : String -> DiagramData
parseDfaText text =
    let
        ls = String.lines (String.replace "\r" "" text)
        get prefix =
            ls
                |> List.filter (String.startsWith prefix)
                |> List.head
                |> Maybe.map (String.dropLeft (String.length prefix) >> String.trim)
                |> Maybe.withDefault ""
        transStart =
            ls
                |> List.indexedMap Tuple.pair
                |> List.filter (\( _, l ) -> String.trim l == "transitions:")
                |> List.head
                |> Maybe.map Tuple.first
                |> Maybe.withDefault -1
        transitions =
            if transStart >= 0 then
                ls
                    |> List.drop (transStart + 1)
                    |> String.join "\n"
                    |> String.trim
            else
                ""
    in
    { states = get "states: "
    , alphabet = get "alphabet: "
    , start = get "start: "
    , accept = get "accept: "
    , transitions = transitions
    }


formatDfaText : DiagramData -> String
formatDfaText d =
    String.join "\n"
        [ "states: " ++ d.states
        , "alphabet: " ++ d.alphabet
        , "start: " ++ d.start
        , "accept: " ++ d.accept
        , "transitions:"
        , d.transitions
        ]


showToast : String -> Model -> Model
showToast msg model =
    { model | toastMessage = msg, toastVisible = True }