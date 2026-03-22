module Types exposing (..)


import Dict exposing (Dict)
import Time
import Lang exposing (Language)


type DrawTool
    = SelectTool
    | AddStateTool
    | AddTransitionTool
    | DeleteTool



type alias StatePos =
    { x : Float
    , y : Float
    }


type alias DragState =
    { stateName : String
    , offsetX : Float
    , offsetY : Float
    }



type alias DiagramSnapshot =
    { statePositions : Dict String StatePos
    , startState : String
    , acceptStates : List String
    , transitions : Dict ( String, String ) String
    , stateCounter : Int
    }



type alias Model =
    { statePositions : Dict String StatePos
    , startState : String
    , acceptStates : List String
    , transitions : Dict ( String, String ) String
    , stateCounter : Int
    , undoStack : List DiagramSnapshot
    , redoStack : List DiagramSnapshot
    , drawTool : DrawTool
    , transitionFrom : Maybe String
    , dragging : Maybe DragState
    , renamingState : Maybe String
    , renameValue : String
    , testWord : String
    , currentState : Maybe String
    , simPosition : Int
    , simHistory : List ( String, Int )
    , simMessage : String
    , codeStates : String
    , codeAlphabet : String
    , codeStart : String
    , codeAccept : String
    , codeTransitions : String
    , showHelp : Bool
    , showFeedback : Bool
    , showTransCharPopup : Bool
    , pendingTransFrom : String
    , pendingTransTo : String
    , transitionChar : String
    , autoRunning : Bool
    , autoSpeed : Int
    , svgZoom : Float
    , svgPanX : Float
    , svgPanY : Float
    , isPanning : Bool
    , panStartX : Float
    , panStartY : Float
    , panStartPanX : Float
    , panStartPanY : Float
    , testCollapsed : Bool
    , codeCollapsed : Bool
    , stateListCollapsed : Bool
    , language : Language
    }


type Msg
    = ClickedCanvas Float Float
    | ClickedState String
    | SetDrawTool DrawTool
    | MouseDownOnState String Float Float
    | MouseMove Float Float
    | MouseUp
    | StartRename String
    | SetRenameValue String
    | ConfirmRename
    | CancelRename
    | SetStartState String
    | ToggleAcceptState String
    | DeleteState String
    | SetTransitionChar String
    | ConfirmTransition
    | CancelTransition
    | SetTestWord String
    | LoadDFA
    | StepForward
    | StepBack
    | RunAll
    | ResetSim
    | SetCodeStates String
    | SetCodeAlphabet String
    | SetCodeStart String
    | SetCodeAccept String
    | SetCodeTransitions String
    | GenerateDiagramFromCode
    | GenerateCodeFromDiagram
    | ToggleHelp
    | ToggleFeedback
    | ClearAll
    | NoOp
    | Undo
    | Redo
    | StartAutoRun
    | StopAutoRun
    | SetAutoSpeed Int
    | AutoTick Time.Posix
    | PanStart Float Float
    | PanMove Float Float
    | PanEnd
    | ZoomIn
    | ZoomOut
    | ResetView
    | ToggleTestPanel
    | ToggleCodePanel
    | ToggleStateList
    | DeleteTransition String String
    | ToggleLanguage
    | LoadDFAFromSave String String String String String
    | RequestSave
    | RequestLoad