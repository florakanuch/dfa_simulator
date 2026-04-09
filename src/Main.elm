port module Main exposing (main)

import Browser
import Time
import Task
import Process
import Json.Encode as Encode
import Json.Decode as Decode
import Types exposing (Model, Msg(..), SavedDiagram, DiagramData)
import Update exposing (update, defaultModel, formatDfaText, diagramDataFromModel)
import View exposing (view)
import Lang exposing (Language(..))


--------------- outgoing ports ---------------------------------------------------------
port savesToStorage : Encode.Value -> Cmd msg

port triggerFileInput : () -> Cmd msg

port downloadFile : { filename : String, content : String } -> Cmd msg

port sendLanguage : String -> Cmd msg

port exportSvg : String -> Cmd msg


--------------- incoming ports ------------------------------------------

port storageIn : (Encode.Value -> msg) -> Sub msg

port fileContent : (String -> msg) -> Sub msg

port keyboardMsg : (String -> msg) -> Sub msg


------- JSON things ----------------

encodeDiagramData : DiagramData -> Encode.Value
encodeDiagramData d =
    Encode.object
        [ ( "states", Encode.string d.states )
        , ( "alphabet", Encode.string d.alphabet )
        , ( "start", Encode.string d.start )
        , ( "accept", Encode.string d.accept )
        , ( "transitions", Encode.string d.transitions )
        ]


encodeSaved : SavedDiagram -> Encode.Value
encodeSaved s =
    Encode.object
        [ ( "id", Encode.string s.id )
        , ( "name", Encode.string s.name )
        , ( "savedAt", Encode.string s.savedAt )
        , ( "data", encodeDiagramData s.data )
        ]



decodeDiagramData : Decode.Decoder DiagramData
decodeDiagramData =
    Decode.map5 DiagramData
        (Decode.field "states" Decode.string)
        (Decode.field "alphabet" Decode.string)
        (Decode.field "start" Decode.string)
        (Decode.field "accept" Decode.string)
        (Decode.field "transitions" Decode.string)


decodeSaved : Decode.Decoder SavedDiagram
decodeSaved =
    Decode.map4 SavedDiagram
        (Decode.field "id" Decode.string)
        (Decode.field "name" Decode.string)
        (Decode.field "savedAt" Decode.string)
        (Decode.field "data" decodeDiagramData)












init : () -> ( Model, Cmd Msg )
init _ = ( defaultModel, Cmd.none )




subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ if model.autoRunning then
            Time.every (toFloat (2100 - model.autoSpeed)) Types.AutoTick
          else
            Sub.none
        , storageIn
            (\val ->
                case Decode.decodeValue (Decode.list decodeSaved) val of
                    Ok diagrams -> StorageLoaded diagrams
                    Err _ -> StorageLoaded []
            )
        , fileContent ImportFileContent
        , keyboardMsg
            (\key ->
                case key of
                    "undo" -> Undo
                    "redo" -> Redo
                    "delete" -> KeyDelete
                    _ -> NoOp
            )
        ]


-------------- update ports ----------------------------

updateWithPorts : Msg -> Model -> ( Model, Cmd Msg )
updateWithPorts msg model =
    case msg of
        ConfirmSave ->
            let
                newModel = update msg model
            in
            ( newModel
            , Cmd.batch
                [ savesToStorage (Encode.list encodeSaved newModel.savedDiagrams)
                , Task.perform (\_ -> ToastTimeout) ( Process.sleep 2400 )
                ]
            )

        DeleteSavedDiagram _ ->
            let
                newModel = update msg model
            in
            ( newModel
            , Cmd.batch
                [ savesToStorage (Encode.list encodeSaved newModel.savedDiagrams)
                , Task.perform (\_ -> ToastTimeout) ( Process.sleep 2400 )
                ]
            )

        ConfirmRenameDiagram ->
            let
                newModel = update msg model
            in
            ( newModel
            , savesToStorage (Encode.list encodeSaved newModel.savedDiagrams)
            )

        LoadSavedDiagram _ ->
            let
                newModel = update msg model
            in
            ( newModel
            , Task.perform (\_ -> ToastTimeout) (Process.sleep 2400)
            )

        
        ExportDiagram id ->
            let
                newModel = update msg model
                maybeSave = model.savedDiagrams |> List.filter (\s -> s.id == id) |> List.head
            in
            case maybeSave of
                Nothing ->
                    ( newModel, Cmd.none )

                Just saved ->
                    ( { newModel | toastMessage = (Lang.translations model.language).toastExported saved.name, toastVisible = True }
                    , Cmd.batch
                        [ downloadFile
                            { filename = saved.name ++ ".dfa"
                            , content  = formatDfaText saved.data
                            }
                        , Task.perform (\_ -> ToastTimeout) (Process.sleep 2400)
                        ]
                    )

        
        RequestImportFile ->
            ( model, triggerFileInput () )

        
        DismissToast ->
            ( { model | toastVisible = False }, Cmd.none )

        
        ImportFileContent _ ->
            let
                newModel = update msg model
            in
            ( newModel
            , Task.perform (\_ -> ToastTimeout) (Process.sleep 2400)
            )

        
        ExportSvg -> 
            ( model, exportSvg "dfa-diagram.svg" )

        
        ToggleLanguage ->
            let
                newModel = update msg model
                langStr = case newModel.language of
                    EN -> "EN"
                    SK -> "SK"
            in
            ( newModel, sendLanguage langStr )

       
        _ ->
            let
                newModel = update msg model
                needsDismiss =
                    newModel.toastVisible && not model.toastVisible
            in
            ( newModel
            , if needsDismiss then
                Task.perform (\_ -> ToastTimeout) (Process.sleep 2400)
              else
                Cmd.none
            )


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = updateWithPorts
        , subscriptions = subscriptions
        }